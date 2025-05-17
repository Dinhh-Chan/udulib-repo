from typing import List, Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.department import Department
import logging

logger = logging.getLogger(__name__)

class DepartmentCRUD:
    async def get_all(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Dict]:
        try:
            logger.info(f"Starting get_all with skip={skip}, limit={limit}")
            
            query = select(Department).offset(skip).limit(limit)
            logger.debug(f"Generated SQL query: {query}")
            
            result = await db.execute(query)
            logger.debug("Query executed successfully")
            
            departments = result.scalars().all()
            logger.info(f"Found {len(departments)} departments")
            
            # Debug first department if exists
            if departments:
                first_dept = departments[0]
                logger.debug(f"First department data: id={first_dept.department_id}, name={first_dept.name}")
            
            result_list = [
                {
                    "department_id": dept.department_id,
                    "name": dept.name,
                    "slug": dept.slug,
                    "description": dept.description,
                    "created_at": dept.created_at.isoformat() if dept.created_at else None,
                    "updated_at": dept.updated_at.isoformat() if dept.updated_at else None
                }
                for dept in departments
            ]
            
            logger.debug(f"Converted {len(result_list)} departments to dict format")
            logger.info("Successfully completed get_all operation")
            
            return result_list
        except Exception as e:
            logger.error(f"Error in get all departments: {str(e)}")
            logger.exception("Full traceback:")
            raise

    async def get(self, db: AsyncSession, id: int) -> Optional[Dict]:
        try:
            query = select(Department).where(Department.department_id == id)
            result = await db.execute(query)
            department = result.scalar_one_or_none()
            
            if department:
                return {
                    "department_id": department.department_id,
                    "name": department.name,
                    "slug": department.slug,
                    "description": department.description,
                    "created_at": department.created_at.isoformat() if department.created_at else None,
                    "updated_at": department.updated_at.isoformat() if department.updated_at else None
                }
            return None
        except Exception as e:
            logger.error(f"Error in get department: {str(e)}")
            raise

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Dict]:
        try:
            query = select(Department).where(Department.slug == slug)
            result = await db.execute(query)
            department = result.scalar_one_or_none()
            
            if department:
                return {
                    "department_id": department.department_id,
                    "name": department.name,
                    "slug": department.slug,
                    "description": department.description,
                    "created_at": department.created_at.isoformat() if department.created_at else None,
                    "updated_at": department.updated_at.isoformat() if department.updated_at else None
                }
            return None
        except Exception as e:
            logger.error(f"Error in get department by slug: {str(e)}")
            raise

    async def create(self, db: AsyncSession, obj_in: dict) -> Dict:
        try:
            department = Department(**obj_in)
            db.add(department)
            await db.commit()
            await db.refresh(department)
            
            return {
                "department_id": department.department_id,
                "name": department.name,
                "slug": department.slug,
                "description": department.description,
                "created_at": department.created_at.isoformat() if department.created_at else None,
                "updated_at": department.updated_at.isoformat() if department.updated_at else None
            }
        except Exception as e:
            logger.error(f"Error in create department: {str(e)}")
            raise

    async def update(self, db: AsyncSession, id: int, obj_in: dict) -> Optional[Dict]:
        try:
            query = select(Department).where(Department.department_id == id)
            result = await db.execute(query)
            department = result.scalar_one_or_none()
            
            if not department:
                return None
                
            for key, value in obj_in.items():
                if value is not None:
                    setattr(department, key, value)
            
            await db.commit()
            await db.refresh(department)
            
            return {
                "department_id": department.department_id,
                "name": department.name,
                "slug": department.slug,
                "description": department.description,
                "created_at": department.created_at.isoformat() if department.created_at else None,
                "updated_at": department.updated_at.isoformat() if department.updated_at else None
            }
        except Exception as e:
            logger.error(f"Error in update department: {str(e)}")
            raise

    async def delete(self, db: AsyncSession, id: int) -> Optional[Dict]:
        try:
            # Lấy thông tin department trước khi xóa
            query = select(Department).where(Department.department_id == id)
            result = await db.execute(query)
            department = result.scalar_one_or_none()
            
            if not department:
                return None
            
            # Xóa department trực tiếp bằng SQL
            delete_query = delete(Department).where(Department.department_id == id)
            await db.execute(delete_query)
            await db.commit()
            
            return {
                "department_id": department.department_id,
                "name": department.name,
                "slug": department.slug,
                "description": department.description,
                "created_at": department.created_at.isoformat() if department.created_at else None,
                "updated_at": department.updated_at.isoformat() if department.updated_at else None
            }
        except Exception as e:
            logger.error(f"Error in delete department: {str(e)}")
            await db.rollback()
            raise

department_crud = DepartmentCRUD() 