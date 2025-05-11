from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base

class Rating(Base):
    __tablename__ = "ratings"

    rating_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    score = Column(Integer, nullable=False)  # Between 0 and 5, 0 means like without rating
    created_at = Column(String)  
    updated_at = Column(String)  

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('user_id', 'document_id', name='uix_user_document_rating'),
    )

    