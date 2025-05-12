from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.document import Document

class SharedLinkBase(BaseModel):
    expiration_date: Optional[datetime] = None

class SharedLinkCreate(SharedLinkBase):
    document_id: int

class SharedLink(SharedLinkBase):
    link_id: int
    document_id: int
    user_id: int
    share_token: str
    created_at: Optional[datetime] = None
    document: Optional[Document] = None
    
    class Config:
        from_attributes = True