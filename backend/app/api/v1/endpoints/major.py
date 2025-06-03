from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.models.base import get_db
from app.services.crud.major_crud import MajorCRUD
from app.schemas.major import Major, MajorCreate, MajorUpdate
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Major])
async def get_majors(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách các ngành học.
    """
    crud = MajorCRUD(db)
    skip = (page - 1) * per_page
    majors = await crud.get_all(skip=skip, limit=per_page)
    return majors

@router.get("/{major_id}", response_model=Major)
async def get_major(
    major_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một ngành học theo ID.
    """
    crud = MajorCRUD(db)
    major = await crud.get_by_id(major_id)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    return major

@router.get("/code/{major_code}", response_model=Major)
async def get_major_by_code(
    major_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một ngành học theo mã ngành.
    """
    crud = MajorCRUD(db)
    major = await crud.get_by_code(major_code)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    return major

@router.post("/", response_model=Major)
async def create_major(
    major_in: MajorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo mới một ngành học.
    Chỉ admin mới có quyền tạo.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    # Kiểm tra xem mã ngành đã tồn tại chưa
    existing_major = await crud.get_by_code(major_in.major_code)
    if existing_major:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã ngành đã tồn tại"
        )
    
    major = await crud.create(major_in)
    return major

@router.put("/{major_id}", response_model=Major)
async def update_major(
    major_id: int,
    major_in: MajorUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một ngành học.
    Chỉ admin mới có quyền cập nhật.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    # Kiểm tra ngành học có tồn tại không trước khi cập nhật
    existing_major = await crud.get_by_id(major_id)
    if not existing_major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    
    major = await crud.update(major_id, major_in)
    return major

@router.delete("/{major_id}")
async def delete_major(
    major_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một ngành học.
    Chỉ admin mới có quyền xóa.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    # Kiểm tra ngành học có tồn tại không trước khi xóa
    existing_major = await crud.get_by_id(major_id)
    if not existing_major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    
    success = await crud.delete(major_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi xóa ngành học"
        )
    return {"status": "success", "message": "Ngành học đã được xóa thành công"} 