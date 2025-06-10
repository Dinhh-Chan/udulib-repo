from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.base import get_db
from app.services.crud.comment_crud import CommentCRUD
from app.schemas.comment import Comment, CommentCreate, CommentUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.crud.academic_year import AcademicYearCRUD

from app.schemas.academic_year import (
    AcademicYear, 
    AcademicYearCreate, 
    AcademicYearUpdate
)

router = APIRouter()

@router.get("/", response_model=List[AcademicYear])
async def get_academic_years(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách các năm học.
    """
    crud = AcademicYearCRUD(db)
    skip = (page - 1) * per_page
    years = await crud.get_all(skip=skip, limit=per_page)
    return years

@router.get("/latest", response_model=AcademicYear)
async def get_latest_academic_year(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Lấy năm học mới nhất (có year_order cao nhất).
    Endpoint này là công khai và không yêu cầu xác thực.
    """
    crud = AcademicYearCRUD(db)
    latest_year = await crud.get_latest_year()
    if not latest_year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy năm học nào"
        )
    return latest_year

@router.get("/with-subjects-count", response_model=List[dict])
async def get_years_with_subjects_count(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách năm học kèm số lượng môn học liên quan.
    Chỉ admin mới có thể truy cập endpoint này.
    """
    crud = AcademicYearCRUD(db)
    skip = (page - 1) * per_page
    return await crud.get_with_subjects_count(skip=skip, limit=per_page)

@router.get("/{year_id}", response_model=AcademicYear)
async def get_academic_year(
    year_id: int,
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một năm học theo ID.
    """
    crud = AcademicYearCRUD(db)
    year = await crud.get_by_id(year_id)
    if not year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy năm học"
        )
    return year

@router.post("/", response_model=AcademicYear)
async def create_academic_year(
    year_in: AcademicYearCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo mới một năm học.
    Chỉ admin mới có quyền tạo.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = AcademicYearCRUD(db)
    # Kiểm tra xem năm học đã tồn tại chưa
    existing_year = await crud.get_by_name(year_in.year_name)
    if existing_year:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Năm học đã tồn tại"
        )
    
    year = await crud.create(year_in)
    return year

@router.put("/{year_id}", response_model=AcademicYear)
async def update_academic_year(
    year_id: int,
    year_in: AcademicYearUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một năm học.
    Chỉ admin mới có quyền cập nhật.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = AcademicYearCRUD(db)
    # Kiểm tra năm học có tồn tại không trước khi cập nhật
    existing_year = await crud.get_by_id(year_id)
    if not existing_year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy năm học"
        )
    
    year = await crud.update(year_id, year_in)
    return year

@router.delete("/{year_id}")
async def delete_academic_year(
    year_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một năm học.
    Chỉ admin mới có quyền xóa.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = AcademicYearCRUD(db)
    # Kiểm tra năm học có tồn tại không trước khi xóa
    existing_year = await crud.get_by_id(year_id)
    if not existing_year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy năm học"
        )
    
    success = await crud.delete(year_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi xóa năm học"
        )
    return {"status": "success", "message": "Năm học đã được xóa thành công"}

