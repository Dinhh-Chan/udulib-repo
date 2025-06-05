from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.forum_post_crud import ForumPostCRUD
from app.schemas.forum import ForumPost, ForumPostCreate, ForumPostUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class ForumPostSearchRequest(BaseModel):
    page: int = 1
    per_page: int = 20
    forum_id: Optional[int] = None
    user_id: Optional[int] = None
    status: Optional[str] = None

@router.get("/", response_model=List[ForumPost])
async def read_forum_posts(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    forum_id: Optional[int] = None,
    user_id: Optional[int] = None,
    # Loại bỏ status khỏi query parameters để tăng bảo mật
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách forum posts (cơ bản, không bao gồm status filter).
    Để filter theo status, sử dụng POST /search endpoint.
    """
    crud = ForumPostCRUD(db)
    skip = (page - 1) * per_page
    posts = await crud.get_all(
        skip=skip, 
        limit=per_page,
        forum_id=forum_id,
        user_id=user_id,
        status=None  # Không cho phép filter status qua GET
    )
    return posts

@router.post("/search", response_model=List[ForumPost])
async def search_forum_posts(
    *,
    db: AsyncSession = Depends(get_db),
    search_request: ForumPostSearchRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Tìm kiếm forum posts với các bộ lọc phức tạp (bao gồm status).
    Sử dụng POST để bảo mật thông tin filter.
    """
    # Validate pagination
    if search_request.page < 1:
        search_request.page = 1
    if search_request.per_page < 1 or search_request.per_page > 100:
        search_request.per_page = 20
    
    # Validate status values nếu cần
    allowed_statuses = ["draft", "published", "pending", "rejected", "archived"]
    if search_request.status and search_request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {allowed_statuses}"
        )
    
    crud = ForumPostCRUD(db)
    skip = (search_request.page - 1) * search_request.per_page
    posts = await crud.get_all(
        skip=skip,
        limit=search_request.per_page,
        forum_id=search_request.forum_id,
        user_id=search_request.user_id,
        status=search_request.status
    )
    return posts

@router.get("/{post_id}", response_model=ForumPost)
async def read_forum_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một forum post.
    """
    crud = ForumPostCRUD(db)
    post = await crud.get_by_id(id=post_id)
    if not post:
        raise HTTPException(
            status_code=404,
            detail="Forum post not found"
        )
    return post

@router.post("/", response_model=ForumPost)
async def create_forum_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_in: ForumPostCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo forum post mới.
    """
    crud = ForumPostCRUD(db)
    post = await crud.create(obj_in=post_in, user_id=1)
    return post

@router.put("/{post_id}", response_model=ForumPost)
async def update_forum_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_id: int,
    post_in: ForumPostUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật forum post.
    Chỉ người tạo post hoặc admin mới có quyền cập nhật.
    """
    crud = ForumPostCRUD(db)
    try:
        # Admin có thể cập nhật status của bất kỳ post nào
        if current_user.role == "admin":
            # Admin có thể cập nhật mà không cần kiểm tra ownership
            post = await crud.get_by_id(id=post_id)
            if not post:
                raise HTTPException(
                    status_code=404,
                    detail="Forum post not found"
                )
            # Tạm thời bypass user_id check cho admin
            post_data = post_in.dict(exclude_unset=True)
            if post_data:
                from datetime import datetime
                query = await crud.db.execute(
                    crud.model.__table__.update()
                    .where(crud.model.post_id == post_id)
                    .values(**post_data, updated_at=datetime.now().isoformat())
                )
                await crud.db.commit()
                updated_post = await crud.get_by_id(id=post_id)
                return updated_post
        else:
            # User thường chỉ có thể cập nhật post của mình
            post = await crud.update(id=post_id, obj_in=post_in, user_id=current_user.user_id)
            if not post:
                raise HTTPException(
                    status_code=404,
                    detail="Forum post not found"
                )
            return post
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

@router.delete("/{post_id}")
async def delete_forum_post(
    *,
    db: AsyncSession = Depends(get_db),
    post_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa forum post.
    Chỉ người tạo post hoặc admin mới có quyền xóa.
    """
    crud = ForumPostCRUD(db)
    try:
        # Admin có thể xóa bất kỳ post nào
        if current_user.role == "admin":
            post = await crud.get_by_id(id=post_id)
            if not post:
                raise HTTPException(
                    status_code=404,
                    detail="Forum post not found"
                )
            # Xóa trực tiếp cho admin
            from sqlalchemy import delete
            await crud.db.execute(
                delete(crud.model).where(crud.model.post_id == post_id)
            )
            await crud.db.commit()
            return {"message": "Forum post deleted successfully"}
        else:
            # User thường chỉ có thể xóa post của mình
            success = await crud.delete(id=post_id, user_id=current_user.user_id)
            if not success:
                raise HTTPException(
                    status_code=404,
                    detail="Forum post not found"
                )
            return {"message": "Forum post deleted successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        ) 