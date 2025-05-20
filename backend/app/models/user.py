from sqlalchemy import Boolean, Column, Integer, String, Enum, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255))
    full_name = Column(String(100))
    role = Column(Enum("student", "lecturer", "admin"), default="student", nullable=False)
    status = Column(Enum("active", "banned", "pending"), default="active", nullable=False)
    google_id = Column(String(100))
    university_id = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    documents = relationship("Document", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    ratings = relationship("Rating", back_populates="user")
    document_histories = relationship("DocumentHistory", back_populates="user")
    shared_links = relationship("SharedLink", back_populates="user")
    forum_posts = relationship("ForumPost", back_populates="user")
    forum_replies = relationship("ForumReply", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
