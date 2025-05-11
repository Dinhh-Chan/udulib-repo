from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class ForumPost(Base):
    __tablename__ = "forum_posts"

    post_id = Column(Integer, primary_key=True, index=True)
    forum_id = Column(Integer, ForeignKey("forums.forum_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum("approved", "pending", "rejected"), default="approved")
    created_at = Column(String)  
    updated_at = Column(String)  

    