from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from app.models.base import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate
from pydantic import BaseModel
from fastapi.responses import RedirectResponse
from httpx import AsyncClient
from sqlalchemy import select
from urllib.parse import urlencode

from app.services.crud.user_crud import user_crud
from app.core.config import settings
from app.schemas.common import LoginResponse, UserRole, UserStatus
from app.schemas.auth import RegisterRequest
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.token import Token

class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY,  # Using SECRET_KEY from .env
        algorithm=settings.ALGORITHM  # Using ALGORITHM from .env
    )
    return encoded_jwt

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    username = request.username
    password = request.password
    
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

@router.get("/google/login")
async def google_login():
    """
    Redirect to Google OAuth login page
    """
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={' '.join(settings.GOOGLE_SCOPES)}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return RedirectResponse(google_auth_url)

@router.get("/google/callback")
async def google_callback(
    request: Request,
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Google OAuth callback
    """
    # Exchange code for tokens
    async with AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            }
        )
        
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not validate Google credentials")
        
        tokens = token_response.json()
        
        # Get user info from Google
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not get user info from Google")
        
        user_info = user_response.json()
        
        # Check if user exists
        stmt = select(User).where(User.email == user_info["email"])
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            # Create new user
            user = User(
                email=user_info["email"],
                username=user_info["email"].split("@")[0],
                full_name=user_info.get("name", ""),
                status=UserStatus.active,
                role=UserRole.student,
                google_id=user_info.get("id"),
                avatar_url=user_info.get("picture")
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        # Redirect về frontend kèm token
        params = urlencode({
            "access_token": access_token,
            "username": user.username,
            "email": user.email
        })
        redirect_url = f"http://localhost:3001/auth/google/callback?{params}"
        return RedirectResponse(url=redirect_url)