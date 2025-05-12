from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.common import HistoryAction
from app.schemas.user import User
from app.schemas.document import Document

class DocumentHistoryBase(BaseModel):
    action: HistoryAction

class DocumentHistoryCreate(DocumentHistoryBase):
    document_id: int

class DocumentHistory(DocumentHistoryBase):
    history_id: int
    document_id: int
    user_id: int
    created_at: Optional[datetime] = None
    user: Optional[User] = None
    document: Optional[Document] = None
    
    class Config:
        from_attributes = True
