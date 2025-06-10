from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update as sqlalchemy_update
from datetime import datetime
import re
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.crud.base_crud import CRUDBase
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(email_pattern, email))

    def validate_phone(self, phone: str) -> bool:
        """Validate phone number format (Vietnam)"""
        phone_pattern = r'^(0[0-9]{9}|84[0-9]{9})$'
        return bool(re.match(phone_pattern, phone))

    def validate_username(self, username: str) -> bool:
        """Validate username format"""
        # Username chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm
        # Độ dài từ 3-30 ký tự
        username_pattern = r'^[a-zA-Z0-9._]{3,30}$'
        return bool(re.match(username_pattern, username))

    async def check_email_exists(self, db: AsyncSession, email: str, exclude_user_id: Optional[int] = None) -> bool:
        """Kiểm tra email đã tồn tại chưa"""
        query = select(User).where(User.email == email)
        if exclude_user_id:
            query = query.where(User.user_id != exclude_user_id)
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def check_username_exists(self, db: AsyncSession, username: str, exclude_user_id: Optional[int] = None) -> bool:
        """Kiểm tra username đã tồn tại chưa"""
        query = select(User).where(User.username == username)
        if exclude_user_id:
            query = query.where(User.user_id != exclude_user_id)
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def check_phone_exists(self, db: AsyncSession, phone: str, exclude_user_id: Optional[int] = None) -> bool:
        """Kiểm tra số điện thoại đã tồn tại chưa"""
        query = select(User).where(User.phone == phone)
        if exclude_user_id:
            query = query.where(User.user_id != exclude_user_id)
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def validate_user_data(self, db: AsyncSession, data: dict, exclude_user_id: Optional[int] = None) -> None:
        """Validate tất cả thông tin user"""
        if 'email' in data:
            if not self.validate_email(data['email']):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email không hợp lệ"
                )
            if await self.check_email_exists(db, data['email'], exclude_user_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email đã tồn tại"
                )

        if 'username' in data:
            if not self.validate_username(data['username']):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username không hợp lệ. Username phải từ 3-30 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới và dấu chấm"
                )
            if await self.check_username_exists(db, data['username'], exclude_user_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username đã tồn tại"
                )

        if 'phone' in data and data['phone']:
            if not self.validate_phone(data['phone']):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam"
                )
            if await self.check_phone_exists(db, data['phone'], exclude_user_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Số điện thoại đã tồn tại"
                )

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, *, username: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.username == username))
        return result.scalars().first()

    async def get_by_google_id(self, db: AsyncSession, *, google_id: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.google_id == google_id))
        return result.scalars().first()

    async def get_all(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        role: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[User]:
        query = select(User)
        
        if role:
            query = query.where(User.role == role)
        if search:
            search = f"%{search}%"
            query = query.where(
                (User.email.ilike(search)) |
                (User.full_name.ilike(search)) |
                (User.username.ilike(search))
            )
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        # Validate dữ liệu trước khi tạo
        await self.validate_user_data(db, obj_in.dict())
        
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            password_hash=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role,
            university_id=obj_in.university_id,
            phone=obj_in.phone
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: User, obj_in: UserUpdate) -> User:
        # Validate dữ liệu trước khi cập nhật
        update_data = obj_in.dict(exclude_unset=True)
        await self.validate_user_data(db, update_data, exclude_user_id=db_obj.user_id)

        if obj_in.password:
            db_obj.password_hash = get_password_hash(obj_in.password)
        if obj_in.email:
            db_obj.email = obj_in.email
        if obj_in.username:
            db_obj.username = obj_in.username
        if obj_in.full_name:
            db_obj.full_name = obj_in.full_name
        if obj_in.role:
            db_obj.role = obj_in.role
        if obj_in.university_id:
            db_obj.university_id = obj_in.university_id
        if obj_in.avatar_url is not None:
            db_obj.avatar_url = obj_in.avatar_url
        if obj_in.is_private is not None:
            db_obj.is_private = obj_in.is_private
        if obj_in.phone is not None:
            db_obj.phone = obj_in.phone

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update_last_login(self, db: AsyncSession, *, user_id: int):
        stmt = (
            sqlalchemy_update(User)
            .where(User.user_id == user_id)
            .values(last_login=datetime.utcnow())
        )
        await db.execute(stmt)
        await db.commit()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return verify_password(plain_password, hashed_password)

    async def get_by_university(self, db: AsyncSession, *, university_id: int) -> List[User]:
        result = await db.execute(
            select(User).where(User.university_id == university_id)
        )
        return result.scalars().all()

    async def get_active_users(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[User]:
        result = await db.execute(
            select(User)
            .where(User.is_active == True)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_users_by_role(self, db: AsyncSession, *, role: str, skip: int = 0, limit: int = 100) -> List[User]:
        result = await db.execute(
            select(User)
            .where(User.role == role)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, db: AsyncSession, *, id: int) -> Optional[User]:
        return await super().get_by_id(db=db, id=id, pk_field="user_id")

    async def get_public_users(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        role: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[User]:
        """Lấy danh sách user công khai (không private)"""
        query = select(User).where(User.is_private == False)
        
        if role:
            query = query.where(User.role == role)
        if search:
            search = f"%{search}%"
            query = query.where(
                (User.email.ilike(search)) |
                (User.full_name.ilike(search)) |
                (User.username.ilike(search))
            )
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def is_profile_public(self, db: AsyncSession, *, user_id: int) -> bool:
        """Kiểm tra xem profile có public không"""
        user = await self.get_by_id(db, id=user_id)
        return user and not user.is_private


user_crud = CRUDUser(User)
