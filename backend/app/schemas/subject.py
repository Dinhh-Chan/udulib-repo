from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# Shared properties
class SubjectBase(BaseModel):
    subject_name: str
    subject_code: str
    description: Optional[str] = None
    major_id: int
    year_id: int

# Properties to receive on subject creation
class SubjectCreate(SubjectBase):
    pass

# Properties to receive on subject update
class SubjectUpdate(SubjectBase):
    subject_name: Optional[str] = None
    subject_code: Optional[str] = None
    major_id: Optional[int] = None
    year_id: Optional[int] = None

# Properties shared by models stored in DB
class SubjectInDBBase(SubjectBase):
    subject_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Properties to return to client
class Subject(SubjectInDBBase):
    pass