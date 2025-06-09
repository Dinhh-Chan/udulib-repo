from typing import List, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from sqlalchemy.orm import selectinload
from app.models.forum_post import ForumPost
from app.models.forum_reply import ForumReply
from app.models.forum_post_like import ForumPostLike
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

    async def increment_views(self, post_id: int) -> bool:
        """Tăng view count cho post"""
        try:
            stmt = (
                update(ForumPost)
                .where(ForumPost.post_id == post_id)
                .values(views=ForumPost.views + 1)
            )
            result = await self.db.execute(stmt)
            await self.db.commit()
            return result.rowcount > 0
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error incrementing views for post {post_id}: {str(e)}")
            return False

    async def like_post(self, post_id: int, user_id: int) -> Dict[str, Any]:
        """Like một post"""
        try:
            # Kiểm tra đã like chưa
            existing_like = await self.db.execute(
                select(ForumPostLike).where(
                    ForumPostLike.post_id == post_id,
                    ForumPostLike.user_id == user_id
                )
            )
            if existing_like.scalar_one_or_none():
                return {"success": False, "message": "Đã like post này rồi"}

            # Tạo like mới
            like = ForumPostLike(post_id=post_id, user_id=user_id)
            self.db.add(like)

            # Tăng like_count trong forum_posts
            stmt = (
                update(ForumPost)
                .where(ForumPost.post_id == post_id)
                .values(like_count=ForumPost.like_count + 1)
            )
            await self.db.execute(stmt)
            await self.db.commit()

            # Lấy like_count mới
            post_result = await self.db.execute(
                select(ForumPost.like_count).where(ForumPost.post_id == post_id)
            )
            new_like_count = post_result.scalar_one()

            return {
                "success": True, 
                "message": "Liked thành công",
                "like_count": new_like_count,
                "is_liked": True
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error liking post {post_id}: {str(e)}")
            return {"success": False, "message": "Lỗi khi like post"}

    async def unlike_post(self, post_id: int, user_id: int) -> Dict[str, Any]:
        """Unlike một post"""
        try:
            # Kiểm tra có like chưa
            existing_like = await self.db.execute(
                select(ForumPostLike).where(
                    ForumPostLike.post_id == post_id,
                    ForumPostLike.user_id == user_id
                )
            )
            like_obj = existing_like.scalar_one_or_none()
            if not like_obj:
                return {"success": False, "message": "Chưa like post này"}

            # Xóa like
            await self.db.execute(
                delete(ForumPostLike).where(
                    ForumPostLike.post_id == post_id,
                    ForumPostLike.user_id == user_id
                )
            )

            # Giảm like_count trong forum_posts
            stmt = (
                update(ForumPost)
                .where(ForumPost.post_id == post_id)
                .values(like_count=func.greatest(ForumPost.like_count - 1, 0))
            )
            await self.db.execute(stmt)
            await self.db.commit()

            # Lấy like_count mới
            post_result = await self.db.execute(
                select(ForumPost.like_count).where(ForumPost.post_id == post_id)
            )
            new_like_count = post_result.scalar_one()

            return {
                "success": True, 
                "message": "Unlike thành công",
                "like_count": new_like_count,
                "is_liked": False
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error unliking post {post_id}: {str(e)}")
            return {"success": False, "message": "Lỗi khi unlike post"}

    async def check_user_liked(self, post_id: int, user_id: int) -> bool:
        """Kiểm tra user đã like post chưa"""
        try:
            result = await self.db.execute(
                select(ForumPostLike).where(
                    ForumPostLike.post_id == post_id,
                    ForumPostLike.user_id == user_id
                )
            )
            return result.scalar_one_or_none() is not None
        except Exception as e:
            logger.error(f"Error checking if user liked post: {str(e)}")
            return False

    async def get_post_stats(self, post_id: int, user_id: Optional[int] = None) -> Dict[str, Any]:
        """Lấy stats của post (views, like_count, reply_count, is_liked)"""
        try:
            # Lấy basic stats
            post_result = await self.db.execute(
                select(ForumPost.views, ForumPost.like_count).where(ForumPost.post_id == post_id)
            )
            post_data = post_result.first()
            if not post_data:
                return None

            # Đếm replies
            reply_result = await self.db.execute(
                select(func.count(ForumReply.reply_id)).where(ForumReply.post_id == post_id)
            )
            reply_count = reply_result.scalar()

            # Check is_liked nếu có user_id
            is_liked = False
            if user_id:
                is_liked = await self.check_user_liked(post_id, user_id)

            return {
                "views": post_data[0],
                "like_count": post_data[1], 
                "reply_count": reply_count,
                "is_liked": is_liked
            }
        except Exception as e:
            logger.error(f"Error getting post stats: {str(e)}")
            return None

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