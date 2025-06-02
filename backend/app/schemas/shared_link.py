from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.user import User
from app.schemas.document import Document

class SharedLinkBase(BaseModel):
    document_id: int = Field(..., gt=0)
    expiration_date: Optional[datetime] = None

class SharedLinkCreate(SharedLinkBase):
    pass

class SharedLinkUpdate(BaseModel):
    expiration_date: Optional[datetime] = None

class SharedLink(SharedLinkBase):
    link_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    share_token: str
    created_at: datetime
    user: Optional[User] = None
    document: Optional[Document] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        
    @classmethod
    def from_orm(cls, obj):
        # Chỉ lấy các thông tin cần thiết từ document
        if obj.document:
            obj.document = {
                "document_id": obj.document.document_id,
                "title": obj.document.title,
                "subject": obj.document.subject
            }
        return super().from_orm(obj)