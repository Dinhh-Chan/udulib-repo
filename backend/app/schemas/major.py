from pydantic import BaseModel, constr
from typing import Optional
from app.schemas.common import TimeStampBase

class MajorBase(BaseModel):
    major_name: constr(max_length=100)
    major_code: constr(max_length=20)
    description: Optional[str] = None

class MajorCreate(MajorBase):
    pass

class MajorUpdate(BaseModel):
    major_name: Optional[constr(max_length=100)] = None
    major_code: Optional[constr(max_length=20)] = None
    description: Optional[str] = None

class Major(MajorBase, TimeStampBase):
    major_id: int
    
    class Config:
        from_attributes = True