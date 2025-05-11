from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    file_path = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(50), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.subject_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    status = Column(Enum("approved", "pending", "rejected"), default="pending")
    view_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    created_at = Column(String)  
    updated_at = Column(String)  
