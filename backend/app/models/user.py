from sqlalchemy import Boolean, Column, Integer, String, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship

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
    created_at = Column(String)  
    updated_at = Column(String)  
    last_login = Column(String, nullable=True)  
