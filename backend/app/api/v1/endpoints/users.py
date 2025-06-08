from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.user_crud import user_crud
from app.schemas.user import User, UserCreate, UserUpdate, UserPasswordChange
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User as UserModel
from app.services.avatar_service import avatar_service
from app.services.privacy_service import privacy_service

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

@router.get("/avatar-url")
async def get_current_user_avatar_url(
    current_user: UserModel = Depends(get_current_user)
):
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