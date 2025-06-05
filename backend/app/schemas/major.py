from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MajorBase(BaseModel):
    major_name: str = Field(..., min_length=1, max_length=100)
    major_code: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = None
    image_url: Optional[str] = None

class MajorCreate(MajorBase):
    pass

class MajorUpdate(BaseModel):
    major_name: Optional[str] = Field(None, min_length=1, max_length=100)
    major_code: Optional[str] = Field(None, min_length=1, max_length=20)
    description: Optional[str] = None
    image_url: Optional[str] = None

class MajorInDB(MajorBase):
    major_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Major(MajorInDB):
    pass