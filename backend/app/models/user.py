from sqlalchemy import Column, String, Integer, DateTime, Enum as PgEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base
from app.schemas.common import UserRole, UserStatus  # Enum class

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(100), nullable=True)
    
    # 👇 Quan trọng: dùng ENUM class + đúng tên type trong DB
    role = Column(PgEnum(UserRole, name="user_role"), nullable=False, default=UserRole.student)
    status = Column(PgEnum(UserStatus, name="user_status"), nullable=False, default=UserStatus.active)
    
    google_id = Column(String(100), nullable=True)
    university_id = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)  # URL của avatar lưu trên MinIO
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Quan hệ
    documents = relationship("Document", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    ratings = relationship("Rating", back_populates="user")
    document_histories = relationship("DocumentHistory", back_populates="user")
    shared_links = relationship("SharedLink", back_populates="user")
    forum_posts = relationship("ForumPost", back_populates="user")
    forum_replies = relationship("ForumReply", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
