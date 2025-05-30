from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.models.base import get_db
from app.services.crud.tag_crud import tag_crud
from app.schemas.tag import Tag, TagCreate, TagUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Tag])
async def get_tags(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách các tags.
    """
    skip = (page - 1) * per_page
    tags = await tag_crud.get_all(db, skip=skip, limit=per_page)
    return tags

@router.get("/{tag_id}", response_model=Tag)
async def get_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một tag theo ID.
    """
    tag = await tag_crud.get(db, id=tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag

@router.post("/", response_model=Tag)
async def create_tag(
    tag_in: TagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo mới một tag.
    """
    # Kiểm tra xem tag đã tồn tại chưa
    existing_tag = await tag_crud.get_by_name(db, tag_name=tag_in.tag_name)
    if existing_tag:
        raise HTTPException(
            status_code=400,
            detail="Tag already exists"
        )
    
    tag = await tag_crud.create(db, obj_in=tag_in)
    return tag

@router.put("/{tag_id}", response_model=Tag)
async def update_tag(
    tag_id: int,
    tag_in: TagUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một tag.
    """
    tag = await tag_crud.get(db, id=tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    tag = await tag_crud.update(db, db_obj=tag, obj_in=tag_in)
    return tag

@router.delete("/{tag_id}")
async def delete_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một tag.
    """
    success = await tag_crud.delete(db, id=tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return {"message": "Tag deleted successfully"} 