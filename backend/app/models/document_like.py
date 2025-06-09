from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base

class DocumentLike(Base):
    __tablename__ = "document_likes"

    like_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("Document", back_populates="likes")
    user = relationship("User", back_populates="document_likes")

    # Constraints
    __table_args__ = (
        UniqueConstraint('document_id', 'user_id', name='uix_document_like'),
    ) 