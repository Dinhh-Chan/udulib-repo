from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(Enum("approved", "pending", "rejected"), default="approved")
    created_at = Column(String)
    updated_at = Column(String)

