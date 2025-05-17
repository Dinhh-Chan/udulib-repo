from typing import List, Optional, Any, Dict, Union
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import asc
from sqlalchemy import func
from app.models.subject import Subject
from app.models.academic_year import AcademicYear
from app.schemas.academic_year import AcademicYearCreate, AcademicYearUpdate
from app.services.crud.base_crud import CRUDBase


class CRUDAcademicYear(CRUDBase[AcademicYear, AcademicYearCreate, AcademicYearUpdate]):
    async def create(self, db: Session, *, obj_in: AcademicYearCreate) -> AcademicYear:
        """
        Create a new academic year.
        """
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = AcademicYear(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: Session, *, db_obj: AcademicYear, obj_in: Union[AcademicYearUpdate, Dict[str, Any]]
    ) -> AcademicYear:
        """
        Update an academic year.
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
    
    async def get_by_name(self, db: Session, *, year_name: str) -> Optional[AcademicYear]:
        """
        Get an academic year by name.
        """
        return db.query(self.model).filter(self.model.year_name == year_name).first()
    
    async def get_ordered_years(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[AcademicYear]:
        """
        Get academic years ordered by the year_order field.
        """
        return db.query(self.model).order_by(asc(self.model.year_order)).offset(skip).limit(limit).all()
    
    async def get_latest_year(self, db: Session) -> Optional[AcademicYear]:
        """
        Get the most recent academic year (highest year_order).
        """
        return db.query(self.model).order_by(self.model.year_order.desc()).first()
    
    async def check_name_exists(self, db: Session, *, year_name: str, exclude_id: Optional[int] = None) -> bool:
        """
        Check if an academic year with the given name already exists.
        Optionally exclude a specific ID (useful for updates).
        """
        query = db.query(self.model).filter(self.model.year_name == year_name)
        
        if exclude_id is not None:
            query = query.filter(self.model.year_id != exclude_id)
            
        return db.query(query.exists()).scalar()
    
    async def get_with_subjects_count(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Get academic years with a count of associated subjects.
        """
        result = db.query(
            self.model,
            func.count(Subject.subject_id).label("subjects_count")
        ).outerjoin(
            Subject, Subject.year_id == self.model.year_id
        ).group_by(
            self.model.year_id
        ).order_by(
            self.model.year_order
        ).offset(skip).limit(limit).all()
        
        return [
            {
                **jsonable_encoder(year),
                "subjects_count": count
            }
            for year, count in result
        ]
    async def delete_with_validation(self, db: Session, *, id: int) -> Optional[AcademicYear]:
        """
        Delete an academic year after checking if it can be safely removed 
        (no associated subjects).
        Returns None if the year has associated subjects and can't be deleted.
        """
        from app.models.subject import Subject
        
        # Check if there are any subjects using this academic year
        has_subjects = db.query(
            db.query(Subject).filter(Subject.year_id == id).exists()
        ).scalar()
        
        if has_subjects:
            return None
            
        return await self.delete(db, id=id)

academic_year = CRUDAcademicYear(AcademicYear)