from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
import mimetypes
import json
from minio import Minio
from minio.error import S3Error
import uuid
import logging
import io

from app.models.base import get_db
from app.dependencies.auth import get_current_user, require_role

from app.models.user import User
from app.services.crud.document import document
from app.schemas.document import (
    Document,
    DocumentCreate,
    DocumentUpdate,
    DocumentListResponse,
    DocumentFilterRequest
)

router = APIRouter()

# Cấu hình MinIO client
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "documents")

# Khởi tạo MinIO client
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # Đặt thành True nếu sử dụng HTTPS
)

# Tạo bucket nếu chưa tồn tại
try:
    if not minio_client.bucket_exists(MINIO_BUCKET_NAME):
        minio_client.make_bucket(MINIO_BUCKET_NAME)
        logging.info(f"Bucket '{MINIO_BUCKET_NAME}' được tạo thành công")
except S3Error as e:
    logging.error(f"Lỗi khi tạo bucket: {e}")

@router.get("/count-document")
async def count_document(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    return await document.count_document(db)

def get_file_extension(filename: str) -> str:
    """Lấy phần mở rộng của file"""
    return os.path.splitext(filename)[1].lower()

def get_file_type(filename: str) -> str:
    """Lấy loại file dựa trên phần mở rộng"""
    ext = get_file_extension(filename)
    if ext == '.pdf':
        return 'PDF'
    elif ext == '.doc' or ext == '.docx':
        return 'DOC'
    elif ext == '.xls' or ext == '.xlsx':
        return 'XLS'
    elif ext == '.ppt' or ext == '.pptx':
        return 'PPT'
    elif ext == '.txt':
        return 'TXT'
    elif ext in ['.jpg', '.jpeg', '.png', '.gif']:
        return 'IMAGE'
    else:
        return 'OTHER'

def generate_unique_filename(original_filename: str) -> str:
    """Tạo tên file duy nhất"""
    ext = get_file_extension(original_filename)
    unique_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{timestamp}_{unique_id}{ext}"

def upload_file_to_minio(file_content: bytes, filename: str) -> str:
    """Upload file lên MinIO và trả về đường dẫn"""
    try:
        unique_filename = generate_unique_filename(filename)
        
        # Upload file lên MinIO
        minio_client.put_object(
            MINIO_BUCKET_NAME,
            unique_filename,
            data=io.BytesIO(file_content),
            length=len(file_content),
            content_type=mimetypes.guess_type(filename)[0] or 'application/octet-stream'
        )
        
        # Trả về đường dẫn MinIO
        return f"minio://{MINIO_BUCKET_NAME}/{unique_filename}"
        
    except S3Error as e:
        logging.error(f"Lỗi khi upload file lên MinIO: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi upload file: {str(e)}"
        )

def delete_file_from_minio(file_path: str) -> bool:
    """Xóa file từ MinIO"""
    try:
        # Trích xuất object name từ đường dẫn
        if file_path.startswith("minio://"):
            object_name = file_path.replace(f"minio://{MINIO_BUCKET_NAME}/", "")
            minio_client.remove_object(MINIO_BUCKET_NAME, object_name)
            return True
        return False
    except S3Error as e:
        logging.error(f"Lỗi khi xóa file từ MinIO: {e}")
        return False

@router.get("/", response_model=DocumentListResponse)
async def get_documents(
    *,
    db: Session = Depends(get_db),
    filter_request: DocumentFilterRequest = Depends(),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu với bộ lọc.
    """
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/public", response_model=DocumentListResponse)
async def get_public_documents(
    *,
    db: Session = Depends(get_db),
    page: int = 1,
    per_page: int = 20,
    subject_id: Optional[int] = None,
    user_id: Optional[int] = None,
    search: Optional[str] = None,
    file_type: Optional[str] = None,
    sort_by: str = "created_at",
    sort_desc: bool = True
) -> Any:
    """
    Lấy danh sách tài liệu công khai (đã được phê duyệt).
    API này dành cho người dùng thông thường.
    """
    filter_request = DocumentFilterRequest(
        page=page,
        per_page=per_page,
        subject_id=subject_id,
        user_id=user_id,
        search=search,
        file_type=file_type,
        status="approved",  # Chỉ lấy tài liệu đã được phê duyệt
        order_by=sort_by,
        order_desc=sort_desc
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/academic-year/{academic_year_id}", response_model=DocumentListResponse)
async def get_documents_by_academic_year(
    *,
    db: Session = Depends(get_db),
    academic_year_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu theo năm học.
    """
    skip = (page - 1) * per_page
    filter_request = DocumentFilterRequest(
        academic_year_id=academic_year_id,
        skip=skip,
        limit=per_page
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/{id}", response_model=Document)
async def get_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy thông tin chi tiết của một tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    return doc

@router.post("/", response_model=Document, status_code=status.HTTP_201_CREATED)
async def create_document(
    *,
    db: Session = Depends(get_db),
    title: str = File(...),
    description: Optional[str] = File(None),
    file: UploadFile = File(...),
    subject_id: int = File(...),
    tags: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Tạo tài liệu mới.
    """
    # Đọc nội dung file
    file_content = await file.read()
    file_size = len(file_content)
    file_type = get_file_type(file.filename)
    
    # Upload file lên MinIO
    file_path = upload_file_to_minio(file_content, file.filename)
    
    # Xử lý tags từ JSON string
    tags_list = []
    if tags:
        try:
            tags_list = json.loads(tags)
            if not isinstance(tags_list, list):
                tags_list = [tags_list]
        except json.JSONDecodeError:
            tags_list = [tags]
    
    # Tạo document
    doc_in = DocumentCreate(
        title=title,
        description=description,
        file_path=file_path,
        file_size=file_size,
        file_type=file_type,
        subject_id=subject_id,
        tags=tags_list
    )
    
    return await document.create_with_tags(db, obj_in=doc_in, user_id=current_user.user_id)

@router.put("/{id}", response_model=Document)
async def update_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    doc_in: DocumentUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Cập nhật thông tin tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Kiểm tra quyền
    if doc.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật tài liệu này"
        )
    
    return await document.update_with_tags(db, db_obj=doc, obj_in=doc_in)

@router.delete("/{id}")
async def delete_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Xóa tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Kiểm tra quyền
    if doc.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền xóa tài liệu này"
        )
    
    # Xóa file từ MinIO
    delete_file_from_minio(doc.file_path)
    
    await document.delete(db, id=id)
    return {"message": "Xóa tài liệu thành công"}

@router.post("/{id}/view")
async def record_document_view(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Ghi nhận lượt xem tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    await document.record_view(db, document_id=id, user_id=current_user.user_id)
    return {"message": "Ghi nhận lượt xem thành công"}

@router.post("/{id}/download")
async def record_document_download(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Ghi nhận lượt tải tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    await document.record_download(db, document_id=id, user_id=current_user.user_id)
    return {"message": "Ghi nhận lượt tải thành công"}

@router.get("/{id}/download-url")
async def get_document_download_url(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy URL tải tài liệu từ MinIO.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    try:
        # Trích xuất object name từ đường dẫn
        if doc.file_path.startswith("minio://"):
            object_name = doc.file_path.replace(f"minio://{MINIO_BUCKET_NAME}/", "")
            
            # Tạo URL tạm thời để tải file (có hiệu lực trong 1 giờ)
            download_url = minio_client.presigned_get_object(
                MINIO_BUCKET_NAME,
                object_name,
                expires=timedelta(hours=1)
            )
            
            # Ghi nhận lượt tải
            await document.record_download(db, document_id=id, user_id=current_user.user_id)
            
            return {"download_url": download_url}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File không được lưu trữ trên MinIO"
            )
    except S3Error as e:
        logging.error(f"Lỗi khi tạo URL tải: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi tạo URL tải file"
        )