from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException

from app.models.document_tag import DocumentTag
from app.models.tag import Tag
from app.schemas.document_tag import DocumentTagCreate, DocumentTagUpdate
from app.services.crud.base_crud import CRUDBase

class DocumentTagCRUD(CRUDBase[DocumentTag, DocumentTagCreate, DocumentTagUpdate]):
    async def get_by_document_and_tag(
        self, db: AsyncSession, *, document_id: int, tag_id: int
    ) -> Optional[DocumentTag]:
        """
        Lấy document_tag theo document_id và tag_id.
        """
        stmt = select(self.model).where(
            and_(
                self.model.document_id == document_id,
                self.model.tag_id == tag_id
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_document_tags(
        self, db: AsyncSession, *, document_id: int
    ) -> List[DocumentTag]:
        """
        Lấy danh sách tags của một document.
        """
        stmt = select(self.model).where(self.model.document_id == document_id)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def create(
        self, db: AsyncSession, *, obj_in: DocumentTagCreate
    ) -> DocumentTag:
        """
        Tạo document_tag mới.
        """
        # Kiểm tra xem document_tag đã tồn tại chưa
        existing = await self.get_by_document_and_tag(
            db, document_id=obj_in.document_id, tag_id=obj_in.tag_id
        )
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Document tag already exists"
            )
        
        db_obj = DocumentTag(
            document_id=obj_in.document_id,
            tag_id=obj_in.tag_id,
            created_at=obj_in.created_at
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def delete_by_document_and_tag(
        self, db: AsyncSession, *, document_id: int, tag_id: int
    ) -> bool:
        """
        Xóa document_tag theo document_id và tag_id.
        """
        obj = await self.get_by_document_and_tag(
            db, document_id=document_id, tag_id=tag_id
        )
        if not obj:
            return False
        
        await db.delete(obj)
        await db.commit()
        return True
    
    async def get_document_tag_names(
        self, db: AsyncSession, *, document_id: int
    ) -> List[str]:
        """
        Lấy danh sách tên tags của một document.
        """
        stmt = (
            select(Tag.tag_name)
            .join(DocumentTag)
            .where(DocumentTag.document_id == document_id)
        )
        result = await db.execute(stmt)
        return result.scalars().all()

document_tag_crud = DocumentTagCRUD(DocumentTag) 