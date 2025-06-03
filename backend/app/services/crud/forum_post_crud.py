from typing import List, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.forum_post import ForumPost
from app.models.forum_reply import ForumReply
from app.schemas.forum import ForumPostCreate, ForumPostUpdate
from app.services.crud.base_crud import CRUDBase
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ForumPostCRUD(CRUDBase[ForumPost, ForumPostCreate, ForumPostUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(ForumPost)
        self.db = db

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        forum_id: Optional[int] = None,
        user_id: Optional[int] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        try:
            query = (
                select(self.model, func.count(ForumReply.reply_id).label("reply_count"))
                .outerjoin(ForumReply, ForumReply.post_id == self.model.post_id)
                .group_by(self.model.post_id)
            )
            
            if forum_id:
                query = query.where(self.model.forum_id == forum_id)
            if user_id:
                query = query.where(self.model.user_id == user_id)
            if status:
                query = query.where(self.model.status == status)
                
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            posts_with_count = result.all()

            result_list = []
            for post, reply_count in posts_with_count:
                result_list.append({
                    "post_id": post.post_id,
                    "forum_id": post.forum_id,
                    "user_id": post.user_id,
                    "title": post.title,
                    "content": post.content,
                    "status": post.status,
                    "created_at": post.created_at,
                    "updated_at": post.updated_at,
                    "reply_count": reply_count or 0
                })
            return result_list
        except Exception as e:
            logger.error(f"Error in get all forum posts: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = (
                select(self.model, func.count(ForumReply.reply_id).label("reply_count"))
                .outerjoin(ForumReply, ForumReply.post_id == self.model.post_id)
                .where(self.model.post_id == id)
                .group_by(self.model.post_id)
            )
            result = await self.db.execute(query)
            post_data = result.first()

            if post_data:
                post, reply_count = post_data
                return {
                    "post_id": post.post_id,
                    "forum_id": post.forum_id,
                    "user_id": post.user_id,
                    "title": post.title,
                    "content": post.content,
                    "status": post.status,
                    "created_at": post.created_at,
                    "updated_at": post.updated_at,
                    "reply_count": reply_count or 0
                }
            return None
        except Exception as e:
            logger.error(f"Error in get forum post: {str(e)}")
            raise

    async def create(self, obj_in: ForumPostCreate, user_id: int) -> Dict[str, Any]:
        try:
            post_data = obj_in.dict()
            post_data["user_id"] = user_id
            
            post = ForumPost(**post_data)
            self.db.add(post)
            await self.db.commit()
            await self.db.refresh(post)

            return {
                "post_id": post.post_id,
                "forum_id": post.forum_id,
                "user_id": post.user_id,
                "title": post.title,
                "content": post.content,
                "status": post.status,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "reply_count": 0
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create forum post: {str(e)}")
            raise

    async def update(self, id: int, obj_in: ForumPostUpdate, user_id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(self.model).where(self.model.post_id == id)
            result = await self.db.execute(query)
            post = result.scalar_one_or_none()

            if not post:
                return None

            # Kiểm tra quyền sở hữu
            if post.user_id != user_id:
                raise ValueError("You don't have permission to update this post")

            update_data = obj_in.dict(exclude_unset=True)
            
            for field, value in update_data.items():
                setattr(post, field, value)

            await self.db.commit()
            await self.db.refresh(post)

            return {
                "post_id": post.post_id,
                "forum_id": post.forum_id,
                "user_id": post.user_id,
                "title": post.title,
                "content": post.content,
                "status": post.status,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "reply_count": 0  # Will be calculated if needed
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in update forum post: {str(e)}")
            raise

    async def delete(self, id: int, user_id: int) -> bool:
        try:
            query = select(self.model).where(self.model.post_id == id)
            result = await self.db.execute(query)
            post = result.scalar_one_or_none()

            if not post:
                return False

            # Kiểm tra quyền sở hữu
            if post.user_id != user_id:
                raise ValueError("You don't have permission to delete this post")

            await self.db.delete(post)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete forum post: {str(e)}")
            raise 