from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.crud.user_crud import user_crud
from app.schemas.user import UserUpdate
from app.models.user import User

class PrivacyService:
    async def toggle_privacy(self, db: AsyncSession, user: User) -> User:
        new_privacy_status = not user.is_private
        user_update = UserUpdate(is_private=new_privacy_status)
        return await user_crud.update(db=db, db_obj=user, obj_in=user_update)
    
    async def set_privacy(self, db: AsyncSession, user: User, is_private: bool) -> User:
        user_update = UserUpdate(is_private=is_private)
        return await user_crud.update(db=db, db_obj=user, obj_in=user_update)
    
    def can_view_profile(self, target_user: User, viewer_user: User = None) -> bool:
        if viewer_user and viewer_user.role == "admin":
            return True
        if viewer_user and target_user.user_id == viewer_user.user_id:
            return True
        return not target_user.is_private

privacy_service = PrivacyService() 