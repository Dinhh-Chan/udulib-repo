from pydantic import BaseModel, EmailStr, conint, constr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
class UserRole(str, Enum):
    student = "student"
    lecturer = "lecturer"
    admin = "admin"

class UserStatus(str, Enum):
    active = "active"
    banned = "banned"
    pending = "pending"

class DocumentStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"

class ForumStatus(str, Enum):
    approved = "approved"
    pending = "pending"
    rejected = "rejected"

class HistoryAction(str, Enum):
    view = "view"
    download = "download"