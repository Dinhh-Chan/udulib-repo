from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any 
from app.models.base import get_db
from app.services.crud.subject_crud import SubjectCRUD
from app.schemas.subject import Subject, SubjectCreate, SubjectUpdate
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Subject])
async def read_subjects(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=200),
    major_id: Optional[int] = None,
    year_id: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách môn học.
    """
    crud = SubjectCRUD(db)
    skip = (page - 1) * per_page
    subjects = await crud.get_all(skip=skip, limit=per_page, major_id=major_id, year_id=year_id)
    return subjects

@router.get("/with-details", response_model=List[dict])
async def read_subjects_with_details(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    major_id: Optional[int] = None,
    year_id: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách môn học kèm thông tin đầy đủ của ngành học và năm học.
    """
    crud = SubjectCRUD(db)
    skip = (page - 1) * per_page
    subjects = await crud.get_all_with_details(skip=skip, limit=per_page, major_id=major_id, year_id=year_id)
    return subjects

@router.get("/count-subject")
async def count_subjects(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Đếm tổng số môn học.
    """
    subject_crud = SubjectCRUD(db)
    count = await subject_crud.count_subject()
    return {"count": count}

@router.get("/academic-year/{academic_year_id}", response_model=List[Subject])
async def read_subjects_by_academic_year(
    *,
    db: AsyncSession = Depends(get_db),
    academic_year_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách môn học theo năm học.
    """
    crud = SubjectCRUD(db)
    skip = (page - 1) * per_page
    subjects = await crud.get_all(
        skip=skip,
        limit=per_page,
        year_id=academic_year_id
    )
    return subjects

@router.post("/", response_model=Subject)
async def create_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_in: SubjectCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo môn học mới.
    """
    crud = SubjectCRUD(db)
    try:
        subject = await crud.create(obj_in=subject_in)
        return subject
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{subject_id}/with-details", response_model=dict)
async def read_subject_with_details(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một môn học kèm thông tin đầy đủ của ngành học và năm học.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id_with_details(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy môn học"
        )
    return subject

@router.get("/{subject_id}", response_model=Subject)
async def read_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một môn học.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy môn học"
        )
    return subject

@router.put("/{subject_id}", response_model=Subject)
async def update_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    subject_in: SubjectUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin môn học.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy môn học"
        )
    
    try:
        subject = await crud.update(id=subject_id, obj_in=subject_in)
        return subject
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{subject_id}")
async def delete_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một môn học.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy môn học"
        )
    await crud.delete(id=subject_id)
    return {"status": "success", "message": "Môn học đã được xóa thành công"}

@router.get("/academic-year/{academic_year_id}", response_model=List[Subject])
async def read_subjects_by_academic_year(
    *,
    db: AsyncSession = Depends(get_db),
    academic_year_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách môn học theo năm học.
    """
    crud = SubjectCRUD(db)
    skip = (page - 1) * per_page
    subjects = await crud.get_all(
        skip=skip,
        limit=per_page,
        year_id=academic_year_id
    )
    return subjects 
