from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime
from app.schemas.common import UserRole, UserStatus, TimeStampBase

class UserBase(BaseModel):
    username: constr
    email: EmailStr
    full_name: Optional[constr(max_length=100)] = None
    role: UserRole = UserRole.student
    university_id: Optional[constr(max_length=50)] = None

class UserCreate(UserBase):
    password: constr(min_length=6)
    
class UserGoogleCreate(BaseModel):
    email: EmailStr
    google_id: str
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[constr(max_length=50)] = None
    email: Optional[EmailStr] = None
    full_name: Optional[constr(max_length=100)] = None
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    university_id: Optional[constr(max_length=50)] = None

class User(UserBase, TimeStampBase):
    user_id: int
    status: UserStatus
    google_id: Optional[str] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: Optional[str] = None