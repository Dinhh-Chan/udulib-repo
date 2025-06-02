from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.comment import Comment
from app.models.document import Document
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
        user_id: Optional[int] = None,
        parent_comment_id: Optional[int] = None,
        include_replies: bool = False
    ) -> List[Dict[str, Any]]:
        try:
            query = select(Comment).options(
                selectinload(Comment.user),
                selectinload(Comment.document).selectinload(Document.subject),
                selectinload(Comment.document).selectinload(Document.user),
                selectinload(Comment.document).selectinload(Document.tags)
            )
            
            if document_id is not None:
                query = query.filter(Comment.document_id == document_id)
            if user_id is not None:
                query = query.filter(Comment.user_id == user_id)
            if parent_comment_id is not None:
                query = query.filter(Comment.parent_comment_id == parent_comment_id)
            elif not include_replies:
                # Chỉ lấy top-level comments (không phải replies) nếu không chỉ định parent_comment_id
                query = query.filter(Comment.parent_comment_id.is_(None))
                
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
                    "parent_comment_id": comment.parent_comment_id,
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

    async def get_by_id(self, id: int, include_replies: bool = False) -> Optional[Dict[str, Any]]:
        try:
            query = select(Comment).options(
                selectinload(Comment.user),
                selectinload(Comment.document).selectinload(Document.subject),
                selectinload(Comment.document).selectinload(Document.user),
                selectinload(Comment.document).selectinload(Document.tags)
            )
            
            if include_replies:
                query = query.options(
                    selectinload(Comment.replies).selectinload(Comment.user)
                )
                
            query = query.where(Comment.comment_id == id)
            result = await self.db.execute(query)
            comment = result.scalar_one_or_none()

            if comment:
                comment_dict = {
                    "comment_id": comment.comment_id,
                    "content": comment.content,
                    "user_id": comment.user_id,
                    "document_id": comment.document_id,
                    "parent_comment_id": comment.parent_comment_id,
                    "status": getattr(comment, "status", None),
                    "created_at": comment.created_at,
                    "updated_at": comment.updated_at
                }
                
                if include_replies and hasattr(comment, 'replies'):
                    comment_dict["replies"] = [
                        {
                            "comment_id": reply.comment_id,
                            "content": reply.content,
                            "user_id": reply.user_id,
                            "document_id": reply.document_id,
                            "parent_comment_id": reply.parent_comment_id,
                            "status": getattr(reply, "status", None),
                            "created_at": reply.created_at,
                            "updated_at": reply.updated_at,
                            "user": {
                                "user_id": reply.user.user_id,
                                "username": reply.user.username
                            } if reply.user else None
                        }
                        for reply in comment.replies
                    ]
                
                return comment_dict
            return None
        except Exception as e:
            logger.error(f"Error in get comment: {str(e)}")
            raise

    async def get_replies(self, parent_comment_id: int, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Lấy tất cả replies của một comment"""
        try:
            logger.info(f"Searching for replies with parent_comment_id: {parent_comment_id}")
            
            query = select(Comment).options(
                selectinload(Comment.user)
            ).filter(Comment.parent_comment_id == parent_comment_id)
            
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            replies = result.scalars().all()
            
            logger.info(f"Found {len(replies)} replies in database for parent_comment_id: {parent_comment_id}")
            
            # Debug: Log tất cả comments với parent_comment_id để kiểm tra
            debug_query = select(Comment).filter(Comment.parent_comment_id == parent_comment_id)
            debug_result = await self.db.execute(debug_query)
            all_replies = debug_result.scalars().all()
            logger.info(f"Debug - Total replies without pagination: {len(all_replies)}")
            
            result_list = [
                {
                    "comment_id": reply.comment_id,
                    "content": reply.content,
                    "user_id": reply.user_id,
                    "document_id": reply.document_id,
                    "parent_comment_id": reply.parent_comment_id,
                    "status": getattr(reply, "status", None),
                    "created_at": reply.created_at,
                    "updated_at": reply.updated_at,
                    "user": {
                        "user_id": reply.user.user_id,
                        "username": reply.user.username
                    } if reply.user else None
                }
                for reply in replies
            ]
            
            logger.info(f"Returning {len(result_list)} formatted replies")
            return result_list
        except Exception as e:
            logger.error(f"Error in get replies: {str(e)}")
            raise

    async def create(self, obj_in: CommentCreate, user_id: int) -> Dict[str, Any]:
        try:
            # Kiểm tra parent comment có tồn tại không (nếu có)
            if obj_in.parent_comment_id:
                parent_query = select(Comment).where(Comment.comment_id == obj_in.parent_comment_id)
                parent_result = await self.db.execute(parent_query)
                parent_comment = parent_result.scalar_one_or_none()
                if not parent_comment:
                    raise ValueError("Parent comment not found")
                    
                # Kiểm tra parent comment có cùng document không
                if parent_comment.document_id != obj_in.document_id:
                    raise ValueError("Parent comment must be in the same document")
            
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
                "parent_comment_id": comment.parent_comment_id,
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
            
            # Kiểm tra parent comment nếu được cập nhật
            if 'parent_comment_id' in update_data and update_data['parent_comment_id']:
                parent_query = select(Comment).where(Comment.comment_id == update_data['parent_comment_id'])
                parent_result = await self.db.execute(parent_query)
                parent_comment = parent_result.scalar_one_or_none()
                if not parent_comment:
                    raise ValueError("Parent comment not found")
                if parent_comment.document_id != comment.document_id:
                    raise ValueError("Parent comment must be in the same document")
            
            for field, value in update_data.items():
                setattr(comment, field, value)

            await self.db.commit()
            await self.db.refresh(comment)

            return {
                "comment_id": comment.comment_id,
                "content": comment.content,
                "user_id": comment.user_id,
                "document_id": comment.document_id,
                "parent_comment_id": comment.parent_comment_id,
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