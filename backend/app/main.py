import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api.v1.api import api_router
from app.core.config import settings


# Setup logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


# Create FastAPI app
app = FastAPI(
    title="UDULib API",
    description="API cho hệ thống quản lý tài liệu học tập",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)


# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các origin trong development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# Custom exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors.
    """
    logger.error(f"Validation error: {exc}")
    
    # Format error detail for better readability
    formatted_errors = []
    for error in exc.errors():
        formatted_errors.append({
            "loc": " -> ".join([str(loc) for loc in error["loc"]]),
            "msg": error["msg"],
            "type": error["type"],
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": formatted_errors},
    )


# Add router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    """
    Root endpoint.
    """
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}! Access the API documentation at {settings.API_V1_STR}/docs"
    }


@app.get("/health")
def health():
    """
    Health check endpoint.
    """
    return {"status": "ok"}