from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.base import get_db
from app.schemas.department import Department, DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.services.crud.department_crud import department_crud
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
async def get_departments(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Lấy danh sách các khoa
    """
    departments = await department_crud.get_all(db=db, skip=skip, limit=limit)
    return departments

@router.get("/{id}", response_model=Department)
async def get_department(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Lấy thông tin chi tiết một khoa
    """
    department = await department_crud.get(db, id=id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.get("/slug/{slug}", response_model=Department)
async def get_department_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Lấy thông tin chi tiết một khoa theo slug
    """
    department = await department_crud.get_by_slug(db, slug=slug)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.post("/", response_model=Department)
async def create_department(
    *,
    db: AsyncSession = Depends(get_db),
    department_in: DepartmentCreate,
):
    """
    Tạo mới một khoa
    """
    department = await department_crud.get_by_slug(db, slug=department_in.slug)
    if department:
        raise HTTPException(
            status_code=400,
            detail="Department with this slug already exists"
        )
    department = await department_crud.create(db, obj_in=department_in.model_dump())
    return department

@router.put("/{id}", response_model=Department)
async def update_department(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    department_in: DepartmentUpdate,
):
    """
    Cập nhật thông tin một khoa
    """
    department = await department_crud.get(db, id=id)
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    department = await department_crud.update(db, id=id, obj_in=department_in.model_dump(exclude_unset=True))
    return department

@router.delete("/{id}", response_model=Department)
async def delete_department(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
):

    try:
        department = await department_crud.delete(db, id=id)
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
        return department
    except Exception as e:
        logger.error(f"Error deleting department: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Could not delete department. It may have associated records."
        ) 