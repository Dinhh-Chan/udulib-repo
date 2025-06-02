from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base

class Major(Base):
    __tablename__ = "majors"

    major_id = Column(Integer, primary_key=True, index=True)
    major_name = Column(String(100), nullable=False)
    major_code = Column(String(20), nullable=False, unique=True, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  