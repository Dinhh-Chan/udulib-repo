from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
from sqlalchemy import func
logger = logging.getLogger(__name__)

class SubjectCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, skip: int = 0, limit: int = 100, major_id: Optional[int] = None, year_id: Optional[int] = None) -> List[Dict[str, Any]]:
        try:
            query = select(Subject)
            
            if major_id is not None:
                query = query.filter(Subject.major_id == major_id)
            if year_id is not None:
                query = query.filter(Subject.year_id == year_id)
                
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            subjects = result.scalars().all()
            logger.info(f"Found {len(subjects)} subjects")

            # Debug first subject if exists
            if subjects:
                first_subject = subjects[0]
                logger.debug(f"First subject data: id={first_subject.subject_id}, name={first_subject.subject_name}")

            result_list = [
                {
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "major_id": subject.major_id,
                    "year_id": subject.year_id,
                    "created_at": subject.created_at,
                    "updated_at": subject.updated_at
                }
                for subject in subjects
            ]
            logger.debug(f"Converted {len(result_list)} subjects to dict format")
            return result_list
        except Exception as e:
            logger.error(f"Error in get all subjects: {str(e)}")
            raise

    async def get_by_id(self, id: int) -> Optional[Dict[str, Any]]:
        try:
            query = select(Subject).where(Subject.subject_id == id)
            result = await self.db.execute(query)
            subject = result.scalar_one_or_none()

            if subject:
                return {
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "major_id": subject.major_id,
                    "year_id": subject.year_id,
                    "created_at": subject.created_at,
                    "updated_at": subject.updated_at
                }
            return None
        except Exception as e:
            logger.error(f"Error in get subject: {str(e)}")
            raise

    async def get_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        try:
            query = select(Subject).where(Subject.subject_code == code)
            result = await self.db.execute(query)
            subject = result.scalar_one_or_none()

            if subject:
                return {
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "major_id": subject.major_id,
                    "year_id": subject.year_id,
                    "created_at": subject.created_at,
                    "updated_at": subject.updated_at
                }
            return None
        except Exception as e:
            logger.error(f"Error in get subject by code: {str(e)}")
            raise

    async def create(self, obj_in: SubjectCreate) -> Dict[str, Any]:
        try:
            subject = Subject(**obj_in.dict())
            self.db.add(subject)
            await self.db.commit()
            await self.db.refresh(subject)

            return {
                "subject_id": subject.subject_id,
                "subject_name": subject.subject_name,
                "subject_code": subject.subject_code,
                "description": subject.description,
                "major_id": subject.major_id,
                "year_id": subject.year_id,
                "created_at": subject.created_at,
                "updated_at": subject.updated_at
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in create subject: {str(e)}")
            raise

    async def update(self, id: int, obj_in: SubjectUpdate) -> Optional[Dict[str, Any]]:
        try:
            query = select(Subject).where(Subject.subject_id == id)
            result = await self.db.execute(query)
            subject = result.scalar_one_or_none()

            if not subject:
                return None

            update_data = obj_in.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(subject, field, value)

            await self.db.commit()
            await self.db.refresh(subject)

            return {
                "subject_id": subject.subject_id,
                "subject_name": subject.subject_name,
                "subject_code": subject.subject_code,
                "description": subject.description,
                "major_id": subject.major_id,
                "year_id": subject.year_id,
                "created_at": subject.created_at,
                "updated_at": subject.updated_at
            }
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in update subject: {str(e)}")
            raise

    async def delete(self, id: int) -> bool:
        try:
            query = select(Subject).where(Subject.subject_id == id)
            result = await self.db.execute(query)
            subject = result.scalar_one_or_none()

            if not subject:
                return False

            await self.db.delete(subject)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in delete subject: {str(e)}")
            raise 
    async def count_subject(self) -> int:
        try:
            query = select(func.count(Subject.subject_id))
            result = await self.db.execute(query)
            count = result.scalar()
            return count
        except Exception as e:
            logger.error(f"Error in count subjects: {str(e)}")
            raise 