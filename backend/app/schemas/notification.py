from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: constr(max_length=255)
    content: str
    type: constr(max_length=50)
    reference_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class Notification(NotificationBase):
    notification_id: int
    user_id: int
    is_read: bool = False
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True