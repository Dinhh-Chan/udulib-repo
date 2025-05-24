from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.common import TimeStampBase
from app.schemas.user import User

# Shared properties
class RatingBase(BaseModel):
    document_id: int
    score: int = Field(ge=0, le=5)  # Between 0 and 5, 0 means like without rating

# Properties to receive on rating creation
class RatingCreate(RatingBase):
    pass

# Properties to receive on rating update
class RatingUpdate(BaseModel):
    score: Optional[int] = Field(None, ge=0, le=5)

# Properties shared by models stored in DB
class RatingInDBBase(RatingBase):
    rating_id: int
    user_id: int

    class Config:
        from_attributes = True

# Properties to return to client
class Rating(RatingInDBBase, TimeStampBase):
    user: Optional[User] = None
    
    class Config:
        from_attributes = True 
        