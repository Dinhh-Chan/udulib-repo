from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.subject import Subject
from app.models.major import Major
from app.models.academic_year import AcademicYear
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

    async def get_all_with_details(self, skip: int = 0, limit: int = 100, major_id: Optional[int] = None, year_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Lấy danh sách môn học kèm thông tin đầy đủ của major và academic_year
        """
        try:
            query = (
                select(Subject, Major, AcademicYear)
                .join(Major, Subject.major_id == Major.major_id)
                .join(AcademicYear, Subject.year_id == AcademicYear.year_id)
            )
            
            if major_id is not None:
                query = query.filter(Subject.major_id == major_id)
            if year_id is not None:
                query = query.filter(Subject.year_id == year_id)
                
            query = query.offset(skip).limit(limit)
            result = await self.db.execute(query)
            rows = result.all()
            logger.info(f"Found {len(rows)} subjects with details")

            result_list = []
            for subject, major, academic_year in rows:
                result_list.append({
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "major_id": subject.major_id,
                    "year_id": subject.year_id,
                    "created_at": subject.created_at,
                    "updated_at": subject.updated_at,
                    "major": {
                        "major_id": major.major_id,
                        "major_name": major.major_name,
                        "major_code": major.major_code,
                        "description": major.description,
                        "image_url": major.image_url,
                        "created_at": major.created_at,
                        "updated_at": major.updated_at
                    },
                    "academic_year": {
                        "year_id": academic_year.year_id,
                        "year_name": academic_year.year_name,
                        "year_order": academic_year.year_order,
                        "created_at": academic_year.created_at,
                        "updated_at": academic_year.updated_at
                    }
                })
            
            logger.debug(f"Converted {len(result_list)} subjects with details to dict format")
            return result_list
        except Exception as e:
            logger.error(f"Error in get all subjects with details: {str(e)}")
            raise

    async def get_by_id_with_details(self, id: int) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin chi tiết của một môn học kèm thông tin đầy đủ của major và academic_year
        """
        try:
            query = (
                select(Subject, Major, AcademicYear)
                .join(Major, Subject.major_id == Major.major_id)
                .join(AcademicYear, Subject.year_id == AcademicYear.year_id)
                .where(Subject.subject_id == id)
            )
            result = await self.db.execute(query)
            row = result.first()

            if row:
                subject, major, academic_year = row
                return {
                    "subject_id": subject.subject_id,
                    "subject_name": subject.subject_name,
                    "subject_code": subject.subject_code,
                    "description": subject.description,
                    "major_id": subject.major_id,
                    "year_id": subject.year_id,
                    "created_at": subject.created_at,
                    "updated_at": subject.updated_at,
                    "major": {
                        "major_id": major.major_id,
                        "major_name": major.major_name,
                        "major_code": major.major_code,
                        "description": major.description,
                        "image_url": major.image_url,
                        "created_at": major.created_at,
                        "updated_at": major.updated_at
                    },
                    "academic_year": {
                        "year_id": academic_year.year_id,
                        "year_name": academic_year.year_name,
                        "year_order": academic_year.year_order,
                        "created_at": academic_year.created_at,
                        "updated_at": academic_year.updated_at
                    }
                }
            return None
        except Exception as e:
            logger.error(f"Error in get subject by id with details: {str(e)}")
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
            # Kiểm tra subject_code đã tồn tại chưa
            existing_subject = await self.get_by_code(obj_in.subject_code)
            if existing_subject:
                raise ValueError(f"Mã môn học '{obj_in.subject_code}' đã tồn tại")
            
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
        except ValueError:
            # Re-raise ValueError để endpoint có thể catch và trả về lỗi 400
            await self.db.rollback()
            raise
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
            
            # Nếu có cập nhật subject_code, kiểm tra không trùng
            if "subject_code" in update_data and update_data["subject_code"] != subject.subject_code:
                existing_subject = await self.get_by_code(update_data["subject_code"])
                if existing_subject and existing_subject["subject_id"] != id:
                    raise ValueError(f"Mã môn học '{update_data['subject_code']}' đã tồn tại")
            
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
        except ValueError:
            # Re-raise ValueError để endpoint có thể catch và trả về lỗi 400
            await self.db.rollback()
            raise
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

    async def count_subjects_by_major(self) -> List[dict]:
        """
        Đếm số lượng môn học theo từng ngành học.
        Trả về danh sách các ngành học kèm số lượng môn học.
        """
        try:
            query = (
                select(
                    Major.major_id,
                    Major.major_name,
                    Major.major_code,
                    func.count(Subject.subject_id).label('subject_count')
                )
                .outerjoin(Subject, Major.major_id == Subject.major_id)
                .group_by(Major.major_id, Major.major_name, Major.major_code)
                .order_by(Major.major_name)
            )
            
            result = await self.db.execute(query)
            subjects_by_major = result.all()
            
            return [
                {
                    "major_id": int(major.major_id),
                    "major_name": str(major.major_name),
                    "major_code": str(major.major_code),
                    "subject_count": int(major.subject_count or 0)
                }
                for major in subjects_by_major
            ]
        except Exception as e:
            logger.error(f"Error in count subjects by major: {str(e)}")
            raise 