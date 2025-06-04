from typing import List, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.forum_reply import ForumReply
from app.schemas.forum import ForumReplyCreate, ForumReplyUpdate
from app.services.crud.base_crud import CRUDBase
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ForumReplyCRUD(CRUDBase[ForumReply, ForumReplyCreate, ForumReplyUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(ForumReply)
        self.db = db

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        post_id: Optional[int] = None,
        user_id: Optional[int] = None,
        status: Optional[str] = None,
        parent_reply_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        try:
            query = select(self.model).options(selectinload(self.model.child_replies))
            
            if post_id:
                query = query.where(self.model.post_id == post_id)
            if user_id:
                query = query.where(self.model.user_id == user_id)
            if status:
                query = query.where(self.model.status == status)
            if parent_reply_id is not None:
                query = query.where(self.model.parent_reply_id == parent_reply_id)
            else:
                # Mặc định chỉ lấy top-level replies (không có parent)
                query = query.where(self.model.parent_reply_id.is_(None))
                
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            replies = result.scalars().all()

            result_list = []
            for reply in replies:
                reply_dict = {
                    "reply_id": reply.reply_id,
                    "post_id": reply.post_id,
                    "user_id": reply.user_id,
                    "parent_reply_id": reply.parent_reply_id,
                    "content": reply.content,
                    "status": reply.status,
                    "created_at": reply.created_at,
                    "updated_at": reply.updated_at,
                    "child_replies": []
                }
                
                # Thêm child replies nếu có
                if reply.child_replies:
                    for child in reply.child_replies:
                        reply_dict["child_replies"].append({
                            "reply_id": child.reply_id,
                            "post_id": child.post_id,
                            "user_id": child.user_id,
                            "parent_reply_id": child.parent_reply_id,
                            "content": child.content,
                            "status": child.status,
                            "created_at": child.created_at,
                            "updated_at": child.updated_at,
                            "child_replies": []  # Giới hạn 2 level để tránh quá phức tạp
                        })
                
                result_list.append(reply_dict)
            return result_list
        except Exception as e:
            logger.error(f"Error in get all forum replies: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(self.model).options(selectinload(self.model.child_replies)).where(self.model.reply_id == id)
            result = await self.db.execute(query)
            reply = result.scalar_one_or_none()

            if reply:
                reply_dict = {
                    "reply_id": reply.reply_id,
                    "post_id": reply.post_id,
                    "user_id": reply.user_id,
                    "parent_reply_id": reply.parent_reply_id,
                    "content": reply.content,
                    "status": reply.status,
                    "created_at": reply.created_at,
                    "updated_at": reply.updated_at,
                    "child_replies": []
                }
                
                # Thêm child replies nếu có
                if reply.child_replies:
                    for child in reply.child_replies:
                        reply_dict["child_replies"].append({
                            "reply_id": child.reply_id,
                            "post_id": child.post_id,
                            "user_id": child.user_id,
                            "parent_reply_id": child.parent_reply_id,
                            "content": child.content,
                            "status": child.status,
                            "created_at": child.created_at,
                            "updated_at": child.updated_at,
                            "child_replies": []
                        })
                
                return reply_dict
            return None
        except Exception as e:
            logger.error(f"Error in get forum reply: {str(e)}")
            raise

    async def create(self, obj_in: ForumReplyCreate, user_id: int) -> Dict[str, Any]:
        try:
            reply_data = obj_in.dict()
            reply_data["user_id"] = user_id
            
            # Kiểm tra parent_reply_id có tồn tại không (nếu có)
            if reply_data.get("parent_reply_id"):
                parent_reply = await self.get_by_id(reply_data["parent_reply_id"])
                if not parent_reply:
                    raise ValueError("Parent reply not found")
            
            reply = ForumReply(**reply_data)
            self.db.add(reply)
            await self.db.commit()
            await self.db.refresh(reply)

            return {
                "reply_id": reply.reply_id,
                "post_id": reply.post_id,
                "user_id": reply.user_id,
                "parent_reply_id": reply.parent_reply_id,
                "content": reply.content,
                "status": reply.status,
                "created_at": reply.created_at,
                "updated_at": reply.updated_at,
                "child_replies": []
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create forum reply: {str(e)}")
            raise

    async def update(self, id: int, obj_in: ForumReplyUpdate, user_id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(self.model).where(self.model.reply_id == id)
            result = await self.db.execute(query)
            reply = result.scalar_one_or_none()

            if not reply:
                return None

            # Kiểm tra quyền sở hữu
            if reply.user_id != user_id:
                raise ValueError("You don't have permission to update this reply")

            update_data = obj_in.dict(exclude_unset=True)
            
            for field, value in update_data.items():
                setattr(reply, field, value)

            await self.db.commit()
            await self.db.refresh(reply)

            return {
                "reply_id": reply.reply_id,
                "post_id": reply.post_id,
                "user_id": reply.user_id,
                "content": reply.content,
                "status": reply.status,
                "created_at": reply.created_at,
                "updated_at": reply.updated_at
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in update forum reply: {str(e)}")
            raise

    async def delete(self, id: int, user_id: int) -> bool:
        try:
            query = select(self.model).where(self.model.reply_id == id)
            result = await self.db.execute(query)
            reply = result.scalar_one_or_none()

            if not reply:
                return False

            # Kiểm tra quyền sở hữu
            if reply.user_id != user_id:
                raise ValueError("You don't have permission to delete this reply")

            await self.db.delete(reply)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete forum reply: {str(e)}")
            raise 