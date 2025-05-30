from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.services.crud.comment_crud import CommentCRUD
from app.schemas.comment import Comment, CommentCreate, CommentUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.common import ForumStatus

router = APIRouter()

@router.get("/", response_model=List[Comment])
async def read_comments(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    document_id: Optional[int] = None,
    user_id: Optional[int] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve comments.
    """
    crud = CommentCRUD(db)
    skip = (page - 1) * per_page
    comments = await crud.get_all(
        skip=skip, 
        limit=per_page,
        document_id=document_id,
        user_id=user_id
    )
    return comments

@router.post("/", response_model=Comment)
async def create_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create new comment.
    """
    crud = CommentCRUD(db)
    comment = await crud.create(obj_in=comment_in, user_id=current_user.user_id)
    return comment

@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    comment_in: CommentUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update a comment.
    """
    crud = CommentCRUD(db)
    try:
        comment = await crud.update(id=comment_id, obj_in=comment_in, user_id=current_user.user_id)
        if not comment:
            raise HTTPException(
                status_code=404,
                detail="Comment not found"
            )
        return comment
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

@router.get("/{comment_id}", response_model=Comment)
async def read_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Get comment by ID.
    """
    crud = CommentCRUD(db)
    comment = await crud.get_by_id(id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )
    return comment

@router.delete("/{comment_id}")
async def delete_comment(
    *,
    db: AsyncSession = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a comment.
    """
    crud = CommentCRUD(db)
    try:
        success = await crud.delete(id=comment_id, user_id=current_user.user_id)
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Comment not found"
            )
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        ) 