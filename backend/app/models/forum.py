from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Forum(Base):
    __tablename__ = "forums"

    forum_id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  

    