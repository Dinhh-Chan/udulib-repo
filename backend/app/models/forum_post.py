from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class ForumPost(Base):
    __tablename__ = "forum_posts"

    post_id = Column(Integer, primary_key=True, index=True)
    forum_id = Column(Integer, ForeignKey("forums.forum_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum("approved", "pending", "rejected", name="forum_status"), default="approved")
    views = Column(Integer, default=0, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="forum_posts")
    forum = relationship("Forum", back_populates="posts")
    replies = relationship("ForumReply", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("ForumPostLike", back_populates="post", cascade="all, delete-orphan")

    