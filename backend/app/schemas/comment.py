from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.schemas.common import ForumStatus, TimeStampBase
from app.schemas.user import User

# Shared properties
class CommentBase(BaseModel):
    content: str
    document_id: int
    parent_comment_id: Optional[int] = None

# Properties to receive on comment creation
class CommentCreate(CommentBase):
    pass

# Properties to receive on comment update
class CommentUpdate(BaseModel):
    content: Optional[str] = None
    parent_comment_id: Optional[int] = None

# Properties shared by models stored in DB
class CommentInDBBase(CommentBase):
    comment_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Properties to return to client
class Comment(CommentInDBBase, TimeStampBase):
    status: ForumStatus
    user: Optional[User] = None
    parent_comment_id: Optional[int] = None
    replies: List["Comment"] = []
    
    class Config:
        from_attributes = True

# Update forward references
Comment.model_rebuild()