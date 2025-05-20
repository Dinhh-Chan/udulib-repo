from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, academic_year, major, documents, tag, document_tag, subjects, comments, ratings

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(major.router, prefix="/majors", tags=["majors"])
api_router.include_router(academic_year.router, prefix="/academic_year", tags=["academic_year"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(tag.router, prefix="/tags", tags=["tags"])
api_router.include_router(document_tag.router, prefix="/documents", tags=["document-tags"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["ratings"])