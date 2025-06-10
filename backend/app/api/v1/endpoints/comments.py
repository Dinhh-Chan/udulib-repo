from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.comment_crud import CommentCRUD
from app.schemas.comment import Comment, CommentCreate, CommentUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.common import ForumStatus

router = APIRouter()

@router.get("/", response_model=List[Comment])
async def read_comments(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    document_id: Optional[int] = None,
    user_id: Optional[int] = None,
    parent_comment_id: Optional[int] = None,
    include_replies: bool = Query(False, description="Bao gồm cả replies nếu true"),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách bình luận.
    Nếu parent_comment_id được chỉ định, sẽ trả về replies của comment đó.
    Nếu include_replies=False (mặc định), chỉ trả về top-level comments.
    """
    crud = CommentCRUD(db)
    skip = (page - 1) * per_page
    comments = await crud.get_all(
        skip=skip, 
        limit=per_page,
        document_id=document_id,
        user_id=user_id,
        parent_comment_id=parent_comment_id,
        include_replies=include_replies
    )
    return comments

@router.post("/", response_model=Comment)
async def create_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo bình luận mới.
    Có thể tạo comment mới hoặc reply comment bằng cách chỉ định parent_comment_id.
    """
    crud = CommentCRUD(db)
    try:
        comment = await crud.create(obj_in=comment_in, user_id=current_user.user_id)
        return comment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    comment_in: CommentUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật bình luận.
    """
    crud = CommentCRUD(db)
    try:
        comment = await crud.update(id=comment_id, obj_in=comment_in, user_id=current_user.user_id)
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy bình luận"
            )
        return comment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

@router.get("/{comment_id}", response_model=Comment)
async def read_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    include_replies: bool = Query(False, description="Bao gồm tất cả replies của comment này"),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một bình luận.
    Có thể bao gồm tất cả replies bằng cách set include_replies=true.
    """
    crud = CommentCRUD(db)
    comment = await crud.get_by_id(id=comment_id, include_replies=include_replies)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bình luận"
        )
    return comment

@router.get("/{comment_id}/replies", response_model=List[Comment])
async def get_comment_replies(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy tất cả replies của một comment cụ thể.
    """
    crud = CommentCRUD(db)
    skip = (page - 1) * per_page
    
    # Kiểm tra parent comment có tồn tại không
    parent_comment = await crud.get_by_id(id=comment_id)
    if not parent_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy bình luận gốc"
        )
    
    replies = await crud.get_replies(
        parent_comment_id=comment_id,
        skip=skip,
        limit=per_page
    )
    return replies

@router.delete("/{comment_id}")
async def delete_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một bình luận.
    Lưu ý: Xóa comment sẽ tự động xóa tất cả replies (do CASCADE).
    """
    crud = CommentCRUD(db)
    try:
        success = await crud.delete(id=comment_id, user_id=current_user.user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy bình luận"
            )
        return {"status": "success", "message": "Bình luận và tất cả replies đã được xóa thành công"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        ) 