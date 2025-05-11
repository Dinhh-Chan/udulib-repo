from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import DeclarativeBase

# Định nghĩa các kiểu generic
ModelType = TypeVar("ModelType", bound=DeclarativeBase)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Base class for CRUD operations on a specific model.
    
    Args:
        model: The SQLAlchemy model class 
        
    Generic Parameters:
        ModelType: The SQLAlchemy model type
        CreateSchemaType: The Pydantic model for creation data validation
        UpdateSchemaType: The Pydantic model for update data validation
    """
    
    def __init__(self, model: Type[ModelType]):
        """
        Initialize CRUD object with model class
        
        Args:
            model: The SQLAlchemy model class
        """
        self.model = model

    async def get(self, db: Session, id: Any) -> Optional[ModelType]:
        """
        Get a single record by ID
        
        Args:
            db: Database session
            id: ID of the record to get
            
        Returns:
            The model instance or None if not found
        """
        return db.query(self.model).filter(self.model.id == id).first()
    
    async def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """
        Get multiple records with pagination
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of model instances
        """
        return db.query(self.model).offset(skip).limit(limit).all()
    
    async def get_count(self, db: Session) -> int:
        """
        Get total count of records
        
        Args:
            db: Database session
            
        Returns:
            Total countbackend/app/services/crud
        """
        return db.query(self.model).count()
    
    async def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        """
        Create a new record
        
        Args:
            db: Database session
            obj_in: Pydantic model with creation data
            
        Returns:
            The created model instance
        """
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    async def update(
        self, db: Session, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """
        Update a record
        
        Args:
            db: Database session
            db_obj: Model instance to update
            obj_in: Pydantic model or dict with update data
            
        Returns:
            The updated model instance
        """
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    async def delete(self, db: Session, *, id: Any) -> ModelType:
        """
        Delete a record by ID
        
        Args:
            db: Database session
            id: ID of the record to delete
            
        Returns:
            The deleted model instance
        """
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj
    
    async def get_by_filter(
        self, db: Session, *, filter_condition: Any, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """
        Get records by a filter condition
        
        Args:
            db: Database session
            filter_condition: SQLAlchemy filter condition
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of model instances matching the filter
        """
        return db.query(self.model).filter(filter_condition).offset(skip).limit(limit).all()

    async def count_by_filter(self, db: Session, *, filter_condition: Any) -> int:
        """
        Count records by a filter condition
        
        Args:
            db: Database session
            filter_condition: SQLAlchemy filter condition
            
        Returns:
            Count of model instances matching the filter
        """
        return db.query(self.model).filter(filter_condition).count()