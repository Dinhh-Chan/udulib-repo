from pydantic import BaseModel, constr
from typing import Optional, List
from app.schemas.common import TimeStampBase
from app.schemas.major import Major
from app.schemas.academic_year import AcademicYear
from app.schemas.relationships import DepartmentSubject

class SubjectBase(BaseModel):
    subject_name: constr(max_length=100)
    subject_code: constr(max_length=20)
    description: Optional[str] = None
    major_id: int
    year_id: int

class SubjectCreate(SubjectBase):
    department_ids: List[int]

class SubjectUpdate(BaseModel):
    subject_name: Optional[constr(max_length=100)] = None
    subject_code: Optional[constr(max_length=20)] = None
    description: Optional[str] = None
    major_id: Optional[int] = None
    year_id: Optional[int] = None
    department_ids: Optional[List[int]] = None

class Subject(SubjectBase, TimeStampBase):
    subject_id: int
    major: Optional[Major] = None
    academic_year: Optional[AcademicYear] = None
    departments: Optional[List[DepartmentSubject]] = []
    
    class Config:
        from_attributes = True

# Resolve forward references
Subject.model_rebuild()