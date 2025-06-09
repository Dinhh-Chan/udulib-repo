from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TagBase(BaseModel):
    tag_name: str

class TagCreate(TagBase):
    pass

class TagUpdate(TagBase):
    tag_name: Optional[str] = None

class Tag(TagBase):
    tag_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TagWithDocumentCount(Tag):
    document_count: int = 0