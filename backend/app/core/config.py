# app/core/config.py
import secrets
from typing import Any, Dict, List, Optional, Union
import os
from pydantic import AnyHttpUrl, PostgresDsn, field_validator, model_validator
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """
    Application settings.
    """
    # Base

    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # Project name and metadata
    PROJECT_NAME: str = "FastAPI Base Project"
    
    # Server
    SERVER_NAME: str = "fastapi"
    SERVER_HOST: AnyHttpUrl = "http://localhost:8000"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    @field_validator("BACKEND_CORS_ORIGINS")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database - PostgreSQL
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    SQL_DATABASE_URL: Optional[str] = None
    
    # SQLite options
    USE_SQLITE: bool = False
    SQLITE_DB_FILE: str = "./app.db"
    
    # Computed DB URI
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    @model_validator(mode='after')
    def assemble_db_connection(self) -> 'Settings':
        if self.SQL_DATABASE_URL:
            # Đảm bảo rằng nếu SQL_DATABASE_URL được cung cấp và chứa psycopg2, thay thế nó
            if "psycopg2" in self.SQL_DATABASE_URL:
                # Thay thế postgresql+psycopg2 bằng postgresql+asyncpg
                self.SQLALCHEMY_DATABASE_URI = self.SQL_DATABASE_URL.replace("postgresql+psycopg2", "postgresql+asyncpg")
            else:
                self.SQLALCHEMY_DATABASE_URI = self.SQL_DATABASE_URL
        elif self.USE_SQLITE:
            self.SQLALCHEMY_DATABASE_URI = f"sqlite+aiosqlite:///{self.SQLITE_DB_FILE}"
        else:
            self.SQLALCHEMY_DATABASE_URI = f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        return self
    
    # Database connection settings
    DB_ECHO_LOG: bool = False
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    
    # Security
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    
    # Admin user creation
    FIRST_SUPERUSER_EMAIL: str = "admin@example.com"
    FIRST_SUPERUSER_USERNAME: str = "admin"
    FIRST_SUPERUSER_PASSWORD: str = "admin"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Email
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_USER: Optional[str] = "thuvienudu@gmail.com"
    SMTP_PASSWORD: Optional[str] = "umgm gcuk qvrb kfin"
    EMAILS_FROM_EMAIL: Optional[str] = "thuvienudu@gmail.com"
    EMAILS_FROM_NAME: Optional[str] = "Thư viện UDU"
    
    # Password reset token expire time (minutes)
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None

    # MinIO Configuration
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_EXTERNAL_ENDPOINT: str = "localhost:9000"  # URL cho client browser truy cập
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_SECURE: bool = False  # Set to True for HTTPS
    MINIO_DOCUMENT_BUCKET: str = "documents"
    MINIO_AVATAR_BUCKET: str = "avatar"
    MINIO_MAJOR_IMAGE_BUCKET: str = "major-images"
    
<<<<<<< HEAD
=======
    FRONTEND_REDIRECT_URL: str = "https://udulib.iuptit.com"
    
    # Google OAuth2 Configuration
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "")
    GOOGLE_SCOPES: List[str] = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid"
    ]

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "ignore"  # Bỏ qua các biến môi trường không được định nghĩa
    }


settings = Settings()