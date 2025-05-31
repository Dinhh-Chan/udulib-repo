from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload

from app.models.document_history import DocumentHistory
from app.models.document import Document
from app.schemas.document_history import DocumentHistoryCreate

class DocumentHistoryCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[DocumentHistory]:
        result = await self.db.execute(
            select(DocumentHistory)
            .options(
                selectinload(DocumentHistory.user),
                selectinload(DocumentHistory.document).selectinload(Document.subject),
                selectinload(DocumentHistory.document).selectinload(Document.user),
                selectinload(DocumentHistory.document).selectinload(Document.tags)
            )
            .where(DocumentHistory.history_id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        document_id: Optional[int] = None,
        user_id: Optional[int] = None,
        action: Optional[str] = None
    ) -> List[DocumentHistory]:
        query = select(DocumentHistory).options(
            selectinload(DocumentHistory.user),
            selectinload(DocumentHistory.document).selectinload(Document.subject),
            selectinload(DocumentHistory.document).selectinload(Document.user),
            selectinload(DocumentHistory.document).selectinload(Document.tags)
        )
        
        if document_id is not None:
            query = query.where(DocumentHistory.document_id == document_id)
        if user_id is not None:
            query = query.where(DocumentHistory.user_id == user_id)
        if action is not None:
            query = query.where(DocumentHistory.action == action)
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, *, obj_in: DocumentHistoryCreate, user_id: int) -> DocumentHistory:
        """
        Tạo một bản ghi lịch sử truy cập tài liệu mới
        """
        db_obj = DocumentHistory(
            document_id=obj_in.document_id,
            user_id=user_id,
            action=obj_in.action
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        
        # Load các relationship cần thiết
        result = await self.db.execute(
            select(DocumentHistory)
            .options(
                selectinload(DocumentHistory.user),
                selectinload(DocumentHistory.document).selectinload(Document.subject),
                selectinload(DocumentHistory.document).selectinload(Document.user),
                selectinload(DocumentHistory.document).selectinload(Document.tags)
            )
            .where(DocumentHistory.history_id == db_obj.history_id)
        )
        return result.scalar_one()

    async def delete(self, *, id: int, user_id: int = None) -> bool:
        """
        Xóa một bản ghi lịch sử (thường chỉ admin mới có quyền này)
        """
        db_obj = await self.get_by_id(id=id)
        if not db_obj:
            return False

        await self.db.delete(db_obj)
        await self.db.commit()
        return True 