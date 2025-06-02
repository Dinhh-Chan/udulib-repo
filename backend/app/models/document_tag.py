from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base

class DocumentTag(Base):
    __tablename__ = "document_tags"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.tag_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)  

    # Relationships
    document = relationship("Document", back_populates="document_tags", overlaps="documents,tags")
    tag = relationship("Tag", back_populates="document_tags", overlaps="documents,tags")

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('document_id', 'tag_id', name='uix_document_tag'),
    )

    