from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.inspection import inspect

from app.models.subject import Subject
from app.models.major import Major
from app.models.academic_year import AcademicYear

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        **Parameters**
        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        # Lấy primary key column name
        pk_columns = inspect(self.model).primary_key
        if len(pk_columns) == 1:
            pk_column = pk_columns[0]
            stmt = select(self.model).where(pk_column == id)
        else:
            # Fallback cho composite keys
            stmt = select(self.model).where(self.model.id == id)
        
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        stmt = select(self.model).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, id: int) -> ModelType:
        obj = await self.get(db=db, id=id)
        await db.delete(obj)
        await db.commit()
        return obj

    async def get_count(self, db: AsyncSession) -> int:
        """Get total count of records"""
        stmt = select(self.model).count()
        result = await db.execute(stmt)
        return result.scalar()

    async def get_by_filter(
        self, db: AsyncSession, *, filter_condition: Any, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """Get records by a filter condition"""
        stmt = select(self.model).filter(filter_condition).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def count_by_filter(self, db: AsyncSession, *, filter_condition: Any) -> int:
        """Count records by a filter condition"""
        stmt = select(self.model).filter(filter_condition).count()
        result = await db.execute(stmt)
        return result.scalar()
        
    async def get_by_id(self, db: AsyncSession, *, id: Any, pk_field: str = "id") -> Optional[ModelType]:
        """Truy vấn bản ghi theo khóa chính (có thể tùy chỉnh tên field)."""
        stmt = select(self.model).where(getattr(self.model, pk_field) == id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()