from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.minio_service import minio_service
from app.services.crud.major_crud import MajorCRUD
from app.schemas.major import MajorUpdate


class MajorImageService:
    ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB for major images

    def validate_image_file(self, filename: str) -> bool:
        ext = minio_service.get_file_extension(filename)
        return ext in self.ALLOWED_EXTENSIONS

    async def upload_image(self, db: AsyncSession, major_id: int, file: UploadFile) -> dict:
        if not self.validate_image_file(file.filename):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File phải là hình ảnh (jpg, jpeg, png, gif, webp)"
            )

        file_content = await file.read()
        if len(file_content) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File quá lớn. Kích thước tối đa là 10MB"
            )

        crud = MajorCRUD(db)
        major = await crud.get_by_id(major_id)
        if not major:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy ngành học"
            )

        # Xóa ảnh cũ nếu có
        if major.get('image_url'):
            minio_service.delete_file(major['image_url'])

        # Upload ảnh mới lên MinIO
        image_url = minio_service.upload_file(
            file_content, 
            file.filename, 
            settings.MINIO_MAJOR_IMAGE_BUCKET,
            f"major_{major_id}_image"
        )

        # Cập nhật image_url trong database
        major_update = MajorUpdate(image_url=image_url)
        updated_major = await crud.update(major_id, major_update)
        
        return updated_major

    def get_image_url(self, major: dict) -> str:
        if not major.get('image_url'):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ngành học chưa có ảnh"
            )

        presigned_url = minio_service.get_presigned_url(major['image_url'])
        if not presigned_url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ảnh không được lưu trữ trên MinIO"
            )
        
        return presigned_url

    async def delete_image(self, db: AsyncSession, major_id: int) -> bool:
        crud = MajorCRUD(db)
        major = await crud.get_by_id(major_id)
        
        if not major:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy ngành học"
            )

        if not major.get('image_url'):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ngành học chưa có ảnh"
            )

        if minio_service.delete_file(major['image_url']):
            major_update = MajorUpdate(image_url=None)
            await crud.update(major_id, major_update)
            return True
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Lỗi khi xóa ảnh"
            )


major_image_service = MajorImageService() 