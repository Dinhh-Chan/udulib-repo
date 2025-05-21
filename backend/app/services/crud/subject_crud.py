from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate
from app.services.crud.base_crud import CRUDBase
from sqlalchemy.orm import Session  
from sqlalchemy import asc
from typing import List, Optional, Dict, Any, Union


