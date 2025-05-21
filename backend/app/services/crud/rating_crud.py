from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.rating import Rating
from app.schemas.rating import RatingCreate, RatingUpdate

class RatingCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, id: int) -> Optional[Rating]:
        result = await self.db.execute(
            select(Rating)
            .options(selectinload(Rating.user))
            .where(Rating.rating_id == id)
        )
        return result.scalar_one_or_none()

    async def get_by_user_and_document(self, user_id: int, document_id: int) -> Optional[Rating]:
        result = await self.db.execute(
            select(Rating)
            .options(selectinload(Rating.user))
            .where(Rating.user_id == user_id)
            .where(Rating.document_id == document_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        document_id: Optional[int] = None,
        user_id: Optional[int] = None
    ) -> List[Rating]:
        query = select(Rating).options(selectinload(Rating.user))
        
        if document_id is not None:
            query = query.where(Rating.document_id == document_id)
        if user_id is not None:
            query = query.where(Rating.user_id == user_id)
            
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, *, obj_in: RatingCreate, user_id: int) -> Rating:
        # Kiểm tra xem rating đã tồn tại chưa
        existing_rating = await self.get_by_user_and_document(
            user_id=user_id, 
            document_id=obj_in.document_id
        )
        
        # Nếu đã tồn tại, cập nhật rating
        if existing_rating:
            existing_rating.score = obj_in.score
            await self.db.commit()
            await self.db.refresh(existing_rating)
            return existing_rating
        
        # Nếu chưa tồn tại, tạo mới
        db_obj = Rating(
            document_id=obj_in.document_id,
            user_id=user_id,
            score=obj_in.score
        )
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        *,
        id: int,
        obj_in: RatingUpdate,
        user_id: int
    ) -> Optional[Rating]:
        db_obj = await self.get_by_id(id=id)
        if not db_obj:
            return None
        if db_obj.user_id != user_id:
            raise ValueError("Not authorized to update this rating")

        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, *, id: int, user_id: int) -> bool:
        db_obj = await self.get_by_id(id=id)
        if not db_obj:
            return False
        if db_obj.user_id != user_id:
            raise ValueError("Not authorized to delete this rating")

        await self.db.delete(db_obj)
        await self.db.commit()
        return True 