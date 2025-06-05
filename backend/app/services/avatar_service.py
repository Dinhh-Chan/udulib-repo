from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.minio_service import minio_service
from app.services.crud.user_crud import user_crud
from app.schemas.user import UserUpdate
from app.models.user import User


class AvatarService:
    ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    def validate_image_file(self, filename: str) -> bool:
        ext = minio_service.get_file_extension(filename)
        return ext in self.ALLOWED_EXTENSIONS

    async def upload_avatar(self, db: AsyncSession, user: User, file: UploadFile) -> User:
        if not self.validate_image_file(file.filename):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File phải là hình ảnh (jpg, jpeg, png, gif, webp)"
            )

        file_content = await file.read()
        if len(file_content) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File quá lớn. Kích thước tối đa là 5MB"
            )

        if user.avatar_url:
            minio_service.delete_file(user.avatar_url)

        avatar_url = minio_service.upload_file(
            file_content, 
            file.filename, 
            settings.MINIO_AVATAR_BUCKET,
            f"user_{user.user_id}_avatar"
        )

        user_update = UserUpdate(avatar_url=avatar_url)
        return await user_crud.update(db=db, db_obj=user, obj_in=user_update)

    def get_avatar_url(self, user: User) -> str:
        if not user.avatar_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Người dùng chưa có avatar"
            )

        presigned_url = minio_service.get_presigned_url(user.avatar_url)
        if not presigned_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Avatar không được lưu trữ trên MinIO"
            )
        
        return presigned_url

    async def delete_avatar(self, db: AsyncSession, user: User) -> bool:
        if not user.avatar_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Người dùng chưa có avatar"
            )

        if minio_service.delete_file(user.avatar_url):
            user_update = UserUpdate(avatar_url=None)
            await user_crud.update(db=db, db_obj=user, obj_in=user_update)
            return True
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi khi xóa avatar"
            )


avatar_service = AvatarService() 