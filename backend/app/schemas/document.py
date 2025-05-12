from pydantic import BaseModel, constr, conint
from typing import Optional, List
from app.schemas.common import DocumentStatus, TimeStampBase
from app.schemas.tag import Tag
from app.schemas.user import User
from app.schemas.subject import Subject

class DocumentBase(BaseModel):
    title: constr(max_length=255)
    description: Optional[str] = None
    file_path: constr(max_length=255)
    file_size: int
    file_type: constr(max_length=50)
    subject_id: int

class DocumentCreate(DocumentBase):
    tags: Optional[List[str]] = []

class DocumentUpdate(BaseModel):
    title: Optional[constr(max_length=255)] = None
    description: Optional[str] = None
    status: Optional[DocumentStatus] = None
    tags: Optional[List[str]] = None

class Document(DocumentBase, TimeStampBase):
    document_id: int
    user_id: int
    status: DocumentStatus
    view_count: int = 0
    download_count: int = 0
    subject: Optional[Subject] = None
    user: Optional[User] = None
    tags: Optional[List[Tag]] = []
    average_rating: Optional[float] = 0
    
    class Config:
        from_attributes = True

class DocumentListResponse(BaseModel):
    documents: List[Document]
    total: int
    page: int
    per_page: int

class DocumentFilterRequest(BaseModel):
    subject_id: Optional[int] = None
    user_id: Optional[int] = None
    status: Optional[DocumentStatus] = None
    tags: Optional[List[str]] = []
    search: Optional[str] = None
    page: int = 1
    per_page: int = 20
    order_by: Optional[str] = "created_at"
    order_desc: bool = True