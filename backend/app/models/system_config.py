from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class SystemConfig(Base):
    __tablename__ = "system_config"

    config_id = Column(Integer, primary_key=True, index=True)
    config_key = Column(String(50), nullable=False, unique=True)
    config_value = Column(Text, nullable=False)
    description = Column(String(255))
    updated_at = Column(String)  