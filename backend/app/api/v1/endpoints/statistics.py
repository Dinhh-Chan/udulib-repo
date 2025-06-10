from typing import Dict, List, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user, require_role
from app.services.crud.statistics_crud import StatisticsCRUD
from app.schemas.util import (
    OverviewStatistics, DocumentBySubjectStats, DocumentByMajorStats,
    FileTypeStats, DocumentRankingStats, HighestRatedDocumentStats,
    ActiveUserStats, StorageUsageStats, RatingDistributionStats,
    ForumActivityStats
)

router = APIRouter()

@router.get("/overview", response_model=OverviewStatistics)
async def get_overview_statistics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tổng quan hệ thống
    """
    crud = StatisticsCRUD(db)
    data = await crud.get_overview_statistics()
    return OverviewStatistics(**data)

@router.get("/documents/by-status")
async def get_documents_by_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tài liệu theo trạng thái
    """
    crud = StatisticsCRUD(db)
    return await crud.get_documents_by_status()

@router.get("/documents/by-subject")
async def get_documents_by_subject(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê số lượng tài liệu theo môn học (top môn học có nhiều tài liệu nhất)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_documents_by_subject(limit=limit)

@router.get("/documents/by-major")
async def get_documents_by_major(
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(get_current_user)
):
    """
    Thống kê số lượng tài liệu theo ngành học
    """
    crud = StatisticsCRUD(db)
    return await crud.get_documents_by_major()

@router.get("/documents/by-file-type")
async def get_documents_by_file_type(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tài liệu theo loại file
    """
    crud = StatisticsCRUD(db)
    return await crud.get_documents_by_file_type()

@router.get("/documents/most-viewed")
async def get_most_viewed_documents(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tài liệu được xem nhiều nhất
    """
    crud = StatisticsCRUD(db)
    return await crud.get_most_viewed_documents(limit=limit)

@router.get("/documents/most-downloaded")
async def get_most_downloaded_documents(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tài liệu được tải nhiều nhất
    """
    crud = StatisticsCRUD(db)
    return await crud.get_most_downloaded_documents(limit=limit)

@router.get("/documents/highest-rated")
async def get_highest_rated_documents(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê tài liệu có điểm đánh giá cao nhất
    """
    crud = StatisticsCRUD(db)
    return await crud.get_highest_rated_documents(limit=limit)

@router.get("/users/most-active")
async def get_most_active_users(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê người dùng tích cực nhất (upload nhiều tài liệu, comment nhiều)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_most_active_users(limit=limit)

@router.get("/activity/by-time")
async def get_activity_by_time(
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê hoạt động theo thời gian (documents upload, comments, ratings)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_activity_by_time(days=days)

@router.get("/storage/usage")
async def get_storage_usage(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """
    Thống kê dung lượng lưu trữ (chỉ admin)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_storage_usage()

@router.get("/engagement/rating-distribution")
async def get_rating_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê phân bố điểm đánh giá
    """
    crud = StatisticsCRUD(db)
    return await crud.get_rating_distribution()

@router.get("/forum/activity")
async def get_forum_activity(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê hoạt động diễn đàn
    """
    crud = StatisticsCRUD(db)
    return await crud.get_forum_activity()

@router.get("/trends/document-engagement")
async def get_document_engagement_trends(
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê xu hướng tương tác với tài liệu theo thời gian (views, downloads)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_document_engagement_trends(days=days)

@router.get("/subjects/performance")
async def get_subject_performance(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê hiệu suất môn học (số tài liệu, lượt xem, đánh giá trung bình)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_subject_performance(limit=limit)

@router.get("/quality/content-analysis")
async def get_content_quality_analysis(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Phân tích chất lượng nội dung (tài liệu có comment nhiều, đánh giá cao)
    """
    crud = StatisticsCRUD(db)
    return await crud.get_content_quality_analysis() 