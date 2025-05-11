from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.models.base import Base

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String(50), nullable=False)
    reference_id = Column(Integer)
    created_at = Column(String)  

    