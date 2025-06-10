from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException
from datetime import datetime

from app.models.tag import Tag
from app.models.document_tag import DocumentTag
from app.schemas.tag import TagCreate, TagUpdate
from app.services.crud.base_crud import CRUDBase

class TagCRUD(CRUDBase[Tag, TagCreate, TagUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Tag]:
        """
        Lấy tag theo ID.
        """
        stmt = select(self.model).where(self.model.tag_id == id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, db: AsyncSession, *, tag_name: str) -> Optional[Tag]:
        """
        Lấy tag theo tên.
        """
        stmt = select(self.model).where(self.model.tag_name == tag_name)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def get_all(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Tag]:
        """
        Lấy danh sách tất cả tags.
        """
        stmt = select(self.model).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()
    
    async def get_all_with_document_count(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Tag]:
        """
        Lấy danh sách tất cả tags kèm theo số lượng tài liệu.
        """
        # Sử dụng subquery để đếm số lượng tài liệu cho mỗi tag
        subquery = (
            select(
                DocumentTag.tag_id,
                func.count(DocumentTag.document_id).label("document_count")
            )
            .group_by(DocumentTag.tag_id)
            .subquery()
        )
        
        # Join với bảng tag để lấy thông tin tag và số lượng tài liệu
        stmt = (
            select(
                self.model,
                func.coalesce(subquery.c.document_count, 0).label("document_count")
            )
            .outerjoin(subquery, self.model.tag_id == subquery.c.tag_id)
            .offset(skip)
            .limit(limit)
        )
        
        result = await db.execute(stmt)
        
        # Xử lý kết quả và gán document_count vào đối tượng Tag
        tags_with_count = []
        for tag, count in result:
            setattr(tag, "document_count", count)
            tags_with_count.append(tag)
        
        return tags_with_count
    
    async def create(self, db: AsyncSession, *, obj_in: TagCreate) -> Tag:
        """
        Tạo tag mới.
        """
        db_obj = Tag(
            tag_name=obj_in.tag_name,
            created_at=func.now()
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def update(
        self, db: AsyncSession, *, db_obj: Tag, obj_in: TagUpdate
    ) -> Tag:
        """
        Cập nhật tag.
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def delete(self, db: AsyncSession, *, id: int) -> bool:
        """
        Xóa tag và các liên kết trong document_tags.
        """
        obj = await self.get(db, id=id)
        if not obj:
            return False
        
        try:
            # Xóa các liên kết trong document_tags
            stmt = select(DocumentTag).where(DocumentTag.tag_id == id)
            result = await db.execute(stmt)
            doc_tags = result.scalars().all()
            for doc_tag in doc_tags:
                await db.delete(doc_tag)
            
            # Xóa tag
            await db.delete(obj)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Lỗi khi xóa tag: {str(e)}"
            )

tag_crud = TagCRUD(Tag) 