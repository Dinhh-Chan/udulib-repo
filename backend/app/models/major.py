from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class Major(Base):
    __tablename__ = "majors"

    major_id = Column(Integer, primary_key=True, index=True)
    major_name = Column(String(100), nullable=False)
    major_code = Column(String(20), nullable=False, unique=True, index=True)
    description = Column(Text)
    created_at = Column(String)  
    updated_at = Column(String)  