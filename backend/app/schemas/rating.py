from pydantic import BaseModel, conint
from typing import Optional
from app.schemas.common import TimeStampBase
from app.schemas.user import User

class RatingBase(BaseModel):
    score: conint(ge=0, le=5)  # 0-5 rating

class RatingCreate(RatingBase):
    document_id: int

class RatingUpdate(RatingBase):
    pass

class Rating(RatingBase, TimeStampBase):
    rating_id: int
    document_id: int
    user_id: int
    user: Optional[User] = None
    
    class Config:
        from_attributes = True 
        