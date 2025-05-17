from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base

class SubjectDepartment(Base):
    __tablename__ = "subject_departments"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    created_at = Column(String)

    # Unique constraint
    __table_args__ = (
        UniqueConstraint('subject_id', 'department_id', name='uix_subject_department'),
    ) 