from typing import List, Optional, Any, Dict, Union
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, or_, select
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import selectinload, joinedload

from app.models.document import Document
from app.models.document_tag import DocumentTag
from app.models.document_history import DocumentHistory
from app.models.subject import Subject
from app.models.tag import Tag
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentFilterRequest
from app.services.crud.base_crud import CRUDBase

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Document]:
        """Override để load relationships cho Document"""
        stmt = (
            select(self.model)
            .options(
                joinedload(Document.subject).joinedload(Subject.major),
                joinedload(Document.subject).joinedload(Subject.academic_year),
                joinedload(Document.user),
                selectinload(Document.tags)
            )
            .where(Document.document_id == id)
        )
        result = await db.execute(stmt)
        return result.unique().scalar_one_or_none()

    async def create_with_tags(
        self, db: AsyncSession, *, obj_in: DocumentCreate, user_id: int
    ) -> Document:
        """
        Tạo tài liệu mới với tags.
        """
        obj_in_data = jsonable_encoder(obj_in)
        tags = obj_in_data.pop("tags", [])
        
        # Kiểm tra subject tồn tại
        stmt = select(Subject).where(Subject.subject_id == obj_in_data["subject_id"])
        result = await db.execute(stmt)
        subject = result.scalar_one_or_none()
        if not subject:
            raise HTTPException(
                status_code=404,
                detail=f"Subject with id {obj_in_data['subject_id']} not found"
            )
        
        # Tạo document
        now = datetime.now()
        db_obj = Document(
            **obj_in_data,
            user_id=user_id,
            created_at=now,
            updated_at=now
        )
        db.add(db_obj)
        await db.flush()
        
        # Thêm tags
        for tag_name in tags:
            tag = await self.get_or_create_tag(db, tag_name)
            doc_tag = DocumentTag(
                document_id=db_obj.document_id,
                tag_id=tag.tag_id,
                created_at=now
            )
            db.add(doc_tag)
        
        try:
            await db.commit()
            # Load các relationship và nested relationships
            stmt = (
                select(Document)
                .options(
                    joinedload(Document.subject).joinedload(Subject.major),
                    joinedload(Document.subject).joinedload(Subject.academic_year),
                    joinedload(Document.user),
                    selectinload(Document.tags)
                )
                .where(Document.document_id == db_obj.document_id)
            )
            result = await db.execute(stmt)
            db_obj = result.unique().scalar_one()
            return db_obj
        except Exception as e:
            await db.rollback()
            raise e
    
    async def update_with_tags(
        self, db: AsyncSession, *, db_obj: Document, obj_in: Union[DocumentUpdate, Dict[str, Any]]
    ) -> Document:
        """
        Cập nhật tài liệu với tags.
        """
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        # Cập nhật thông tin cơ bản
        for field in obj_data:
            if field in update_data and field != "tags":
                setattr(db_obj, field, update_data[field])
        
        # Cập nhật tags nếu có
        if "tags" in update_data:
            # Xóa tags cũ
            stmt = select(DocumentTag).where(DocumentTag.document_id == db_obj.document_id)
            result = await db.execute(stmt)
            old_tags = result.scalars().all()
            for tag in old_tags:
                await db.delete(tag)
            
            # Thêm tags mới
            now = datetime.now()
            for tag_name in update_data["tags"]:
                tag = await self.get_or_create_tag(db, tag_name)
                doc_tag = DocumentTag(
                    document_id=db_obj.document_id,
                    tag_id=tag.tag_id,
                    created_at=now
                )
                db.add(doc_tag)
        
        db_obj.updated_at = datetime.now()
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
    
    async def get_filtered_documents(
        self, db: AsyncSession, *, filter_request: DocumentFilterRequest
    ) -> Dict[str, Any]:
        """
        Lấy danh sách tài liệu với bộ lọc.
        """
        query = (
            select(self.model)
            .options(
                joinedload(Document.subject).joinedload(Subject.major),
                joinedload(Document.subject).joinedload(Subject.academic_year),
                joinedload(Document.user),
                selectinload(Document.tags)
            )
        )
        
        # Áp dụng các bộ lọc
        if filter_request.subject_id:
            query = query.where(self.model.subject_id == filter_request.subject_id)
        
        if filter_request.user_id:
            query = query.where(self.model.user_id == filter_request.user_id)
        
        if filter_request.status:
            query = query.where(self.model.status == filter_request.status)
        
        if filter_request.file_type:
            query = query.where(self.model.file_type == filter_request.file_type)
        
        if filter_request.tags:
            query = query.join(DocumentTag).join(Tag).where(
                Tag.tag_name.in_(filter_request.tags)
            )
        
        if filter_request.search:
            search = f"%{filter_request.search}%"
            query = query.where(
                or_(
                    self.model.title.ilike(search),
                    self.model.description.ilike(search)
                )
            )
        
        # Đếm tổng số bản ghi
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query)
        
        # Sắp xếp
        if filter_request.order_by:
            order_column = getattr(self.model, filter_request.order_by)
            if filter_request.order_desc:
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())
        
        # Phân trang
        skip = (filter_request.page - 1) * filter_request.per_page
        query = query.offset(skip).limit(filter_request.per_page)
        
        # Lấy kết quả
        result = await db.execute(query)
        documents = result.unique().scalars().all()
        
        return {
            "documents": documents,
            "total": total,
            "page": filter_request.page,
            "per_page": filter_request.per_page
        }
    
    async def record_view(
        self, db: AsyncSession, *, document_id: int, user_id: int
    ) -> None:
        """
        Ghi nhận lượt xem tài liệu.
        """
        # Tăng lượt xem
        stmt = select(self.model).where(self.model.document_id == document_id)
        result = await db.execute(stmt)
        doc = result.scalar_one()
        doc.view_count += 1
        
        # Ghi lịch sử
        history = DocumentHistory(
            document_id=document_id,
            user_id=user_id,
            action="view",
            created_at=datetime.now()
        )
        db.add(history)
        
        await db.commit()
    
    async def record_download(
        self, db: AsyncSession, *, document_id: int, user_id: int
    ) -> None:
        """
        Ghi nhận lượt tải tài liệu.
        """
        # Tăng lượt tải
        stmt = select(self.model).where(self.model.document_id == document_id)
        result = await db.execute(stmt)
        doc = result.scalar_one()
        doc.download_count += 1
        
        # Ghi lịch sử
        history = DocumentHistory(
            document_id=document_id,
            user_id=user_id,
            action="download",
            created_at=datetime.now()
        )
        db.add(history)
        
        await db.commit()
    
    async def get_or_create_tag(self, db: AsyncSession, tag_name: str):
        """
        Lấy hoặc tạo tag mới.
        """
        stmt = select(Tag).where(Tag.tag_name == tag_name)
        result = await db.execute(stmt)
        tag = result.scalar_one_or_none()
        
        if not tag:
            tag = Tag(
                tag_name=tag_name,
                created_at=datetime.now().isoformat()
            )
            db.add(tag)
            await db.flush()
        
        return tag

    async def delete(self, db: AsyncSession, *, id: int) -> bool:
        """
        Xóa tài liệu và tất cả các dữ liệu liên quan.
        """
        # Lấy document
        stmt = select(self.model).where(self.model.document_id == id)
        result = await db.execute(stmt)
        doc = result.scalar_one_or_none()
        
        if not doc:
            return False
        
        # Import các model cần thiết
        from app.models.comment import Comment
        from app.models.rating import Rating
        from app.models.shared_link import SharedLink
        
        # 1. Xóa các comments
        stmt = select(Comment).where(Comment.document_id == id)
        result = await db.execute(stmt)
        comments = result.scalars().all()
        for comment in comments:
            await db.delete(comment)
        
        # 2. Xóa các ratings
        stmt = select(Rating).where(Rating.document_id == id)
        result = await db.execute(stmt)
        ratings = result.scalars().all()
        for rating in ratings:
            await db.delete(rating)
        
        # 3. Xóa các shared_links
        stmt = select(SharedLink).where(SharedLink.document_id == id)
        result = await db.execute(stmt)
        shared_links = result.scalars().all()
        for link in shared_links:
            await db.delete(link)
        
        # 4. Xóa các document_histories
        stmt = select(DocumentHistory).where(DocumentHistory.document_id == id)
        result = await db.execute(stmt)
        histories = result.scalars().all()
        for history in histories:
            await db.delete(history)
        
        # 5. Xóa các document_tags
        stmt = select(DocumentTag).where(DocumentTag.document_id == id)
        result = await db.execute(stmt)
        doc_tags = result.scalars().all()
        for tag in doc_tags:
            await db.delete(tag)
        
        # 6. Cuối cùng xóa document
        await db.delete(doc)
        await db.commit()
        
        return True
    async def count_document(self, db: AsyncSession):
        documents= await db.execute(select(func.count()).select_from(self.model))
        return documents.scalar_one()

document = CRUDDocument(Document) 