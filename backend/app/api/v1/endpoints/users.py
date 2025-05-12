from fastapi import APIRouter, Depends
from app.schemas.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user's profile"""
    return current_user