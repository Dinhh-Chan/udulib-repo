from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update as sqlalchemy_update
from datetime import datetime

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.crud.base_crud import CRUDBase
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
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
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            password_hash=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role,
            university_id=obj_in.university_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(self, db: AsyncSession, *, db_obj: User, obj_in: UserUpdate) -> User:
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


user_crud = CRUDUser(User)
