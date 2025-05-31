from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

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
    per_page: int = Query(20, ge=1, le=100),
    major_id: Optional[int] = None,
    year_id: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve subjects.
    """
    crud = SubjectCRUD(db)
    skip = (page - 1) * per_page
    subjects = await crud.get_all(skip=skip, limit=per_page, major_id=major_id, year_id=year_id)
    return subjects

@router.post("/", response_model=Subject)
async def create_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_in: SubjectCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create new subject.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_code(code=subject_in.subject_code)
    if subject:
        raise HTTPException(
            status_code=400,
            detail="Subject with this code already exists."
        )
    subject = await crud.create(obj_in=subject_in)
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
    Update a subject.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )
    subject = await crud.update(id=subject_id, obj_in=subject_in)
    return subject

@router.get("/{subject_id}", response_model=Subject)
async def read_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Get subject by ID.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )
    return subject

@router.delete("/{subject_id}")
async def delete_subject(
    *,
    db: AsyncSession = Depends(get_db),
    subject_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a subject.
    """
    crud = SubjectCRUD(db)
    subject = await crud.get_by_id(id=subject_id)
    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )
    await crud.delete(id=subject_id)
    return {"status": "success"}

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