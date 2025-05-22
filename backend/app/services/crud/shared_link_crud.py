from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import secrets
from datetime import datetime

from app.models.shared_link import SharedLink
from app.models.document import Document
from app.schemas.shared_link import SharedLinkCreate, SharedLinkUpdate

class SharedLinkCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[SharedLink]:
        result = await self.db.execute(
            select(SharedLink)
            .options(
                selectinload(SharedLink.user),
                selectinload(SharedLink.document).selectinload(Document.subject),
                selectinload(SharedLink.document).selectinload(Document.tags)
            )
            .where(SharedLink.link_id == id)
        )
        return result.scalar_one_or_none()

    async def get_by_token(self, token: str) -> Optional[SharedLink]:
        result = await self.db.execute(
            select(SharedLink)
            .options(
                selectinload(SharedLink.user),
                selectinload(SharedLink.document).selectinload(Document.subject),
                selectinload(SharedLink.document).selectinload(Document.tags)
            )
            .where(SharedLink.share_token == token)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        document_id: Optional[int] = None,
        user_id: Optional[int] = None
    ) -> List[SharedLink]:
        query = select(SharedLink).options(
            selectinload(SharedLink.user),
            selectinload(SharedLink.document).selectinload(Document.subject),
            selectinload(SharedLink.document).selectinload(Document.tags)
        )
        
        if document_id is not None:
            query = query.where(SharedLink.document_id == document_id)
        if user_id is not None:
            query = query.where(SharedLink.user_id == user_id)
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, *, obj_in: SharedLinkCreate, user_id: int) -> SharedLink:
        """
        Tạo một shared link mới
        """
        # Tạo token ngẫu nhiên
        share_token = secrets.token_urlsafe(32)
        
        db_obj = SharedLink(
            document_id=obj_in.document_id,
            user_id=user_id,
            share_token=share_token,
            expiration_date=obj_in.expiration_date,
            created_at=datetime.utcnow()
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        
        # Load các relationship cần thiết
        result = await self.db.execute(
            select(SharedLink)
            .options(
                selectinload(SharedLink.user),
                selectinload(SharedLink.document).selectinload(Document.subject),
                selectinload(SharedLink.document).selectinload(Document.tags)
            )
            .where(SharedLink.link_id == db_obj.link_id)
        )
        return result.scalar_one()

    async def update(
        self, *, db_obj: SharedLink, obj_in: SharedLinkUpdate
    ) -> SharedLink:
        """
        Cập nhật thông tin shared link
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        
        # Load các relationship cần thiết
        result = await self.db.execute(
            select(SharedLink)
            .options(
                selectinload(SharedLink.user),
                selectinload(SharedLink.document).selectinload(Document.subject),
                selectinload(SharedLink.document).selectinload(Document.tags)
            )
            .where(SharedLink.link_id == db_obj.link_id)
        )
        return result.scalar_one()

    async def delete(self, *, id: int) -> bool:
        """
        Xóa một shared link
        """
        db_obj = await self.get_by_id(id=id)
        if not db_obj:
            return False

        await self.db.delete(db_obj)
        await self.db.commit()
        return True 