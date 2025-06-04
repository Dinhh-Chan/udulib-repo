from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class ForumReply(Base):
    __tablename__ = "forum_replies"

    reply_id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.post_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    parent_reply_id = Column(Integer, ForeignKey("forum_replies.reply_id"), nullable=True)
    content = Column(Text, nullable=False)
    status = Column(Enum("approved", "pending", "rejected", name="forum_status"), default="approved")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="forum_replies")
    post = relationship("ForumPost", back_populates="replies")
    
    # Self-referential relationship for nested replies
    parent_reply = relationship("ForumReply", remote_side=[reply_id], back_populates="child_replies")
    child_replies = relationship("ForumReply", back_populates="parent_reply", cascade="all, delete-orphan")

    