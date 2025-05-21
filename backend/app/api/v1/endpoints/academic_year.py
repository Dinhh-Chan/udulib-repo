from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user, require_role
from app.services.crud.academic_year import academic_year
from app.schemas.academic_year import (
    AcademicYear, 
    AcademicYearCreate, 
    AcademicYearUpdate
)

router = APIRouter()

@router.get("/", response_model=List[AcademicYear])
async def get_academic_years(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    ordered: bool = Query(True, description="Order by year_order field")
) -> Any:
    """
    Retrieve all academic years.
    This endpoint is public and does not require authentication.
    
    - **ordered**: If True, returns academic years ordered by year_order.
    """
    if ordered:
        return await academic_year.get_ordered_years(db, skip=skip, limit=limit)
    
    return await academic_year.get_multi(db, skip=skip, limit=limit)

@router.get("/latest", response_model=AcademicYear)
async def get_latest_academic_year(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get the most recent academic year (highest year_order).
    This endpoint is public and does not require authentication.
    """
    latest_year = await academic_year.get_latest_year(db)
    if not latest_year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No academic years found"
        )
    return latest_year

@router.get("/{id}", response_model=AcademicYear)
async def get_academic_year_by_id(
    id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific academic year by ID.
    This endpoint is public and does not require authentication.
    """
    year = await academic_year.get(db, id=id)
    if not year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic year not found"
        )
    return year

@router.post("/", response_model=AcademicYear, status_code=status.HTTP_201_CREATED)
async def create_academic_year(
    *,
    db: Session = Depends(get_db),
    year_in: AcademicYearCreate,
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    """
    Create a new academic year.
    Only admin users can create academic years.
    """
    # Check if year name already exists
    existing_year = await academic_year.get_by_name(db, year_name=year_in.year_name)
    if existing_year:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An academic year with this name already exists"
        )
    
    return await academic_year.create(db, obj_in=year_in)

@router.put("/{id}", response_model=AcademicYear)
async def update_academic_year(
    *,
    db: Session = Depends(get_db),
    id: int,
    year_in: AcademicYearUpdate,
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    """
    Update an academic year.
    Only admin users can update academic years.
    """
    # Check if year exists
    year = await academic_year.get(db, id=id)
    if not year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic year not found"
        )
    
    # If updating the name, check if it already exists
    if year_in.year_name and year_in.year_name != year.year_name:
        name_exists = await academic_year.check_name_exists(
            db, year_name=year_in.year_name, exclude_id=id
        )
        if name_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An academic year with this name already exists"
            )
    
    return await academic_year.update(db, db_obj=year, obj_in=year_in)

@router.delete("/{id}")
async def delete_academic_year(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(require_role(["admin"])),
    force: bool = Query(False, description="Force delete even if the year has associated subjects")
) -> Any:
    """
    Delete an academic year.
    
    Only admin users can delete academic years.
    By default, academic years with associated subjects cannot be deleted.
    Use force=True to override this constraint (use with caution).
    """
    # Check if year exists
    year = await academic_year.get(db, id=id)
    if not year:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Academic year not found"
        )
    
    if force:
        # Force delete regardless of associations
        await academic_year.delete(db, id=id)
    else:
        # Check for associated subjects before deleting
        result = await academic_year.delete_with_validation(db, id=id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete academic year that has associated subjects. Use force=True to override."
            )
    
    return None

@router.get("/with-subjects-count", response_model=List[dict])
async def get_years_with_subjects_count(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(require_role(["admin"]))
) -> Any:
    """
    Get academic years with a count of associated subjects.
    Only admin users can access this endpoint.
    """
    return await academic_year.get_with_subjects_count(db, skip=skip, limit=limit)