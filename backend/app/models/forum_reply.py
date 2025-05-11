from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class ForumReply(Base):
    __tablename__ = "forum_replies"

    reply_id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.post_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum("approved", "pending", "rejected"), default="approved")
    created_at = Column(String)  
    updated_at = Column(String)  

    