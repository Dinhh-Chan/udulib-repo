from pydantic import BaseModel, constr
from typing import Optional
from app.schemas.common import TimeStampBase

class AcademicYearBase(BaseModel):
    year_name: constr(max_length=50)
    year_order: int

class AcademicYearCreate(AcademicYearBase):
    pass

class AcademicYearUpdate(BaseModel):
    year_name: Optional[constr(max_length=50)] = None
    year_order: Optional[int] = None

class AcademicYear(AcademicYearBase, TimeStampBase):
    year_id: int
    
    class Config:
        from_attributes = True