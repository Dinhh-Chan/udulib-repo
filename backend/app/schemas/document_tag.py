from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class DocumentTagBase(BaseModel):
    document_id: int
    tag_id: int

class DocumentTagCreate(DocumentTagBase):
    created_at: Optional[datetime] = None

class DocumentTagUpdate(DocumentTagBase):
    document_id: Optional[int] = None
    tag_id: Optional[int] = None

class DocumentTag(DocumentTagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentTagList(BaseModel):
    tags: List[str] 