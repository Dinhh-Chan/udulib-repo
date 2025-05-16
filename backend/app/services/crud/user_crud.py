from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.crud.base_crud import CRUDBase
from app.core.security import get_password_hash, verify_password

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    # Remove async from these methods since SQLAlchemy operations are synchronous
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()
    
    def get_by_google_id(self, db: Session, *, google_id: str) -> Optional[User]:
        return db.query(User).filter(User.google_id == google_id).first()
    def update (self, db:Session, *, db_obj: User, obj_in: UserUpdate) -> User:
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
        db.commit()
        db.refresh(db_obj)
        return db_obj
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            password_hash=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role,
            university_id=obj_in.university_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_last_login(self, db: Session, *, user_id: int):
        from datetime import datetime
        db.query(User).filter(User.user_id == user_id).update(
            {User.last_login: datetime.utcnow()}
        )
        db.commit()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return verify_password(plain_password, hashed_password)

user_crud = CRUDUser(User)