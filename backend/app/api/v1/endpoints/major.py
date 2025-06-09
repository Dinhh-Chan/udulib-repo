from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import io
import logging

from app.models.base import get_db
from app.services.crud.major_crud import MajorCRUD
from app.schemas.major import Major, MajorCreate, MajorUpdate
from app.dependencies.auth import get_current_user, require_role
from app.models.user import User
from app.services.major_image_service import major_image_service
from app.services.minio_service import minio_service

router = APIRouter()

def _get_major_image_stream_response(major: dict) -> StreamingResponse:
    """Helper function để lấy major image stream response"""
    if not major.get('image_url'):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ngành học chưa có ảnh"
        )
    
    try:
        # Logging để debug
        logging.info(f"Attempting to get image for major {major.get('major_id')}: {major['image_url']}")
        
        # Kiểm tra file có tồn tại không trước khi stream
        file_info = minio_service.get_file_info(major['image_url'])
        if not file_info:
            logging.warning(f"Major image file not found in MinIO: {major['image_url']}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ảnh ngành học không tồn tại trong hệ thống lưu trữ"
            )
        
        # Lấy file stream từ MinIO
        file_stream = minio_service.get_file_stream(major['image_url'])
        if not file_stream:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không thể lấy ảnh ngành học từ hệ thống lưu trữ"
            )
        
        # Lấy content type từ file info đã có
        content_type = file_info.get('content_type', 'image/jpeg')
        
        # Đọc dữ liệu ảnh
        image_data = file_stream.read()
        file_stream.close()
        
        logging.info(f"Successfully retrieved image for major {major.get('major_id')}, size: {len(image_data)} bytes")
        
        return StreamingResponse(
            io.BytesIO(image_data),
            media_type=content_type,
            headers={
                "Cache-Control": "public, max-age=3600",
                "Content-Disposition": "inline"
            }
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logging.error(f"Error getting image for major {major.get('major_id')}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi server khi lấy ảnh ngành học"
        )

@router.get("/count-major")
async def count_major(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Đếm số lượng ngành học.
    """
    crud = MajorCRUD(db)
    count = await crud.count_major()
    return {"count": count}

@router.get("/", response_model=List[Major])
async def get_majors(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách các ngành học.
    """
    crud = MajorCRUD(db)
    skip = (page - 1) * per_page
    majors = await crud.get_all(skip=skip, limit=per_page)
    return majors

@router.post("/", response_model=Major)
async def create_major(
    major_in: MajorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo mới một ngành học.
    Chỉ admin mới có quyền tạo.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    try:
        major = await crud.create(major_in)
        return major
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/upload-image")
async def upload_major_image(
    major_id: int = Query(..., description="ID của ngành học"),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    return await major_image_service.upload_image(db, major_id, file)

@router.get("/image")
async def get_major_image(
    major_id: int = Query(..., description="ID của ngành học"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy ảnh ngành học trực tiếp"""
    crud = MajorCRUD(db)
    major = await crud.get_by_id(major_id)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    
    return _get_major_image_stream_response(major)

@router.get("/image-url")
async def get_major_image_url(
    major_id: int = Query(..., description="ID của ngành học"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy URL ảnh ngành học (backward compatibility)"""
    crud = MajorCRUD(db)
    major = await crud.get_by_id(major_id)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    image_url = major_image_service.get_image_url(major)
    return {"image_url": image_url}

@router.delete("/image")
async def delete_major_image(
    major_id: int = Query(..., description="ID của ngành học"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    await major_image_service.delete_image(db, major_id)
    return {"message": "Xóa ảnh ngành học thành công"}

@router.get("/code/{major_code}", response_model=Major)
async def get_major_by_code(
    major_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crud = MajorCRUD(db)
    major = await crud.get_by_code(major_code)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    return major

@router.get("/{major_id}", response_model=Major)
async def get_major(
    major_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crud = MajorCRUD(db)
    major = await crud.get_by_id(major_id)
    if not major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    return major

@router.put("/{major_id}", response_model=Major)
async def update_major(
    major_id: int,
    major_in: MajorUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin của một ngành học.
    Chỉ admin mới có quyền cập nhật.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    # Kiểm tra ngành học có tồn tại không trước khi cập nhật
    existing_major = await crud.get_by_id(major_id)
    if not existing_major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    
    try:
        major = await crud.update(major_id, major_in)
        return major
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{major_id}")
async def delete_major(
    major_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một ngành học.
    Chỉ admin mới có quyền xóa.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền thực hiện thao tác này"
        )
    
    crud = MajorCRUD(db)
    # Kiểm tra ngành học có tồn tại không trước khi xóa
    existing_major = await crud.get_by_id(major_id)
    if not existing_major:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy ngành học"
        )
    
    success = await crud.delete(major_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi khi xóa ngành học"
        )
    return {"status": "success", "message": "Ngành học đã được xóa thành công"} 