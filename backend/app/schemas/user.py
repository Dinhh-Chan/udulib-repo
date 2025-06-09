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
    avatar_url: Optional[str] = None
    is_private: bool = False

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
    avatar_url: Optional[str] = None
    is_private: Optional[bool] = None
    password: Optional[str] = None

class UserPasswordChange(BaseModel):
    current_password: str = Field(..., description="Mật khẩu hiện tại")
    new_password: str = Field(..., min_length=6, description="Mật khẩu mới (tối thiểu 6 ký tự)")
    confirm_password: str = Field(..., description="Xác nhận mật khẩu mới")

class User(UserBase, TimeStampBase):
    user_id: int
    status: UserStatus
    google_id: Optional[str] = None
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: Optional[str] = None