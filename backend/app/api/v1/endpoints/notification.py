from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.notification_crud import NotificationCRUD
from app.schemas.notification import Notification, NotificationCreate, NotificationUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Notification])
async def read_notifications(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    is_read: Optional[bool] = None,
    type: Optional[str] = None,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách notifications của user hiện tại.
    """
    crud = NotificationCRUD(db)
    notifications = await crud.get_all(
        skip=skip, 
        limit=limit,
        user_id=1,
        is_read=is_read,
        type=type
    )
    return notifications

@router.post("/", response_model=Notification)
async def create_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_in: NotificationCreate,
    # current_user: User = Depends(get_current_user)
):
    """
    Tạo notification mới.
    """
    crud = NotificationCRUD(db)
    notification = await crud.create(obj_in=notification_in, user_id=1)
    return notification

@router.get("/{notification_id}", response_model=Notification)
async def read_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một notification.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
    # if notification.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    return notification

@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    notification_in: NotificationUpdate,
    # current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một notification.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
        # if notification.user_id != current_user.user_id and current_user.role != "admin":
        #     raise HTTPException(
        #         status_code=403,
        #         detail="Not enough permissions"
        #     )
    notification = await crud.update(db_obj=notification, obj_in=notification_in)
    return notification

@router.delete("/{notification_id}")
async def delete_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    # current_user: User = Depends(get_current_user)
):
    """
    Xóa một notification.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
    # if notification.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=403,
    #         detail="Not enough permissions"
    #     )
    success = await crud.delete(id=notification_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )
    return {"status": "success"}

@router.post("/mark-all-read")
async def mark_all_notifications_as_read(
    *,
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Đánh dấu tất cả notifications của user hiện tại là đã đọc.
    """
    crud = NotificationCRUD(db)
    success = await crud.mark_all_as_read(user_id=1)
    return {"status": "success"} 