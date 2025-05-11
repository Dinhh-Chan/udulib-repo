from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base

class SharedLink(Base):
    __tablename__ = "shared_links"

    link_id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    share_token = Column(String(100), nullable=False, unique=True)
    expiration_date = Column(String, nullable=True)  
    created_at = Column(String)  

    