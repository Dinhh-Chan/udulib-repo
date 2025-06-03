from typing import Optional
from datetime import datetime, timedelta
import secrets
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext

from app.models.base import get_db
from app.models.user import User
from app.schemas.password_reset import (
    PasswordResetRequest, 
    PasswordResetConfirm, 
    PasswordResetResponse
)
from app.services.email_service import email_service
from app.core.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Tạm thời lưu token trong memory (nên dùng Redis cho production)
password_reset_tokens = {}


def create_password_reset_token(email: str) -> str:
    """Tạo token đổi mật khẩu"""
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    
    password_reset_tokens[token] = {
        "email": email,
        "expires_at": expires_at,
        "used": False
    }
    
    return token


def verify_password_reset_token(token: str) -> Optional[str]:
    """Xác thực token đổi mật khẩu"""
    token_data = password_reset_tokens.get(token)
    if not token_data:
        return None
    
    if token_data["used"]:
        return None
    
    if datetime.utcnow() > token_data["expires_at"]:
        # Token hết hạn, xóa khỏi memory
        del password_reset_tokens[token]
        return None
    
    return token_data["email"]


def mark_token_as_used(token: str):
    """Đánh dấu token đã được sử dụng"""
    if token in password_reset_tokens:
        password_reset_tokens[token]["used"] = True


@router.post("/request-reset", response_model=PasswordResetResponse)
async def request_password_reset(
    *,
    db: AsyncSession = Depends(get_db),
    user_data: PasswordResetRequest,
    background_tasks: BackgroundTasks
):
    """
    Yêu cầu đổi mật khẩu - gửi email xác nhận
    """
    # Kiểm tra user có tồn tại không
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user:
        # Không tiết lộ rằng email không tồn tại vì lý do bảo mật
        return PasswordResetResponse(
            message="Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đổi mật khẩu."
        )
    
    # Tạo token đổi mật khẩu
    reset_token = create_password_reset_token(user_data.email)
    
    # Gửi email trong background
    background_tasks.add_task(
        email_service.send_password_reset_email,
        to_email=user.email,
        reset_token=reset_token,
        user_name=user.full_name or user.username
    )
    
    return PasswordResetResponse(
        message="Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đổi mật khẩu."
    )


@router.post("/confirm-reset", response_model=PasswordResetResponse)
async def confirm_password_reset(
    *,
    db: AsyncSession = Depends(get_db),
    reset_data: PasswordResetConfirm,
    background_tasks: BackgroundTasks
):
    """
    Xác nhận đổi mật khẩu với token từ email
    """
    # Xác thực token
    email = verify_password_reset_token(reset_data.token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )
    
    # Tìm user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Người dùng không tồn tại"
        )
    
    # Cập nhật mật khẩu mới
    hashed_password = pwd_context.hash(reset_data.new_password)
    user.password_hash = hashed_password
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    
    # Đánh dấu token đã sử dụng
    mark_token_as_used(reset_data.token)
    
    # Gửi email thông báo đổi mật khẩu thành công
    background_tasks.add_task(
        email_service.send_password_changed_notification,
        to_email=user.email,
        user_name=user.full_name or user.username
    )
    
    return PasswordResetResponse(
        message="Mật khẩu đã được thay đổi thành công!"
    )


@router.get("/verify-token/{token}")
async def verify_reset_token(token: str):
    """
    Kiểm tra token có hợp lệ không (dùng cho frontend)
    """
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Token không hợp lệ hoặc đã hết hạn"
        )
    
    return {
        "valid": True,
        "email": email,
        "message": "Token hợp lệ"
    } 