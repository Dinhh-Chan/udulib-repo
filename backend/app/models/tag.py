from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class Tag(Base):
    __tablename__ = "tags"

    tag_id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String(50), nullable=False, unique=True, index=True)
    created_at = Column(String)  

    # Relationships
    document_tags = relationship("DocumentTag", back_populates="tag", overlaps="documents")
    documents = relationship("Document", secondary="document_tags", back_populates="tags", overlaps="document_tags")

    