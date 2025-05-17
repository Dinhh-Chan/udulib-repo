from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, departments, academic_year

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(academic_year.router, prefix="/academic_year", tags=["academic_year"])

