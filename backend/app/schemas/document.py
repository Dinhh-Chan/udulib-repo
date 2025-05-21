from pydantic import BaseModel, constr, conint, Field
from typing import Optional, List
from app.schemas.common import DocumentStatus, TimeStampBase
from app.schemas.tag import Tag
from app.schemas.user import User
from app.schemas.subject import Subject

class DocumentBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    file_path: str = Field(..., max_length=255)
    file_size: int = Field(..., ge=0)
    file_type: str = Field(..., max_length=50)
    subject_id: int = Field(..., gt=0)

class DocumentCreate(DocumentBase):
    tags: Optional[List[str]] = []
    status: DocumentStatus = Field(default="pending")
    view_count: int = Field(default=0, ge=0)
    download_count: int = Field(default=0, ge=0)

class DocumentUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    status: Optional[DocumentStatus] = None
    tags: Optional[List[str]] = None

class Document(DocumentBase, TimeStampBase):
    document_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    status: DocumentStatus = Field(default="pending")
    view_count: int = Field(default=0, ge=0)
    download_count: int = Field(default=0, ge=0)
    subject: Optional[Subject] = None
    user: Optional[User] = None
    tags: Optional[List[Tag]] = []
    average_rating: Optional[float] = Field(default=0.0, ge=0.0, le=5.0)
    
    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[Document]
    total: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    per_page: int = Field(..., ge=1)

class DocumentFilterRequest(BaseModel):
    subject_id: Optional[int] = Field(None, gt=0)
    user_id: Optional[int] = Field(None, gt=0)
    status: Optional[DocumentStatus] = None
    tags: Optional[List[str]] = []
    search: Optional[str] = None
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    order_by: Optional[str] = Field(default="created_at")
    order_desc: bool = Field(default=True)