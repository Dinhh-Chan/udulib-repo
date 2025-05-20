from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class AcademicYearBase(BaseModel):
    year_name: str = Field(..., min_length=1, max_length=50)
    year_order: int = Field(..., ge=1)

class AcademicYearCreate(AcademicYearBase):
    pass

class AcademicYearUpdate(BaseModel):
    year_name: Optional[str] = Field(None, min_length=1, max_length=50)
    year_order: Optional[int] = Field(None, ge=1)

class AcademicYearInDB(AcademicYearBase):
    year_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class AcademicYear(AcademicYearInDB):
    pass