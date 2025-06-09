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
                    presigned_url = self.client.presigned_get_object(bucket, object_name, expires=expires)
                    
                    # Thay thế internal endpoint bằng external endpoint cho client
                    if presigned_url and settings.MINIO_ENDPOINT != settings.MINIO_EXTERNAL_ENDPOINT:
                        presigned_url = presigned_url.replace(
                            f"http://{settings.MINIO_ENDPOINT}", 
                            f"http://{settings.MINIO_EXTERNAL_ENDPOINT}"
                        ).replace(
                            f"https://{settings.MINIO_ENDPOINT}", 
                            f"https://{settings.MINIO_EXTERNAL_ENDPOINT}"
                        )
                    
                    return presigned_url
            return None
        except S3Error as e:
            logging.error(f"Error creating presigned URL: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error creating download URL"
            )

    def get_file_stream(self, file_path: str):
        """Stream file trực tiếp từ MinIO"""
        try:
            if file_path.startswith("minio://"):
                path_parts = file_path.replace("minio://", "").split("/", 1)
                if len(path_parts) == 2:
                    bucket, object_name = path_parts
                    # Lấy file object từ MinIO
                    response = self.client.get_object(bucket, object_name)
                    return response
            return None
        except S3Error as e:
            logging.error(f"Error streaming file from MinIO: {e}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found"
            )
    
    def get_file_info(self, file_path: str) -> Optional[dict]:
        """Lấy thông tin file từ MinIO"""
        try:
            if file_path.startswith("minio://"):
                path_parts = file_path.replace("minio://", "").split("/", 1)
                if len(path_parts) == 2:
                    bucket, object_name = path_parts
                    stat = self.client.stat_object(bucket, object_name)
                    return {
                        "size": stat.size,
                        "content_type": stat.content_type,
                        "etag": stat.etag,
                        "last_modified": stat.last_modified
                    }
            return None
        except S3Error as e:
            logging.error(f"Error getting file info: {e}")
            return None

    def get_download_response(self, file_path: str, download_filename: str = None):
        """Tạo streaming response để download file trực tiếp từ MinIO"""
        try:
            if not file_path.startswith("minio://"):
                return None
                
            path_parts = file_path.replace("minio://", "").split("/", 1)
            if len(path_parts) != 2:
                return None
                
            bucket, object_name = path_parts
            
            # Lấy thông tin file
            try:
                stat = self.client.stat_object(bucket, object_name)
                file_size = stat.size
                content_type = stat.content_type or 'application/octet-stream'
            except S3Error:
                file_size = None
                content_type = 'application/octet-stream'
            
            # Lấy file stream từ MinIO
            response = self.client.get_object(bucket, object_name)
            
            # Xác định filename để download
            if download_filename:
                # Sử dụng title từ document, thêm extension từ file gốc nếu cần
                original_filename = object_name.split('/')[-1]
                original_ext = self.get_file_extension(original_filename)
                
                # Nếu download_filename chưa có extension, thêm vào
                if not self.get_file_extension(download_filename) and original_ext:
                    final_filename = f"{download_filename}{original_ext}"
                else:
                    final_filename = download_filename
            else:
                # Fallback to original filename
                final_filename = object_name.split('/')[-1]
            
            # Escape filename để tránh lỗi header
            safe_filename = final_filename.replace('"', '\\"')
            
            # Tạo headers
            headers = {
                "Content-Disposition": f'attachment; filename="{safe_filename}"',
                "Cache-Control": "no-cache"
            }
            
            if file_size:
                headers["Content-Length"] = str(file_size)
            
            return {
                "stream": response,
                "media_type": content_type,
                "headers": headers
            }
            
        except S3Error as e:
            logging.error(f"Error creating download response: {e}")
            return None


minio_service = MinIOService() 