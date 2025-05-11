from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base

class Subject(Base):
    __tablename__ = "subjects"

    subject_id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String(100), nullable=False)
    subject_code = Column(String(20), nullable=False, index=True)
    description = Column(Text)
    major_id = Column(Integer, ForeignKey("majors.major_id"), nullable=False)
    year_id = Column(Integer, ForeignKey("academic_years.year_id"), nullable=False)
    created_at = Column(String)  
    updated_at = Column(String)  

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('major_id', 'subject_code', name='uix_major_subject_code'),
    )