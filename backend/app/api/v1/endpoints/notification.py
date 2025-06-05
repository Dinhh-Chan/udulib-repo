from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.notification_crud import NotificationCRUD
from app.services.crud.user_crud import user_crud
from app.schemas.notification import Notification, NotificationCreate, NotificationUpdate
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Notification])
async def read_notifications(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = None,
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách thông báo của người dùng hiện tại.
    """
    crud = NotificationCRUD(db)
    skip = (page - 1) * per_page
    notifications = await crud.get_all(
        skip=skip, 
        limit=per_page,
        user_id=current_user.user_id,
        is_read=is_read,
        type=type
    )
    return notifications

@router.post("/", response_model=Notification)
async def create_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_in: NotificationCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo thông báo mới cho người dùng hiện tại.
    """
    crud = NotificationCRUD(db)
    try:
        notification = await crud.create(obj_in=notification_in, user_id=current_user.user_id)
        return notification
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dữ liệu không hợp lệ: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi tạo thông báo"
        )

@router.post("/admin", response_model=Notification)
async def create_notification_for_user(
    *,
    db: AsyncSession = Depends(get_db),
    notification_in: NotificationCreate,
    target_user_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo thông báo cho user_id cụ thể.
    Chỉ admin mới có quyền sử dụng API này.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    if not target_user_id or target_user_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id phải là số nguyên dương"
        )
    
    crud = NotificationCRUD(db)
    
    try:
        notification = await crud.create(obj_in=notification_in, user_id=target_user_id)
        return notification
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dữ liệu không hợp lệ: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi tạo thông báo. Vui lòng kiểm tra lại thông tin người dùng."
        )

@router.get("/{notification_id}", response_model=Notification)
async def read_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một thông báo.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông báo"
        )
    if notification.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập thông báo này"
        )
    return notification

@router.put("/{notification_id}", response_model=Notification)
async def update_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    notification_in: NotificationUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một thông báo.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông báo"
        )
    if notification.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật thông báo này"
        )
    try:
        notification = await crud.update(db_obj=notification, obj_in=notification_in)
        return notification
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi cập nhật thông báo"
        )

@router.delete("/{notification_id}")
async def delete_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một thông báo.
    """
    crud = NotificationCRUD(db)
    notification = await crud.get_by_id(id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông báo"
        )
    if notification.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền xóa thông báo này"
        )
    
    try:
        success = await crud.delete(id=notification_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi khi xóa thông báo"
            )
        return {"status": "success", "message": "Thông báo đã được xóa thành công"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi xóa thông báo"
        )

@router.post("/mark-all-read")
async def mark_all_notifications_as_read(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc.
    """
    crud = NotificationCRUD(db)
    try:
        success = await crud.mark_all_as_read(user_id=current_user.user_id)
        return {"status": "success", "message": "Đã đánh dấu tất cả thông báo là đã đọc"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi cập nhật trạng thái thông báo"
        )

@router.post("/broadcast", response_model=dict)
async def broadcast_notification(
    *,
    db: AsyncSession = Depends(get_db),
    notification_in: NotificationCreate,
    current_user: User = Depends(require_role("admin"))
):
    """
    Gửi thông báo cho tất cả người dùng.
    Chỉ admin mới có quyền sử dụng API này.
    """
    try:
        # Lấy danh sách tất cả người dùng
        users = await user_crud.get_all(db=db)
        
        crud = NotificationCRUD(db)
        success_count = 0
        
        # Tạo thông báo cho từng người dùng
        for user in users:
            try:
                await crud.create(obj_in=notification_in, user_id=user.user_id)
                success_count += 1
            except Exception as e:
                print(f"Error creating notification for user {user.user_id}: {str(e)}")
                continue
        
        return {
            "status": "success",
            "message": f"Đã gửi thông báo cho {success_count}/{len(users)} người dùng"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi gửi thông báo: {str(e)}"
        ) 