from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.user_crud import user_crud
from app.schemas.user import User, UserCreate, UserUpdate
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User)
async def read_current_user(current_user: UserModel = Depends(get_current_user)):
    """
    Lấy thông tin người dùng hiện tại.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_current_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Cập nhật thông tin người dùng hiện tại.
    """
    # Nếu có cập nhật email, kiểm tra email không trùng
    if user_in.email and user_in.email != current_user.email:
        existing_user = await user_crud.get_by_email(db=db, email=user_in.email)
        if existing_user and existing_user.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email đã tồn tại"
            )
    
    # Nếu có cập nhật username, kiểm tra username không trùng
    if user_in.username and user_in.username != current_user.username:
        existing_user = await user_crud.get_by_username(db=db, username=user_in.username)
        if existing_user and existing_user.user_id != current_user.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên đăng nhập đã tồn tại"
            )
    
    # Kiểm tra quyền: User thường không thể thay đổi role và status
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

@router.get("/", response_model=List[User])
async def read_users(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Lấy danh sách người dùng.
    """
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
    """
    Tạo người dùng mới.
    """
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

@router.get("/{user_id}", response_model=User)
async def read_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    current_user: UserModel = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một người dùng.
    """
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: UserModel = Depends(require_role("admin"))
):
    """
    Cập nhật thông tin người dùng.
    """
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    
    # Nếu có cập nhật email, kiểm tra email không trùng
    if user_in.email and user_in.email != user.email:
        existing_user = await user_crud.get_by_email(db=db, email=user_in.email)
        if existing_user and existing_user.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email đã tồn tại"
            )
    
    # Nếu có cập nhật username, kiểm tra username không trùng
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
    """
    Xóa người dùng.
    """
    user = await user_crud.get_by_id(db=db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng"
        )
    await user_crud.delete(db=db, id=user_id)
    return {"status": "success", "message": "Người dùng đã được xóa thành công"}