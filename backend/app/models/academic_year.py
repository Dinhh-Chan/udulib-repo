from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"

    year_id = Column(Integer, primary_key=True, index=True)
    year_name = Column(String, unique=True, index=True)
    year_order = Column(Integer, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
