from fastapi import APIRouter
<<<<<<< HEAD
from app.api.v1.endpoints import auth, users, academic_year, major, documents, tag, document_tag, subjects, comments, ratings, document_history, shared_link, notification, forums, forum_posts, forum_replies, statistics
=======
from app.api.v1.endpoints import auth, users, academic_year, major, documents, tag, document_tag, subjects, comments, ratings, document_history, shared_link, notification, forums, forum_posts, forum_replies, statistics, password_reset
>>>>>>> befe0c218c91e54fcb443113b695f84fa0e5cb5d

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(major.router, prefix="/majors", tags=["majors"])
api_router.include_router(academic_year.router, prefix="/academic-years", tags=["academic_years"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(tag.router, prefix="/tags", tags=["tags"])
api_router.include_router(document_tag.router, prefix="/documents", tags=["document-tags"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["ratings"])
api_router.include_router(document_history.router, prefix="/history", tags=["document-history"])
api_router.include_router(shared_link.router, prefix="/shared-links", tags=["shared-links"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(forums.router, prefix="/forums", tags=["forums"])
api_router.include_router(forum_posts.router, prefix="/forum-posts", tags=["forum-posts"])
api_router.include_router(forum_replies.router, prefix="/forum-replies", tags=["forum-replies"])
<<<<<<< HEAD
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
=======
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
api_router.include_router(password_reset.router, prefix="/password-reset", tags=["password-reset"])
>>>>>>> befe0c218c91e54fcb443113b695f84fa0e5cb5d
