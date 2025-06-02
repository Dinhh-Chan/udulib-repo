from typing import Dict, List, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timedelta

from app.models.user import User
from app.models.document import Document
from app.models.subject import Subject
from app.models.major import Major
from app.models.rating import Rating
from app.models.comment import Comment

class StatisticsCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_overview_statistics(self) -> Dict[str, int]:
        """
        Lấy thống kê tổng quan hệ thống
        """
        # Tổng số người dùng
        total_users = await self.db.scalar(text("SELECT COUNT(*) FROM users"))
        
        # Tổng số tài liệu
        total_documents = await self.db.scalar(text("SELECT COUNT(*) FROM documents"))
        
        # Tổng số môn học
        total_subjects = await self.db.scalar(text("SELECT COUNT(*) FROM subjects"))
        
        # Tổng số ngành học
        total_majors = await self.db.scalar(text("SELECT COUNT(*) FROM majors"))
        
        # Tổng lượt xem
        total_views = await self.db.scalar(text("SELECT COALESCE(SUM(view_count), 0) FROM documents"))
        
        # Tổng lượt tải
        total_downloads = await self.db.scalar(text("SELECT COALESCE(SUM(download_count), 0) FROM documents"))
        
        # Tổng số bình luận
        total_comments = await self.db.scalar(text("SELECT COUNT(*) FROM comments"))
        
        # Tổng số đánh giá
        total_ratings = await self.db.scalar(text("SELECT COUNT(*) FROM ratings"))
        
        return {
            "total_users": total_users or 0,
            "total_documents": total_documents or 0,
            "total_subjects": total_subjects or 0,
            "total_majors": total_majors or 0,
            "total_views": total_views or 0,
            "total_downloads": total_downloads or 0,
            "total_comments": total_comments or 0,
            "total_ratings": total_ratings or 0
        }

    async def get_documents_by_status(self) -> Dict[str, int]:
        """
        Thống kê tài liệu theo trạng thái
        """
        result = await self.db.execute(text("""
            SELECT status, COUNT(*) as count
            FROM documents
            GROUP BY status
        """))
        
        data = {}
        for row in result:
            data[row.status] = row.count
        
        return data

    async def get_documents_by_subject(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Thống kê số lượng tài liệu theo môn học
        """
        result = await self.db.execute(text(f"""
            SELECT s.subject_name, s.subject_code, COUNT(d.document_id) as document_count
            FROM subjects s
            LEFT JOIN documents d ON s.subject_id = d.subject_id
            GROUP BY s.subject_id, s.subject_name, s.subject_code
            ORDER BY document_count DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "subject_name": row.subject_name,
                "subject_code": row.subject_code,
                "document_count": row.document_count
            }
            for row in result
        ]

    async def get_documents_by_major(self) -> List[Dict[str, Any]]:
        """
        Thống kê số lượng tài liệu theo ngành học
        """
        result = await self.db.execute(text("""
            SELECT m.major_name, m.major_code, COUNT(d.document_id) as document_count
            FROM majors m
            LEFT JOIN subjects s ON m.major_id = s.major_id
            LEFT JOIN documents d ON s.subject_id = d.subject_id
            GROUP BY m.major_id, m.major_name, m.major_code
            ORDER BY document_count DESC
        """))
        
        return [
            {
                "major_name": row.major_name,
                "major_code": row.major_code,
                "document_count": row.document_count
            }
            for row in result
        ]

    async def get_documents_by_file_type(self) -> List[Dict[str, Any]]:
        """
        Thống kê tài liệu theo loại file
        """
        result = await self.db.execute(text("""
            SELECT file_type, COUNT(*) as count
            FROM documents
            GROUP BY file_type
            ORDER BY count DESC
        """))
        
        return [
            {
                "file_type": row.file_type,
                "count": row.count
            }
            for row in result
        ]

    async def get_most_viewed_documents(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Lấy tài liệu được xem nhiều nhất
        """
        result = await self.db.execute(text(f"""
            SELECT d.title, d.view_count, d.download_count, s.subject_name, u.username
            FROM documents d
            JOIN subjects s ON d.subject_id = s.subject_id
            JOIN users u ON d.user_id = u.user_id
            ORDER BY d.view_count DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "title": row.title,
                "view_count": row.view_count,
                "download_count": row.download_count,
                "subject_name": row.subject_name,
                "uploaded_by": row.username
            }
            for row in result
        ]

    async def get_most_downloaded_documents(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Lấy tài liệu được tải nhiều nhất
        """
        result = await self.db.execute(text(f"""
            SELECT d.title, d.download_count, d.view_count, s.subject_name, u.username
            FROM documents d
            JOIN subjects s ON d.subject_id = s.subject_id
            JOIN users u ON d.user_id = u.user_id
            ORDER BY d.download_count DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "title": row.title,
                "download_count": row.download_count,
                "view_count": row.view_count,
                "subject_name": row.subject_name,
                "uploaded_by": row.username
            }
            for row in result
        ]

    async def get_highest_rated_documents(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Lấy tài liệu có điểm đánh giá cao nhất
        """
        result = await self.db.execute(text(f"""
            SELECT d.title, AVG(r.score) as avg_rating, COUNT(r.rating_id) as rating_count,
                   d.view_count, d.download_count, s.subject_name, u.username
            FROM documents d
            JOIN subjects s ON d.subject_id = s.subject_id
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN ratings r ON d.document_id = r.document_id AND r.score > 0
            GROUP BY d.document_id, d.title, d.view_count, d.download_count, s.subject_name, u.username
            HAVING COUNT(r.rating_id) > 0
            ORDER BY avg_rating DESC, rating_count DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "title": row.title,
                "avg_rating": round(float(row.avg_rating), 2) if row.avg_rating else 0,
                "rating_count": row.rating_count,
                "view_count": row.view_count,
                "download_count": row.download_count,
                "subject_name": row.subject_name,
                "uploaded_by": row.username
            }
            for row in result
        ]

    async def get_most_active_users(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Lấy người dùng tích cực nhất
        """
        result = await self.db.execute(text(f"""
            SELECT u.username, u.full_name,
                   COUNT(DISTINCT d.document_id) as documents_uploaded,
                   COUNT(DISTINCT c.comment_id) as comments_made,
                   COUNT(DISTINCT r.rating_id) as ratings_given
            FROM users u
            LEFT JOIN documents d ON u.user_id = d.user_id
            LEFT JOIN comments c ON u.user_id = c.user_id
            LEFT JOIN ratings r ON u.user_id = r.user_id
            WHERE u.role != 'admin'
            GROUP BY u.user_id, u.username, u.full_name
            ORDER BY (documents_uploaded + comments_made + ratings_given) DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "username": row.username,
                "full_name": row.full_name,
                "documents_uploaded": row.documents_uploaded,
                "comments_made": row.comments_made,
                "ratings_given": row.ratings_given,
                "activity_score": row.documents_uploaded + row.comments_made + row.ratings_given
            }
            for row in result
        ]

    async def get_activity_by_time(self, days: int = 30) -> Dict[str, Dict[str, int]]:
        """
        Thống kê hoạt động theo thời gian
        """
        start_date = datetime.now() - timedelta(days=days)
        
        result = await self.db.execute(text(f"""
            WITH activity_dates AS (
                SELECT DATE(created_at) as activity_date, 'document' as activity_type, COUNT(*) as count
                FROM documents
                WHERE created_at >= '{start_date}'
                GROUP BY DATE(created_at)
                
                UNION ALL
                
                SELECT DATE(created_at) as activity_date, 'comment' as activity_type, COUNT(*) as count
                FROM comments
                WHERE created_at >= '{start_date}'
                GROUP BY DATE(created_at)
                
                UNION ALL
                
                SELECT DATE(created_at) as activity_date, 'rating' as activity_type, COUNT(*) as count
                FROM ratings
                WHERE created_at >= '{start_date}'
                GROUP BY DATE(created_at)
            )
            SELECT activity_date, activity_type, SUM(count) as total_count
            FROM activity_dates
            GROUP BY activity_date, activity_type
            ORDER BY activity_date DESC, activity_type
        """))
        
        # Nhóm data theo ngày
        activity_by_date = {}
        for row in result:
            date_str = str(row.activity_date)
            if date_str not in activity_by_date:
                activity_by_date[date_str] = {}
            activity_by_date[date_str][row.activity_type] = row.total_count
        
        return activity_by_date

    async def get_storage_usage(self) -> Dict[str, Any]:
        """
        Thống kê dung lượng lưu trữ
        """
        result = await self.db.execute(text("""
            SELECT 
                file_type,
                COUNT(*) as file_count,
                SUM(file_size) as total_size,
                AVG(file_size) as avg_size
            FROM documents
            GROUP BY file_type
            ORDER BY total_size DESC
        """))
        
        total_size_result = await self.db.execute(text("SELECT SUM(file_size) as total FROM documents"))
        total_size = total_size_result.scalar() or 0
        
        return {
            "total_storage_used": total_size,
            "by_file_type": [
                {
                    "file_type": row.file_type,
                    "file_count": row.file_count,
                    "total_size": row.total_size,
                    "avg_size": round(float(row.avg_size), 2) if row.avg_size else 0,
                    "percentage": round((row.total_size / total_size * 100), 2) if total_size > 0 else 0
                }
                for row in result
            ]
        }

    async def get_rating_distribution(self) -> List[Dict[str, int]]:
        """
        Thống kê phân bố điểm đánh giá
        """
        result = await self.db.execute(text("""
            SELECT score, COUNT(*) as count
            FROM ratings
            WHERE score > 0
            GROUP BY score
            ORDER BY score
        """))
        
        return [
            {
                "score": row.score,
                "count": row.count
            }
            for row in result
        ]

    async def get_forum_activity(self) -> Dict[str, Any]:
        """
        Thống kê hoạt động diễn đàn
        """
        # Tổng số posts
        total_posts = await self.db.scalar(text("SELECT COUNT(*) FROM forum_posts"))
        
        # Tổng số replies
        total_replies = await self.db.scalar(text("SELECT COUNT(*) FROM forum_replies"))
        
        # Forum có nhiều posts nhất
        most_active_forums = await self.db.execute(text("""
            SELECT s.subject_name, COUNT(fp.post_id) as post_count
            FROM subjects s
            JOIN forums f ON s.subject_id = f.subject_id
            LEFT JOIN forum_posts fp ON f.forum_id = fp.forum_id
            GROUP BY s.subject_id, s.subject_name
            ORDER BY post_count DESC
            LIMIT 10
        """))
        
        return {
            "total_posts": total_posts or 0,
            "total_replies": total_replies or 0,
            "most_active_forums": [
                {
                    "subject_name": row.subject_name,
                    "post_count": row.post_count
                }
                for row in most_active_forums
            ]
        }

    async def get_document_engagement_trends(self, days: int = 30) -> List[Dict[str, Any]]:
        """
        Thống kê xu hướng tương tác với tài liệu theo thời gian
        """
        start_date = datetime.now() - timedelta(days=days)
        
        result = await self.db.execute(text(f"""
            SELECT DATE(updated_at) as trend_date,
                   SUM(view_count) as total_views,
                   SUM(download_count) as total_downloads,
                   COUNT(*) as active_documents
            FROM documents
            WHERE updated_at >= '{start_date}'
            GROUP BY DATE(updated_at)
            ORDER BY trend_date DESC
        """))
        
        return [
            {
                "date": str(row.trend_date),
                "total_views": row.total_views,
                "total_downloads": row.total_downloads,
                "active_documents": row.active_documents
            }
            for row in result
        ]

    async def get_subject_performance(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Thống kê hiệu suất môn học
        """
        result = await self.db.execute(text(f"""
            SELECT s.subject_name, s.subject_code,
                   COUNT(DISTINCT d.document_id) as document_count,
                   COALESCE(SUM(d.view_count), 0) as total_views,
                   COALESCE(SUM(d.download_count), 0) as total_downloads,
                   COALESCE(AVG(r.score), 0) as avg_rating,
                   COUNT(DISTINCT r.rating_id) as rating_count
            FROM subjects s
            LEFT JOIN documents d ON s.subject_id = d.subject_id
            LEFT JOIN ratings r ON d.document_id = r.document_id AND r.score > 0
            GROUP BY s.subject_id, s.subject_name, s.subject_code
            ORDER BY total_views DESC, document_count DESC
            LIMIT {limit}
        """))
        
        return [
            {
                "subject_name": row.subject_name,
                "subject_code": row.subject_code,
                "document_count": row.document_count,
                "total_views": row.total_views,
                "total_downloads": row.total_downloads,
                "avg_rating": round(float(row.avg_rating), 2) if row.avg_rating else 0,
                "rating_count": row.rating_count
            }
            for row in result
        ]

    async def get_content_quality_analysis(self) -> List[Dict[str, Any]]:
        """
        Phân tích chất lượng nội dung
        """
        result = await self.db.execute(text("""
            SELECT 
                d.title,
                s.subject_name,
                u.username as uploaded_by,
                COUNT(DISTINCT c.comment_id) as comment_count,
                COUNT(DISTINCT r.rating_id) as rating_count,
                COALESCE(AVG(r.score), 0) as avg_rating,
                d.view_count,
                d.download_count,
                d.status
            FROM documents d
            JOIN subjects s ON d.subject_id = s.subject_id
            JOIN users u ON d.user_id = u.user_id
            LEFT JOIN comments c ON d.document_id = c.document_id
            LEFT JOIN ratings r ON d.document_id = r.document_id AND r.score > 0
            GROUP BY d.document_id, d.title, s.subject_name, u.username, d.view_count, d.download_count, d.status
            HAVING comment_count > 0 OR rating_count > 0
            ORDER BY avg_rating DESC, comment_count DESC, view_count DESC
            LIMIT 20
        """))
        
        return [
            {
                "title": row.title,
                "subject_name": row.subject_name,
                "uploaded_by": row.uploaded_by,
                "comment_count": row.comment_count,
                "rating_count": row.rating_count,
                "avg_rating": round(float(row.avg_rating), 2) if row.avg_rating else 0,
                "view_count": row.view_count,
                "download_count": row.download_count,
                "status": row.status,
                "engagement_score": row.comment_count + row.rating_count + (row.view_count // 10)
            }
            for row in result
        ] 