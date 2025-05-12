from pydantic import BaseModel
from typing import Optional
from app.schemas.common import ForumStatus, TimeStampBase
from app.schemas.user import User

class CommentBase(BaseModel):
    content: str
    
class CommentCreate(CommentBase):
    document_id: int

class CommentUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[ForumStatus] = None

class Comment(CommentBase, TimeStampBase):
    comment_id: int
    document_id: int
    user_id: int
    status: ForumStatus
    user: Optional[User] = None
    
    class Config:
        from_attributes = True