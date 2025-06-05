from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.major import Major
from app.schemas.major import MajorCreate, MajorUpdate
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
from sqlalchemy import func
logger = logging.getLogger(__name__)

class MajorCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        try:
            query = select(Major).offset(skip).limit(limit)
            result = await self.db.execute(query)
            majors = result.scalars().all()
            logger.info(f"Found {len(majors)} majors")

            # Debug first major if exists
            if majors:
                first_major = majors[0]
                logger.debug(f"First major data: id={first_major.major_id}, name={first_major.major_name}")

            result_list = [
                {
                    "major_id": major.major_id,
                    "major_name": major.major_name,
                    "major_code": major.major_code,
                    "description": major.description,
                    "image_url": major.image_url,
                    "created_at": major.created_at,
                    "updated_at": major.updated_at
                }
                for major in majors
            ]
            logger.debug(f"Converted {len(result_list)} majors to dict format")
            return result_list
        except Exception as e:
            logger.error(f"Error in get all majors: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(Major).where(Major.major_id == id)
            result = await self.db.execute(query)
            major = result.scalar_one_or_none()

            if major:
                return {
                    "major_id": major.major_id,
                    "major_name": major.major_name,
                    "major_code": major.major_code,
                    "description": major.description,
                    "image_url": major.image_url,
                    "created_at": major.created_at,
                    "updated_at": major.updated_at
                }
            return None
        except Exception as e:
            logger.error(f"Error in get major: {str(e)}")
            raise

    async def get_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        try:
            query = select(Major).where(Major.major_code == code)
            result = await self.db.execute(query)
            major = result.scalar_one_or_none()

            if major:
                return {
                    "major_id": major.major_id,
                    "major_name": major.major_name,
                    "major_code": major.major_code,
                    "description": major.description,
                    "image_url": major.image_url,
                    "created_at": major.created_at,
                    "updated_at": major.updated_at
                }
            return None
        except Exception as e:
            logger.error(f"Error in get major by code: {str(e)}")
            raise

    async def create(self, obj_in: MajorCreate) -> Dict[str, Any]:
        try:
            # Kiểm tra major_code đã tồn tại chưa
            existing_major = await self.get_by_code(obj_in.major_code)
            if existing_major:
                raise ValueError(f"Mã ngành '{obj_in.major_code}' đã tồn tại")
            
            major = Major(**obj_in.dict())
            self.db.add(major)
            await self.db.commit()
            await self.db.refresh(major)

            return {
                "major_id": major.major_id,
                "major_name": major.major_name,
                "major_code": major.major_code,
                "description": major.description,
                "image_url": major.image_url,
                "created_at": major.created_at,
                "updated_at": major.updated_at
            }
        except ValueError:
            # Re-raise ValueError để endpoint có thể catch và trả về lỗi 400
            await self.db.rollback()
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create major: {str(e)}")
            raise

    async def update(self, id: int, obj_in: MajorUpdate) -> Optional[Dict[str, Any]]:
        try:
            query = select(Major).where(Major.major_id == id)
            result = await self.db.execute(query)
            major = result.scalar_one_or_none()

            if not major:
                return None

            update_data = obj_in.dict(exclude_unset=True)
            
            # Nếu có cập nhật major_code, kiểm tra không trùng
            if "major_code" in update_data and update_data["major_code"] != major.major_code:
                existing_major = await self.get_by_code(update_data["major_code"])
                if existing_major and existing_major["major_id"] != id:
                    raise ValueError(f"Mã ngành '{update_data['major_code']}' đã tồn tại")
            
            for field, value in update_data.items():
                setattr(major, field, value)

            await self.db.commit()
            await self.db.refresh(major)

            return {
                "major_id": major.major_id,
                "major_name": major.major_name,
                "major_code": major.major_code,
                "description": major.description,
                "image_url": major.image_url,
                "created_at": major.created_at,
                "updated_at": major.updated_at
            }
        except ValueError:
            # Re-raise ValueError để endpoint có thể catch và trả về lỗi 400
            await self.db.rollback()
            raise
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in update major: {str(e)}")
            raise

    async def delete(self, id: int) -> bool:
        try:
            query = select(Major).where(Major.major_id == id)
            result = await self.db.execute(query)
            major = result.scalar_one_or_none()

            if not major:
                return False

            await self.db.delete(major)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete major: {str(e)}")
            raise 
    async def count_major(self) -> int:
        try:
            query = select(func.count(Major.major_id))
            result = await self.db.execute(query)
            count = result.scalar()
            return count
        except Exception as e:
            logger.error(f"Error in count majors: {str(e)}")
            raise