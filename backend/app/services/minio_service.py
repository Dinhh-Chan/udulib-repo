import os
import mimetypes
import uuid
import logging
import io
from datetime import datetime, timedelta
from typing import Optional
from minio import Minio
from minio.error import S3Error
from fastapi import HTTPException, status

from app.core.config import settings


class MinIOService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        self._ensure_buckets_exist()
    
    def _ensure_buckets_exist(self):
        buckets = [
            settings.MINIO_DOCUMENT_BUCKET, 
            settings.MINIO_AVATAR_BUCKET,
            settings.MINIO_MAJOR_IMAGE_BUCKET
        ]
        for bucket in buckets:
            try:
                if not self.client.bucket_exists(bucket):
                    self.client.make_bucket(bucket)
                    logging.info(f"Bucket '{bucket}' created successfully")
            except S3Error as e:
                logging.error(f"Error creating bucket {bucket}: {e}")
    
    def get_file_extension(self, filename: str) -> str:
        return os.path.splitext(filename)[1].lower()
    
    def generate_unique_filename(self, original_filename: str, prefix: str = "") -> str:
        ext = self.get_file_extension(original_filename)
        unique_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        if prefix:
            return f"{prefix}_{timestamp}_{unique_id}{ext}"
        return f"{timestamp}_{unique_id}{ext}"
    
    def upload_file(self, file_content: bytes, filename: str, bucket: str, prefix: str = "") -> str:
        try:
            unique_filename = self.generate_unique_filename(filename, prefix)
            
            self.client.put_object(
                bucket,
                unique_filename,
                data=io.BytesIO(file_content),
                length=len(file_content),
                content_type=mimetypes.guess_type(filename)[0] or 'application/octet-stream'
            )
            
            return f"minio://{bucket}/{unique_filename}"
        except S3Error as e:
            logging.error(f"Error uploading file to MinIO: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error uploading file: {str(e)}"
            )
    
    def delete_file(self, file_path: str) -> bool:
        try:
            if file_path.startswith("minio://"):
                # Extract bucket and object name from path
                path_parts = file_path.replace("minio://", "").split("/", 1)
                if len(path_parts) == 2:
                    bucket, object_name = path_parts
                    self.client.remove_object(bucket, object_name)
                    return True
            return False
        except S3Error as e:
            logging.error(f"Error deleting file from MinIO: {e}")
            return False
    
    def get_presigned_url(self, file_path: str, expires: timedelta = timedelta(hours=1)) -> Optional[str]:
        try:
            if file_path.startswith("minio://"):
                path_parts = file_path.replace("minio://", "").split("/", 1)
                if len(path_parts) == 2:
                    bucket, object_name = path_parts
                    return self.client.presigned_get_object(bucket, object_name, expires=expires)
            return None
        except S3Error as e:
            logging.error(f"Error creating presigned URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating download URL"
            )


minio_service = MinIOService() 