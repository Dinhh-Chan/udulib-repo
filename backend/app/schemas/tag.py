from pydantic import BaseModel, constr
from typing import Optional
from datetime import datetime

class TagBase(BaseModel):
    tag_name: constr(max_length=50)

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    tag_id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True