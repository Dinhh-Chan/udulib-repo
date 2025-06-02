from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.forum_crud import ForumCRUD
from app.schemas.forum import Forum, ForumCreate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Forum])
async def read_forums(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách forums.
    """
    crud = ForumCRUD(db)
    skip = (page - 1) * per_page
    forums = await crud.get_all(skip=skip, limit=per_page)
    return forums

@router.get("/{forum_id}", response_model=Forum)
async def read_forum(
    *,
    db: AsyncSession = Depends(get_db),
    forum_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một forum.
    """
    crud = ForumCRUD(db)
    forum = await crud.get_by_id(id=forum_id)
    if not forum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy forum"
        )
    return forum

@router.get("/subject/{subject_id}", response_model=Forum)
async def read_forum_by_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy forum theo subject_id.
    """
    crud = ForumCRUD(db)
    forum = await crud.get_by_subject_id(subject_id=subject_id)
    if not forum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy forum cho môn học này"
        )
    return forum

@router.post("/", response_model=Forum)
async def create_forum(
    *,
    db: AsyncSession = Depends(get_db),
    forum_in: ForumCreate,
    # current_user: User = Depends(get_current_user)
):
    """
    Tạo forum mới.
    Chỉ admin mới có quyền tạo forum.
    """
    # if current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    
    # Kiểm tra subject_id có được cung cấp không
    if not forum_in.subject_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="subject_id là bắt buộc"
        )
    
    crud = ForumCRUD(db)
    
    try:
        # Kiểm tra xem forum cho subject đã tồn tại chưa
        existing_forum = await crud.get_by_subject_id(forum_in.subject_id)
        if existing_forum:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Forum cho môn học này đã tồn tại"
            )
        
        # Tạo forum mới
        forum = await crud.create(obj_in=forum_in)
        return forum
        
    except ValueError as e:
        # Xử lý lỗi khi subject_id không hợp lệ hoặc không tồn tại
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dữ liệu không hợp lệ: {str(e)}"
        )
    except Exception as e:
        # Xử lý các lỗi khác từ database hoặc CRUD operations
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi tạo forum. Vui lòng kiểm tra lại thông tin môn học."
        )

@router.delete("/{forum_id}")
async def delete_forum(
    *,
    db: AsyncSession = Depends(get_db),
    forum_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Xóa một forum.
    Chỉ admin mới có quyền xóa.
    """
    # if current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    
    crud = ForumCRUD(db)
    forum = await crud.get_by_id(id=forum_id)
    if not forum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy forum"
        )
    
    success = await crud.delete(id=forum_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi xóa forum"
        )
    return {"status": "success", "message": "Forum đã được xóa thành công"} 