from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from app.models.base import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate

from app.services.crud.user_crud import user_crud
from app.core.config import settings
from app.schemas.common import LoginResponse
from app.schemas.auth import RegisterRequest 
router = APIRouter()
@router.post("/login", response_model=LoginResponse)
async def login(username: str, password: str, db: AsyncSession = Depends(get_db)):
    user = await user_crud.get_by_username(db=db, username=username)

    if not user:
        user = await user_crud.get_by_email(db=db, email=username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    if not user_crud.verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not active"
        )

    await user_crud.update_last_login(db=db, user_id=user.user_id)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "status": user.status
        }
    }
@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing_user = await user_crud.get_by_email(db=db, email=request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_username = await user_crud.get_by_username(db=db, username=request.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    try:
        user_create = UserCreate(  # Chú ý: nên dùng UserCreate, không phải RegisterRequest
            email=request.email,
            username=request.username,
            password=request.password,
            full_name=request.full_name,
            role=request.role,
            university_id=request.university_id,
        )

        user = await user_crud.create(db=db, obj_in=user_create)

        return {
            "message": "User registered successfully",
            "user_id": user.user_id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        
        if "duplicate key" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email or username already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )