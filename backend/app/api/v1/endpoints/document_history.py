from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.base import get_db
from app.services.crud.document_history_crud import DocumentHistoryCRUD
from app.schemas.document_history import DocumentHistory, DocumentHistoryCreate
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.document import Document

router = APIRouter()

@router.get("/", response_model=List[DocumentHistory])
async def read_document_histories(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    document_id: Optional[int] = None,
    user_id: Optional[int] = None,
    action: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách lịch sử truy cập tài liệu.
    """
    crud = DocumentHistoryCRUD(db)
    skip = (page - 1) * per_page
    histories = await crud.get_all(
        skip=skip, 
        limit=per_page,
        document_id=document_id,
        user_id=user_id,
        action=action
    )
    return histories

@router.post("/", response_model=DocumentHistory)
async def create_document_history(
    *,
    db: AsyncSession = Depends(get_db),
    history_in: DocumentHistoryCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Tạo bản ghi lịch sử truy cập tài liệu mới.
    """
    # Kiểm tra document có tồn tại không
    document_result = await db.execute(select(Document).where(Document.document_id == history_in.document_id))
    if not document_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Document not found")
    
    crud = DocumentHistoryCRUD(db)
    history = await crud.create(obj_in=history_in, user_id=1)
    return history

@router.get("/{history_id}", response_model=DocumentHistory)
async def read_document_history(
    *,
    db: AsyncSession = Depends(get_db),
    history_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy chi tiết một bản ghi lịch sử theo ID.
    """
    crud = DocumentHistoryCRUD(db)
    history = await crud.get_by_id(id=history_id)
    if not history:
        raise HTTPException(
            status_code=404,
            detail="Document history not found"
        )
    return history

@router.delete("/{history_id}")
async def delete_document_history(
    *,
    db: AsyncSession = Depends(get_db),
    history_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một bản ghi lịch sử truy cập tài liệu.
    Thường chỉ admin mới có quyền này.
    """
    # Kiểm tra quyền admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
        
    crud = DocumentHistoryCRUD(db)
    success = await crud.delete(id=history_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Document history not found"
        )
    return {"status": "success"} 