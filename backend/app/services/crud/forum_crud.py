from typing import List, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.forum import Forum
from app.models.forum_post import ForumPost
from app.models.subject import Subject
from app.schemas.forum import ForumCreate, ForumUpdate
from app.services.crud.base_crud import CRUDBase
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ForumCRUD(CRUDBase[Forum, ForumCreate, ForumUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Forum)
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        try:
            query = (
                select(self.model, func.count(ForumPost.post_id).label("post_count"))
                .outerjoin(ForumPost, ForumPost.forum_id == self.model.forum_id)
                .group_by(self.model.forum_id)
                .offset(skip)
                .limit(limit)
            )
            result = await self.db.execute(query)
            forums_with_count = result.all()

            result_list = []
            for forum, post_count in forums_with_count:
                result_list.append({
                    "forum_id": forum.forum_id,
                    "subject_id": forum.subject_id,
                    "created_at": forum.created_at,
                    "post_count": post_count or 0
                })
            return result_list
        except Exception as e:
            logger.error(f"Error in get all forums: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = (
                select(self.model, func.count(ForumPost.post_id).label("post_count"))
                .outerjoin(ForumPost, ForumPost.forum_id == self.model.forum_id)
                .where(self.model.forum_id == id)
                .group_by(self.model.forum_id)
            )
            result = await self.db.execute(query)
            forum_data = result.first()

            if forum_data:
                forum, post_count = forum_data
                return {
                    "forum_id": forum.forum_id,
                    "subject_id": forum.subject_id,
                    "created_at": forum.created_at,
                    "post_count": post_count or 0
                }
            return None
        except Exception as e:
            logger.error(f"Error in get forum: {str(e)}")
            raise

    async def get_by_subject_id(self, subject_id: int) -> Optional[Dict[str, Any]]:
        try:
            query = (
                select(self.model, func.count(ForumPost.post_id).label("post_count"))
                .outerjoin(ForumPost, ForumPost.forum_id == self.model.forum_id)
                .where(self.model.subject_id == subject_id)
                .group_by(self.model.forum_id)
            )
            result = await self.db.execute(query)
            forum_data = result.first()

            if forum_data:
                forum, post_count = forum_data
                return {
                    "forum_id": forum.forum_id,
                    "subject_id": forum.subject_id,
                    "created_at": forum.created_at,
                    "post_count": post_count or 0
                }
            return None
        except Exception as e:
            logger.error(f"Error in get forum by subject: {str(e)}")
            raise

    async def create(self, obj_in: ForumCreate) -> Dict[str, Any]:
        try:
            forum = Forum(**obj_in.dict())
            # Tạm thời set manual để tương thích với database String
            forum.created_at = datetime.now()
            self.db.add(forum)
            await self.db.commit()
            await self.db.refresh(forum)

            return {
                "forum_id": forum.forum_id,
                "subject_id": forum.subject_id,
                "created_at": forum.created_at,
                "post_count": 0
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create forum: {str(e)}")
            raise

    async def delete(self, id: int) -> bool:
        try:
            query = select(self.model).where(self.model.forum_id == id)
            result = await self.db.execute(query)
            forum = result.scalar_one_or_none()

            if not forum:
                return False

            await self.db.delete(forum)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete forum: {str(e)}")
            raise 