from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    student = "student"
    lecturer = "lecturer"
    admin = "admin"

class UserStatus(str, Enum):
    active = "active"
    banned = "banned"
    pending = "pending"

class DocumentStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"

class ForumStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"

class HistoryAction(str, Enum):
    view = "view"
    download = "download"

# Base schemas
class TimeStampBase(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Common response models
class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None

class PaginationParams(BaseModel):
    page: int = 1
    per_page: int = 20
    
    @validator('page')
    def page_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('page must be positive')
        return v
    
    @validator('per_page')
    def per_page_limit(cls, v):
        if v <= 0 or v > 100:
            raise ValueError('per_page must be between 1 and 100')
        return v

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict