from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime

class SystemConfigBase(BaseModel):
    config_key: constr(max_length=50)
    config_value: str
    description: Optional[constr(max_length=255)] = None

class SystemConfigCreate(SystemConfigBase):
    pass

class SystemConfigUpdate(BaseModel):
    config_value: Optional[str] = None
    description: Optional[constr(max_length=255)] = None

class SystemConfig(SystemConfigBase):
    config_id: int
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True