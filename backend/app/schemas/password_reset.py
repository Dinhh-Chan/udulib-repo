from pydantic import BaseModel, EmailStr, Field


class PasswordResetRequest(BaseModel):
    """Schema cho yêu cầu đổi mật khẩu"""
    email: EmailStr = Field(..., description="Email của người dùng")


class PasswordResetConfirm(BaseModel):
    """Schema cho xác nhận đổi mật khẩu"""
    token: str = Field(..., description="Token xác nhận từ email")
    new_password: str = Field(..., min_length=6, description="Mật khẩu mới (tối thiểu 6 ký tự)")


class PasswordResetResponse(BaseModel):
    """Schema phản hồi cho các endpoint password reset"""
    message: str
    success: bool = True 