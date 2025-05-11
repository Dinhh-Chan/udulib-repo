from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"

    year_id = Column(Integer, primary_key=True, index=True)
    year_name = Column(String(50), nullable=False)
    year_order = Column(Integer, nullable=False)
    created_at = Column(String)  
    updated_at = Column(String)  
