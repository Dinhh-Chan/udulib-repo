from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import datetime
import os
import mimetypes
import json

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

# Tạo thư mục uploads nếu chưa tồn tại
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

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

@router.get("/", response_model=DocumentListResponse)
async def get_documents(
    *,
    db: Session = Depends(get_db),
    filter_request: DocumentFilterRequest = Depends(),
    # current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu với bộ lọc.
    """
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/public", response_model=DocumentListResponse)
async def get_public_documents(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    subject_id: Optional[int] = None,
    major_id: Optional[int] = None,
    year_id: Optional[int] = None,
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
        skip=skip,
        limit=limit,
        subject_id=subject_id,
        major_id=major_id,
        year_id=year_id,
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
    skip: int = 0,
    limit: int = 100,
    # current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu theo năm học.
    """
    filter_request = DocumentFilterRequest(
        academic_year_id=academic_year_id,
        skip=skip,
        limit=limit
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/{id}", response_model=Document)
async def get_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    # current_user: User = Depends(get_current_user)
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
    # current_user: User = Depends(get_current_user)
) -> Any:
    """
    Tạo tài liệu mới.
    """
    # Xử lý file upload
    file_content = await file.read()
    file_size = len(file_content)
    file_type = get_file_type(file.filename)
    
    # Tạo đường dẫn file
    file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}")
    
    # Lưu file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
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
    
    return await document.create_with_tags(db, obj_in=doc_in, user_id=1)

@router.put("/{id}", response_model=Document)
async def update_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    doc_in: DocumentUpdate,
    # current_user: User = Depends(get_current_user)
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
    
    # # Kiểm tra quyền
    # if doc.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Không có quyền cập nhật tài liệu này"
    #     )
    
    return await document.update_with_tags(db, db_obj=doc, obj_in=doc_in)

@router.delete("/{id}")
async def delete_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    # current_user: User = Depends(get_current_user)
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
    # if doc.user_id != current_user.user_id and current_user.role != "admin":
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Không có quyền xóa tài liệu này"
    #     )
    
    # Xóa file vật lý
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    
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