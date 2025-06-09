from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import io
import logging

from app.models.base import get_db
from app.services.crud.user_crud import user_crud
from app.schemas.user import User, UserCreate, UserUpdate, UserPasswordChange
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User as UserModel
from app.services.avatar_service import avatar_service
from app.services.privacy_service import privacy_service
from app.services.minio_service import minio_service

router = APIRouter()

@router.get("/me", response_model=User)
async def read_current_user(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=User)
async def update_current_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    if user_in.email and user_in.email != current_user.email:
        existing_user = await user_crud.get_by_email(db=db, email=user_in.email)
        if existing_user and existing_user.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email đã tồn tại"
            )
    
    if user_in.username and user_in.username != current_user.username:
        existing_user = await user_crud.get_by_username(db=db, username=user_in.username)
        if existing_user and existing_user.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên đăng nhập đã tồn tại"
            )
    
    if user_in.role and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thay đổi vai trò"
        )
    
    if user_in.status and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền thay đổi trạng thái tài khoản"
        )
    
    user = await user_crud.update(db=db, db_obj=current_user, obj_in=user_in)
    return user

@router.put("/me/change-password", response_model=dict)
async def change_password(
    *,
    db: AsyncSession = Depends(get_db),
    password_data: UserPasswordChange,
    current_user: UserModel = Depends(get_current_user)
):
    """Thay đổi mật khẩu của user hiện tại"""
    
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu mới và xác nhận mật khẩu không khớp"
        )
    
    if not user_crud.verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không đúng"
        )
    
    user_update = UserUpdate(password=password_data.new_password)
    await user_crud.update(db=db, db_obj=current_user, obj_in=user_update)
    
    return {"message": "Mật khẩu đã được thay đổi thành công"}

@router.get("/", response_model=List[User])
async def read_users(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserModel = Depends(get_current_user)
):
    skip = (page - 1) * per_page
    users = await user_crud.get_all(
        db=db,
        skip=skip,
        limit=per_page,
        role=role,
        search=search
    )
    return users

@router.post("/", response_model=User)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
    current_user: UserModel = Depends(require_role("admin"))
):
    user = await user_crud.get_by_email(db=db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã tồn tại"
        )
    
    user = await user_crud.get_by_username(db=db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập đã tồn tại"
        )
    
    user = await user_crud.create(db=db, obj_in=user_in)
    return user

@router.post("/upload-avatar", response_model=User)
async def upload_avatar(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user)
):
    return await avatar_service.upload_avatar(db, current_user, file)

def _get_avatar_stream_response(user: UserModel) -> StreamingResponse:
    """Helper function để lấy avatar stream response"""
    if not user.avatar_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng chưa có avatar"
        )
    
    try:
        # Logging để debug
        logging.info(f"Attempting to get avatar for user {user.user_id}: {user.avatar_url}")
        
        # Kiểm tra file có tồn tại không trước khi stream
        file_info = minio_service.get_file_info(user.avatar_url)
        if not file_info:
            logging.warning(f"Avatar file not found in MinIO: {user.avatar_url}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avatar không tồn tại trong hệ thống lưu trữ"
            )
        
        # Lấy file stream từ MinIO
        file_stream = minio_service.get_file_stream(user.avatar_url)
        if not file_stream:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không thể lấy avatar từ hệ thống lưu trữ"
            )
        
        # Lấy content type từ file info đã có
        content_type = file_info.get('content_type', 'image/jpeg')
        
        # Đọc dữ liệu ảnh
        image_data = file_stream.read()
        file_stream.close()
        
        logging.info(f"Successfully retrieved avatar for user {user.user_id}, size: {len(image_data)} bytes")
        
        return StreamingResponse(
            io.BytesIO(image_data),
            media_type=content_type,
            headers={
                "Cache-Control": "public, max-age=3600",
                "Content-Disposition": "inline"
            }
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logging.error(f"Error getting avatar for user {user.user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi server khi lấy avatar"
        )

@router.get("/avatar")
async def get_current_user_avatar(
    current_user: UserModel = Depends(get_current_user)
):
    """Lấy ảnh avatar của user hiện tại"""
    return _get_avatar_stream_response(current_user)

@router.get("/avatar-url")
async def get_current_user_avatar_url(
    current_user: UserModel = Depends(get_current_user)
):
    """Lấy URL avatar của user hiện tại (backward compatibility)"""
    avatar_url = avatar_service.get_avatar_url(current_user)
    return {"avatar_url": avatar_url}

@router.delete("/avatar")
async def delete_current_user_avatar(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    await avatar_service.delete_avatar(db, current_user)
    return {"message": "Xóa avatar thành công"}

@router.post("/toggle-privacy", response_model=User)
async def toggle_privacy(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    updated_user = await privacy_service.toggle_privacy(db, current_user)
    return updated_user

@router.put("/privacy", response_model=User)
async def set_privacy(
    *,
    db: AsyncSession = Depends(get_db),
    is_private: bool,
    current_user: UserModel = Depends(get_current_user)
):
    updated_user = await privacy_service.set_privacy(db, current_user, is_private)
    return updated_user

@router.get("/public", response_model=List[User])
async def get_public_users(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserModel = Depends(get_current_user)
):
    skip = (page - 1) * per_page
    users = await user_crud.get_public_users(
        db=db,
        skip=skip,
        limit=per_page,
        role=role,
        search=search
    )
    return users

@router.get("/{user_id}", response_model=User)
async def read_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_user)
):
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    
    # Kiểm tra quyền xem profile
    # if not privacy_service.can_view_profile(user, current_user):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Hồ sơ này được đặt ở chế độ riêng tư"
    #     )
    
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: UserModel = Depends(require_role("admin"))
):
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    
    if user_in.email and user_in.email != user.email:
        existing_user = await user_crud.get_by_email(db=db, email=user_in.email)
        if existing_user and existing_user.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email đã tồn tại"
            )
    
    if user_in.username and user_in.username != user.username:
        existing_user = await user_crud.get_by_username(db=db, username=user_in.username)
        if existing_user and existing_user.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên đăng nhập đã tồn tại"
            )
    
    user = await user_crud.update(db=db, db_obj=user, obj_in=user_in)
    return user

@router.delete("/{user_id}")
async def delete_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(require_role("admin"))
):
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    await user_crud.delete(db=db, id=user_id)
    return {"status": "success", "message": "Người dùng đã được xóa thành công"}

@router.post("/{user_id}/upload-avatar", response_model=User)
async def upload_avatar_for_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    file: UploadFile = File(...),
    current_user: UserModel = Depends(require_role("admin"))
):
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    return await avatar_service.upload_avatar(db, user, file)

@router.get("/{user_id}/avatar")
async def get_user_avatar(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_user)
):
    """Lấy ảnh avatar của user cụ thể"""
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    
    return _get_avatar_stream_response(user)

@router.get("/{user_id}/avatar-url")
async def get_user_avatar_url(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_user)
):
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    avatar_url = avatar_service.get_avatar_url(user)
    return {"avatar_url": avatar_url}