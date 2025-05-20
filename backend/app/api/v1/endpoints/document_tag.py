from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.models.base import get_db
from app.services.crud.document import document
from app.services.crud.tag_crud import tag_crud
from app.services.crud.document_tag_crud import document_tag_crud
from app.schemas.document_tag import DocumentTagList
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/{document_id}/tags", response_model=DocumentTagList)
async def add_document_tags(
    document_id: int,
    tags: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thêm tags cho một tài liệu.
    """
    # Kiểm tra tài liệu tồn tại
    doc = await document.get(db, id=document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Kiểm tra quyền sở hữu
    if doc.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Thêm tags
    for tag_name in tags:
        # Lấy hoặc tạo tag
        tag = await tag_crud.get_by_name(db, tag_name=tag_name)
        if not tag:
            tag = await tag_crud.create(db, obj_in={"tag_name": tag_name})
        
        # Tạo document_tag
        await document_tag_crud.create(
            db,
            obj_in={
                "document_id": document_id,
                "tag_id": tag.tag_id
            }
        )
    
    # Lấy danh sách tags sau khi thêm
    tag_names = await document_tag_crud.get_document_tag_names(
        db, document_id=document_id
    )
    
    return {"tags": tag_names}

@router.delete("/{document_id}/tags/{tag_name}")
async def remove_document_tag(
    document_id: int,
    tag_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một tag khỏi tài liệu.
    """
    # Kiểm tra tài liệu tồn tại
    doc = await document.get(db, id=document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Kiểm tra quyền sở hữu
    if doc.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Lấy tag
    tag = await tag_crud.get_by_name(db, tag_name=tag_name)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    # Xóa document_tag
    success = await document_tag_crud.delete_by_document_and_tag(
        db, document_id=document_id, tag_id=tag.tag_id
    )
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Document tag not found"
        )
    
    return {"message": f"Tag {tag_name} removed successfully"} 