from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime
from app.schemas.common import ForumStatus, TimeStampBase
from app.schemas.subject import Subject
from app.schemas.user import User

class ForumBase(BaseModel):
    subject_id: int
    description: Optional[str] = None

class ForumCreate(ForumBase):
    pass

class ForumUpdate(BaseModel):
    subject_id: Optional[int] = None
    description: Optional[str] = None

class Forum(ForumBase):
    forum_id: int
    created_at: Optional[datetime] = None
    subject: Optional[Subject] = None
    post_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class ForumPostBase(BaseModel):
    title: constr(max_length=255)
    content: str

class ForumPostCreate(ForumPostBase):
    forum_id: int

class ForumPostUpdate(BaseModel):
    title: Optional[constr(max_length=255)] = None
    content: Optional[str] = None
    status: Optional[ForumStatus] = None

class ForumPost(ForumPostBase, TimeStampBase):
    post_id: int
    forum_id: int
    user_id: int
    status: ForumStatus
    views: int = 0
    like_count: int = 0
    user: Optional[User] = None
    reply_count: Optional[int] = 0
    is_liked: Optional[bool] = False  # Để check user hiện tại đã like chưa
    
    class Config:
        from_attributes = True

class ForumReplyBase(BaseModel):
    content: str

class ForumReplyCreate(ForumReplyBase):
    post_id: int
    parent_reply_id: Optional[int] = None

class ForumReplyUpdate(BaseModel):
    content: Optional[str] = None
    status: Optional[ForumStatus] = None

class ForumReply(ForumReplyBase, TimeStampBase):
    reply_id: int
    post_id: int
    user_id: int
    parent_reply_id: Optional[int] = None
    status: ForumStatus
    user: Optional[User] = None
    child_replies: List["ForumReply"] = []
    
    class Config:
        from_attributes = True

class ForumPostLike(BaseModel):
    like_id: int
    post_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ForumPostStats(BaseModel):
    views: int
    like_count: int
    reply_count: int
    is_liked: bool = False