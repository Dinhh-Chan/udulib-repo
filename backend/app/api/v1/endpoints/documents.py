from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
import io
import urllib.parse

from app.models.base import get_db
from app.dependencies.auth import get_current_user, require_role
from app.core.config import settings
from app.services.minio_service import minio_service
from app.services.document_preview_service import document_preview_service

from app.models.user import User
from app.services.crud.document import document
from app.schemas.document import (
    Document,
    DocumentCreate,
    DocumentUpdate,
    DocumentListResponse,
    DocumentFilterRequest,
    DocumentStats
)

router = APIRouter()

@router.get("/count-document")
async def count_document(
    *,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)
) -> Any:
    return await document.count_document(db)

def get_file_type(filename: str) -> str:
    ext = minio_service.get_file_extension(filename)
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

def get_actual_filename(doc) -> str:
    """Lấy filename thực tế từ file_path thay vì title"""
    if doc.file_path and '/' in doc.file_path:
        return doc.file_path.split('/')[-1]
    return doc.title

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
    # current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu public theo năm học.
    """
    skip = (page - 1) * per_page
    filter_request = DocumentFilterRequest(
        academic_year_id=academic_year_id,
        skip=skip,
        limit=per_page,
        status="approved",  # Chỉ lấy tài liệu đã được duyệt
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
    
    # Kiểm tra user đã like chưa
    doc.is_liked = await document.check_user_liked(db, document_id=id, user_id=current_user.user_id)
    
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
    file_content = await file.read()
    file_size = len(file_content)
    file_type = get_file_type(file.filename)
    
    file_path = minio_service.upload_file(
        file_content, 
        file.filename, 
        settings.MINIO_DOCUMENT_BUCKET
    )
    
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
        
@router.get("/public/{id}", response_model=Document)
async def get_public_document(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Lấy thông tin chi tiết của một tài liệu công khai theo ID.
    API này không yêu cầu đăng nhập.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Kiểm tra xem tài liệu có phải là công khai không
    if doc.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài liệu này không phải là tài liệu công khai"
        )
    
    return doc
    
    # Kiểm tra quyền
    if doc.user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền xóa tài liệu này"
        )
    
    minio_service.delete_file(doc.file_path)
    
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

@router.get("/{id}/download")
async def download_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Tải tài liệu trực tiếp từ MinIO.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy download response từ MinIO
    download_data = minio_service.get_download_response(doc.file_path, doc.title)
    if not download_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể tải file từ MinIO"
        )
    
    # Ghi nhận lượt tải
    await document.record_download(db, document_id=id, user_id=current_user.user_id)
    
    # Trả về file stream
    return StreamingResponse(
        download_data["stream"],
        media_type=download_data["media_type"],
        headers=download_data["headers"]
    )

@router.get("/{id}/download-url")
async def get_document_download_url(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy URL tải tài liệu từ MinIO (Deprecated - sử dụng /download để tải trực tiếp).
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    download_url = minio_service.get_presigned_url(doc.file_path)
    if not download_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File không được lưu trữ trên MinIO"
        )
    
    await document.record_download(db, document_id=id, user_id=current_user.user_id)
    return {"download_url": download_url}

@router.get("/{id}/preview")
async def get_document_preview(
    *,
    db: Session = Depends(get_db),
    id: int,
    size: Optional[str] = Query("medium", description="Kích thước preview: small, medium, large, original, full"),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Xem trước tài liệu.
    Hỗ trợ: hình ảnh (jpg, jpeg, png, gif, bmp, webp), PDF, Office documents (doc, docx, xls, xlsx, ppt, pptx), text files (txt, md, csv).
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    # Ghi nhận lượt xem
    await document.record_view(db, document_id=id, user_id=current_user.user_id)
    
    # Trả về preview
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, size)

@router.get("/{id}/thumbnail")
async def get_document_thumbnail(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy thumbnail của tài liệu.
    Hỗ trợ: hình ảnh, PDF, Office documents, text files.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, "small")

@router.get("/{id}/full-preview")
async def get_document_full_preview(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Xem trước đầy đủ tài liệu (tất cả các trang).
    Hỗ trợ: PDF (nhiều trang), Office documents (nhiều trang), text files (full content), hình ảnh.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    # Ghi nhận lượt xem
    await document.record_view(db, document_id=id, user_id=current_user.user_id)
    
    # Trả về full preview
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, "full")

@router.get("/{id}/is-supported")
async def check_document_preview_support(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Kiểm tra xem tài liệu có hỗ trợ preview không.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    is_supported = document_preview_service.is_supported_file(actual_filename)
    file_category = document_preview_service.get_file_type_category(actual_filename)
    
    return {
        "document_id": id,
        "is_supported": is_supported,
        "file_category": file_category,
        "file_type": doc.file_type,
        "filename": actual_filename
    }

@router.get("/public/{id}/preview")
async def get_public_document_preview(
    *,
    db: Session = Depends(get_db),
    id: int,
    size: Optional[str] = Query("medium", description="Kích thước preview: small, medium, large, original, full")
) -> Any:
    """
    Xem trước tài liệu công khai (không cần đăng nhập).
    Hỗ trợ: hình ảnh, PDF, Office documents, text files.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    # Trả về preview
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, size)

@router.get("/public/{id}/thumbnail")
async def get_public_document_thumbnail(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Lấy thumbnail của tài liệu công khai (không cần đăng nhập).
    Hỗ trợ: hình ảnh, PDF, Office documents, text files.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, "small")

