from pydantic import BaseModel, constr
from typing import Optional, List
from app.schemas.common import TimeStampBase
from app.schemas.relationships import SubjectDepartment
from datetime import datetime

class DepartmentBase(BaseModel):
    name: constr(max_length=100)
    slug: constr(max_length=50)
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[constr(max_length=100)] = None
    slug: Optional[constr(max_length=50)] = None
    description: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    department_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Department(DepartmentBase, TimeStampBase):
    department_id: int
    subjects: Optional[List[SubjectDepartment]] = []
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "department_id": 1,
                "name": "Công nghệ thông tin",
                "slug": "it",
                "description": "Ngành học về khoa học máy tính, phát triển phần mềm và hệ thống thông tin"
            }
        }

# Resolve forward references
Department.model_rebuild() 