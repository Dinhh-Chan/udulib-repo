from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.models.base import Base

class DocumentHistory(Base):
    __tablename__ = "document_history"

    history_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    action = Column(Enum("view", "download"), nullable=False)
    created_at = Column(String)  

    