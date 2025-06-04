from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.rating_crud import RatingCRUD
from app.schemas.rating import Rating, RatingCreate, RatingUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Rating])
async def read_ratings(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    document_id: Optional[int] = None,
    user_id: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách đánh giá.
    """
    crud = RatingCRUD(db)
    skip = (page - 1) * per_page
    ratings = await crud.get_all(
        skip=skip, 
        limit=per_page,
        document_id=document_id,
        user_id=user_id
    )
    return ratings

@router.post("/", response_model=Rating)
async def create_rating(
    *,
    db: AsyncSession = Depends(get_db),
    rating_in: RatingCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo đánh giá mới.
    """
    crud = RatingCRUD(db)
    rating = await crud.create(obj_in=rating_in, user_id=current_user.user_id)
    return rating

@router.put("/{rating_id}", response_model=Rating)
async def update_rating(
    *,
    db: AsyncSession = Depends(get_db),
    rating_id: int,
    rating_in: RatingUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật đánh giá.
    """
    crud = RatingCRUD(db)
    try:
        rating = await crud.update(id=rating_id, obj_in=rating_in, user_id=current_user.user_id)
        if not rating:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy đánh giá"
            )
        return rating
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

@router.get("/{rating_id}", response_model=Rating)
async def read_rating(
    *,
    db: AsyncSession = Depends(get_db),
    rating_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một đánh giá.
    """
    crud = RatingCRUD(db)
    rating = await crud.get_by_id(id=rating_id)
    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đánh giá"
        )
    return rating

@router.delete("/{rating_id}")
async def delete_rating(
    *,
    db: AsyncSession = Depends(get_db),
    rating_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một đánh giá.
    """
    crud = RatingCRUD(db)
    try:
        success = await crud.delete(id=rating_id, user_id=current_user.user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy đánh giá"
            )
        return {"status": "success", "message": "Đánh giá đã được xóa thành công"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        ) 