@router.get("/public/{id}/full-preview")
async def get_public_document_full_preview(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Xem trước đầy đủ tài liệu công khai (tất cả các trang).
    Hỗ trợ: PDF (nhiều trang), Office documents (nhiều trang), text files (full content), hình ảnh.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    # Kiểm tra xem có hỗ trợ preview không
    if not document_preview_service.is_supported_file(actual_filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng file không được hỗ trợ preview"
        )
    
    # Trả về full preview
    return document_preview_service.get_document_preview_stream(doc.file_path, actual_filename, "full")

@router.get("/public/{id}/download")
async def download_public_document(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Tải tài liệu công khai trực tiếp từ MinIO (không cần đăng nhập).
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy download response từ MinIO
    download_data = minio_service.get_download_response(doc.file_path, doc.title)
    if not download_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể tải file từ MinIO"
        )
    
    # Trả về file stream (không cần record download cho public)
    return StreamingResponse(
        download_data["stream"],
        media_type=download_data["media_type"],
        headers=download_data["headers"]
    )

@router.get("/public/{id}/is-supported")
async def check_public_document_preview_support(
    *,
    db: Session = Depends(get_db),
    id: int
) -> Any:
    """
    Kiểm tra xem tài liệu công khai có hỗ trợ preview không (không cần đăng nhập).
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    # Lấy filename thực tế từ file_path
    actual_filename = get_actual_filename(doc)
    
    is_supported = document_preview_service.is_supported_file(actual_filename)
    file_category = document_preview_service.get_file_type_category(actual_filename)
    
    return {
        "document_id": id,
        "is_supported": is_supported,
        "file_category": file_category,  # 'image', 'pdf', 'office', 'text', 'unsupported'
        "file_type": doc.file_type,
        "filename": actual_filename
    }

@router.get("/by-tag/{tag_name}", response_model=DocumentListResponse)
async def get_documents_by_tag(
    *,
    db: Session = Depends(get_db),
    tag_name: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query("approved", description="Status của document: approved, pending, rejected"),
    sort_by: str = Query("created_at", description="Sắp xếp theo: created_at, title, view_count, download_count"),
    sort_desc: bool = Query(True, description="Sắp xếp giảm dần"),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu theo tag.
    """
    filter_request = DocumentFilterRequest(
        tags=[tag_name],
        status=status,
        page=page,
        per_page=per_page,
        order_by=sort_by,
        order_desc=sort_desc
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/public/by-tag/{tag_name}", response_model=DocumentListResponse)
async def get_public_documents_by_tag(
    *,
    db: Session = Depends(get_db),
    tag_name: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", description="Sắp xếp theo: created_at, title, view_count, download_count"),
    sort_desc: bool = Query(True, description="Sắp xếp giảm dần")
) -> Any:
    """
    Lấy danh sách tài liệu công khai theo tag (không cần đăng nhập).
    """
    filter_request = DocumentFilterRequest(
        tags=[tag_name],
        status="approved",  # Chỉ lấy tài liệu đã được phê duyệt
        page=page,
        per_page=per_page,
        order_by=sort_by,
        order_desc=sort_desc
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/by-tags", response_model=DocumentListResponse)
async def get_documents_by_multiple_tags(
    *,
    db: Session = Depends(get_db),
    tags: List[str] = Query(..., description="Danh sách tags (VD: ?tags=python&tags=web&tags=tutorial)"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query("approved", description="Status của document: approved, pending, rejected"),
    sort_by: str = Query("created_at", description="Sắp xếp theo: created_at, title, view_count, download_count"),
    sort_desc: bool = Query(True, description="Sắp xếp giảm dần"),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy danh sách tài liệu theo nhiều tag (documents phải có ít nhất 1 trong các tag được chỉ định).
    """
    filter_request = DocumentFilterRequest(
        tags=tags,
        status=status,
        page=page,
        per_page=per_page,
        order_by=sort_by,
        order_desc=sort_desc
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.get("/public/by-tags", response_model=DocumentListResponse)
async def get_public_documents_by_multiple_tags(
    *,
    db: Session = Depends(get_db),
    tags: List[str] = Query(..., description="Danh sách tags (VD: ?tags=python&tags=web&tags=tutorial)"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", description="Sắp xếp theo: created_at, title, view_count, download_count"),
    sort_desc: bool = Query(True, description="Sắp xếp giảm dần")
) -> Any:
    """
    Lấy danh sách tài liệu công khai theo nhiều tag (không cần đăng nhập).
    """
    filter_request = DocumentFilterRequest(
        tags=tags,
        status="approved",  # Chỉ lấy tài liệu đã được phê duyệt
        page=page,
        per_page=per_page,
        order_by=sort_by,
        order_desc=sort_desc
    )
    return await document.get_filtered_documents(db, filter_request=filter_request)

@router.post("/{id}/like")
async def like_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Like một tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    result = await document.like_document(db, document_id=id, user_id=current_user.user_id)
    return result

@router.delete("/{id}/like")
async def unlike_document(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Bỏ like một tài liệu.
    """
    doc = await document.get(db, id=id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tài liệu không tồn tại"
        )
    
    result = await document.unlike_document(db, document_id=id, user_id=current_user.user_id)
    return result

@router.get("/{id}/stats", response_model=DocumentStats)
async def get_document_stats(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Lấy thống kê của tài liệu (views, downloads, likes, comments).
    """
    stats = await document.get_document_stats(db, document_id=id, user_id=current_user.user_id)
    return stats


