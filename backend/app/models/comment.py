from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("comments.comment_id"), nullable=True)
    status = Column(Enum("approved", "pending", "rejected", name="forum_status"), default="approved")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="comments")
    document = relationship("Document", back_populates="comments")
    
    # Self-referential relationship for replies
    parent = relationship("Comment", remote_side=[comment_id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")

  
