from pydantic import BaseModel
from typing import List

class DepartmentSubject(BaseModel):
    department_id: int
    department_name: str
    department_code: str

class SubjectDepartment(BaseModel):
    subject_id: int
    subject_name: str
    subject_code: str 