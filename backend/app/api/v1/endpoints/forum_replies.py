from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.forum_reply_crud import ForumReplyCRUD
from app.schemas.forum import ForumReply, ForumReplyCreate, ForumReplyUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ForumReply])
async def read_forum_replies(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    post_id: Optional[int] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách forum replies.
    """
    crud = ForumReplyCRUD(db)
    skip = (page - 1) * per_page
    replies = await crud.get_all(
        skip=skip, 
        limit=per_page,
        post_id=post_id,
        user_id=user_id,
        status=status
    )
    return replies

@router.get("/{reply_id}", response_model=ForumReply)
async def read_forum_reply(
    *,
    db: AsyncSession = Depends(get_db),
    reply_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết của một forum reply.
    """
    crud = ForumReplyCRUD(db)
    reply = await crud.get_by_id(id=reply_id)
    if not reply:
        raise HTTPException(
            status_code=404,
            detail="Forum reply not found"
        )
    return reply

@router.post("/", response_model=ForumReply)
async def create_forum_reply(
    *,
    db: AsyncSession = Depends(get_db),
    reply_in: ForumReplyCreate,
    # current_user: User = Depends(get_current_user)
):
    """
    Tạo forum reply mới.
    """
    crud = ForumReplyCRUD(db)
    reply = await crud.create(obj_in=reply_in, user_id=1)
    return reply

@router.put("/{reply_id}", response_model=ForumReply)
async def update_forum_reply(
    *,
    db: AsyncSession = Depends(get_db),
    reply_id: int,
    reply_in: ForumReplyUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật forum reply.
    Chỉ người tạo reply hoặc admin mới có quyền cập nhật.
    """
    crud = ForumReplyCRUD(db)
    try:
        # Admin có thể cập nhật status của bất kỳ reply nào
        if current_user.role == "admin":
            # Admin có thể cập nhật mà không cần kiểm tra ownership
            reply = await crud.get_by_id(id=reply_id)
            if not reply:
                raise HTTPException(
                    status_code=404,
                    detail="Forum reply not found"
                )
            # Tạm thời bypass user_id check cho admin
            reply_data = reply_in.dict(exclude_unset=True)
            if reply_data:
                from datetime import datetime
                query = await crud.db.execute(
                    crud.model.__table__.update()
                    .where(crud.model.reply_id == reply_id)
                    .values(**reply_data, updated_at=datetime.now().isoformat())
                )
                await crud.db.commit()
                updated_reply = await crud.get_by_id(id=reply_id)
                return updated_reply
        else:
            # User thường chỉ có thể cập nhật reply của mình
            reply = await crud.update(id=reply_id, obj_in=reply_in, user_id=current_user.user_id)
            if not reply:
                raise HTTPException(
                    status_code=404,
                    detail="Forum reply not found"
                )
            return reply
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

@router.delete("/{reply_id}")
async def delete_forum_reply(
    *,
    db: AsyncSession = Depends(get_db),
    reply_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Xóa forum reply.
    Chỉ người tạo reply hoặc admin mới có quyền xóa.
    """
    crud = ForumReplyCRUD(db)
    try:
        # Admin có thể xóa bất kỳ reply nào
        if current_user.role == "admin":
            reply = await crud.get_by_id(id=reply_id)
            if not reply:
                raise HTTPException(
                    status_code=404,
                    detail="Forum reply not found"
                )
            # Xóa trực tiếp cho admin
            from sqlalchemy import delete
            await crud.db.execute(
                delete(crud.model).where(crud.model.reply_id == reply_id)
            )
            await crud.db.commit()
            return {"message": "Forum reply deleted successfully"}
        else:
            # User thường chỉ có thể xóa reply của mình
            success = await crud.delete(id=reply_id, user_id=current_user.user_id)
            if not success:
                raise HTTPException(
                    status_code=404,
                    detail="Forum reply not found"
                )
            return {"message": "Forum reply deleted successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        ) 