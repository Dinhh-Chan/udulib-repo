from pydantic import BaseModel, EmailStr, constr, Field
from typing import Optional
from datetime import datetime
from app.schemas.common import UserRole, UserStatus, TimeStampBase

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    role: UserRole = UserRole.student
    university_id: Optional[str] = Field(None, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    
class UserGoogleCreate(BaseModel):
    email: EmailStr
    google_id: str
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    university_id: Optional[str] = Field(None, max_length=50)

class User(UserBase, TimeStampBase):
    user_id: int
    status: UserStatus
    google_id: Optional[str] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: Optional[str] = None