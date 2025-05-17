from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from app.models.base import get_db
from app.services.crud.user_crud import user_crud
from app.core.config import settings
from app.schemas.common import LoginResponse
from app.schemas.auth import RegisterRequest 

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
        settings.JWT_SECRET_KEY,
        algorithm=settings.ALGORITHM 
    )
    return encoded_jwt

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(username: str, password: str, db: Session = Depends(get_db)):
    """Login with username/email or password"""
    # No await needed since methods are now synchronous
    user = user_crud.get_by_username(db=db, username=username)
    
    if not user:
        user = user_crud.get_by_email(db=db, email=username)
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
    
    # Update last login timestamp
    user_crud.update_last_login(db=db, user_id=user.user_id)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.user_id)},
        expires_delta=access_token_expires
    )
    
    # Return the token and user information
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
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Kiểm tra email đã tồn tại
    existing_user = user_crud.get_by_email(db=db, email=request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Kiểm tra username đã tồn tại
    existing_username = user_crud.get_by_username(db=db, username=request.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    try:
        # Chuyển đổi RegisterRequest sang UserCreate
        user_create = RegisterRequest(
            email=request.email,
            username=request.username,
            password=request.password,
            full_name=request.full_name,
            role=request.role,
            university_id=request.university_id,
            phone_number=request.phone_number
        )
        
        # Tạo user
        user = user_crud.create(
            db=db,
            obj_in=user_create
        )
        
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
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )