from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.models.base import get_db
from app.services.crud.shared_link_crud import SharedLinkCRUD
from app.schemas.shared_link import SharedLink, SharedLinkCreate, SharedLinkUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[SharedLink])
async def read_shared_links(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    document_id: Optional[int] = None,
    user_id: Optional[int] = None,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách shared links.
    """
    crud = SharedLinkCRUD(db)
    links = await crud.get_all(
        skip=skip, 
        limit=limit,
        document_id=document_id,
        user_id=user_id
    )
    return links

@router.post("/", response_model=SharedLink)
async def create_shared_link(
    *,
    db: AsyncSession = Depends(get_db),
    link_in: SharedLinkCreate,
    # current_user: User = Depends(get_current_user)
):
    """
    Tạo shared link mới.
    """
    crud = SharedLinkCRUD(db)
    link = await crud.create(obj_in=link_in, user_id=1)
    return link

@router.get("/{link_id}", response_model=SharedLink)
async def read_shared_link(
    *,
    db: AsyncSession = Depends(get_db),
    link_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một shared link.
    """
    crud = SharedLinkCRUD(db)
    link = await crud.get_by_id(id=link_id)
    if not link:
        raise HTTPException(
            status_code=404,
            detail="Shared link not found"
        )
    return link

@router.get("/token/{token}", response_model=SharedLink)
async def read_shared_link_by_token(
    *,
    db: AsyncSession = Depends(get_db),
    token: str
):
    """
    Lấy thông tin chi tiết của một shared link theo token.
    Không yêu cầu xác thực.
    """
    crud = SharedLinkCRUD(db)
    link = await crud.get_by_token(token=token)
    if not link:
        raise HTTPException(
            status_code=404,
            detail="Shared link not found"
        )
    return link

@router.put("/{link_id}", response_model=SharedLink)
async def update_shared_link(
    *,
    db: AsyncSession = Depends(get_db),
    link_id: int,
    link_in: SharedLinkUpdate,
    # current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một shared link.
    """
    crud = SharedLinkCRUD(db)
    link = await crud.get_by_id(id=link_id)
    if not link:
        raise HTTPException(
            status_code=404,
            detail="Shared link not found"
        )
    # if link.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    link = await crud.update(db_obj=link, obj_in=link_in)
    return link

@router.delete("/{link_id}")
async def delete_shared_link(
    *,
    db: AsyncSession = Depends(get_db),
    link_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Xóa một shared link.
    """
    crud = SharedLinkCRUD(db)
    link = await crud.get_by_id(id=link_id)
    if not link:
        raise HTTPException(
            status_code=404,
            detail="Shared link not found"
        )
    # if link.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    success = await crud.delete(id=link_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Shared link not found"
        )
    return {"status": "success"} 