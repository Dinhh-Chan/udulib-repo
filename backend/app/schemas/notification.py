from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.user import User

class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str
    type: str = Field(..., min_length=1, max_length=50)
    reference_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class Notification(NotificationBase):
    notification_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)
    is_read: bool = False
    created_at: datetime
    user: Optional[User] = None
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        
    @classmethod
    def from_orm(cls, obj):
        # Chỉ lấy các thông tin cần thiết từ user
        if obj.user:
            obj.user = {
                "user_id": obj.user.user_id,
                "email": obj.user.email,
                "full_name": obj.user.full_name
            }
        return super().from_orm(obj)