from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class CommentCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        document_id: Optional[int] = None,
        user_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        try:
            query = select(Comment)
            
            if document_id is not None:
                query = query.filter(Comment.document_id == document_id)
            if user_id is not None:
                query = query.filter(Comment.user_id == user_id)
                
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            comments = result.scalars().all()
            logger.info(f"Found {len(comments)} comments")

            result_list = [
                {
                    "comment_id": comment.comment_id,
                    "content": comment.content,
                    "user_id": comment.user_id,
                    "document_id": comment.document_id,
                    "status": getattr(comment, "status", None),
                    "created_at": comment.created_at,
                    "updated_at": comment.updated_at
                }
                for comment in comments
            ]
            return result_list
        except Exception as e:
            logger.error(f"Error in get all comments: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(Comment).where(Comment.comment_id == id)
            result = await self.db.execute(query)
            comment = result.scalar_one_or_none()

            if comment:
                return {
                    "comment_id": comment.comment_id,
                    "content": comment.content,
                    "user_id": comment.user_id,
                    "document_id": comment.document_id,
                    "status": getattr(comment, "status", None),
                    "created_at": comment.created_at,
                    "updated_at": comment.updated_at
                }
            return None
        except Exception as e:
            logger.error(f"Error in get comment: {str(e)}")
            raise

    async def create(self, obj_in: CommentCreate, user_id: int) -> Dict[str, Any]:
        try:
            comment = Comment(
                **obj_in.dict(),
                user_id=user_id
            )
            self.db.add(comment)
            await self.db.commit()
            await self.db.refresh(comment)

            return {
                "comment_id": comment.comment_id,
                "content": comment.content,
                "user_id": comment.user_id,
                "document_id": comment.document_id,
                "status": getattr(comment, "status", None),
                "created_at": comment.created_at,
                "updated_at": comment.updated_at
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create comment: {str(e)}")
            raise

    async def update(self, id: int, obj_in: CommentUpdate, user_id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(Comment).where(Comment.comment_id == id)
            result = await self.db.execute(query)
            comment = result.scalar_one_or_none()

            if not comment:
                return None

            if comment.user_id != user_id:
                raise ValueError("User not authorized to update this comment")

            update_data = obj_in.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(comment, field, value)

            await self.db.commit()
            await self.db.refresh(comment)

            return {
                "comment_id": comment.comment_id,
                "content": comment.content,
                "user_id": comment.user_id,
                "document_id": comment.document_id,
                "status": getattr(comment, "status", None),
                "created_at": comment.created_at,
                "updated_at": comment.updated_at
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in update comment: {str(e)}")
            raise

    async def delete(self, id: int, user_id: int) -> bool:
        try:
            query = select(Comment).where(Comment.comment_id == id)
            result = await self.db.execute(query)
            comment = result.scalar_one_or_none()

            if not comment:
                return False

            if comment.user_id != user_id:
                raise ValueError("User not authorized to delete this comment")

            await self.db.delete(comment)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete comment: {str(e)}")
            raise 