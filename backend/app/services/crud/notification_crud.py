from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from datetime import datetime

from app.models.notification import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate

class NotificationCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[Notification]:
        result = await self.db.execute(
            select(Notification)
            .options(selectinload(Notification.user))
            .where(Notification.notification_id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        user_id: Optional[int] = None,
        is_read: Optional[bool] = None,
        type: Optional[str] = None
    ) -> List[Notification]:
        query = select(Notification).options(selectinload(Notification.user))
        
        if user_id is not None:
            query = query.where(Notification.user_id == user_id)
        if is_read is not None:
            query = query.where(Notification.is_read == is_read)
        if type is not None:
            query = query.where(Notification.type == type)
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, *, obj_in: NotificationCreate, user_id: int) -> Notification:
        """
        Tạo một notification mới
        """
        db_obj = Notification(
            user_id=user_id,
            title=obj_in.title,
            content=obj_in.content,
            type=obj_in.type,
            reference_id=obj_in.reference_id,
            created_at=datetime.utcnow()
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        
        # Load relationship cần thiết
        result = await self.db.execute(
            select(Notification)
            .options(selectinload(Notification.user))
            .where(Notification.notification_id == db_obj.notification_id)
        )
        return result.scalar_one()

    async def update(
        self, *, db_obj: Notification, obj_in: NotificationUpdate
    ) -> Notification:
        """
        Cập nhật thông tin notification
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        
        # Load relationship cần thiết
        result = await self.db.execute(
            select(Notification)
            .options(selectinload(Notification.user))
            .where(Notification.notification_id == db_obj.notification_id)
        )
        return result.scalar_one()

    async def delete(self, *, id: int) -> bool:
        """
        Xóa một notification
        """
        db_obj = await self.get_by_id(id=id)
        if not db_obj:
            return False

        await self.db.delete(db_obj)
        await self.db.commit()
        return True

    async def mark_all_as_read(self, *, user_id: int) -> bool:
        """
        Đánh dấu tất cả notification của user là đã đọc
        """
        query = select(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        result = await self.db.execute(query)
        notifications = result.scalars().all()
        
        for notification in notifications:
            notification.is_read = True
            self.db.add(notification)
        
        await self.db.commit()
        return True 