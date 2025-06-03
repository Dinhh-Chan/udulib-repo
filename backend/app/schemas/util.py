from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class FileUploadResponse(BaseModel):
    file_path: str
    file_size: int
    file_type: str
    filename: str

class StatisticsResponse(BaseModel):
    total_documents: int
    total_users: int
    total_downloads: int
    total_views: int

class OverviewStatistics(BaseModel):
    total_users: int
    total_documents: int
    total_subjects: int
    total_majors: int
    total_views: int
    total_downloads: int
    total_comments: int
    total_ratings: int

class DocumentBySubjectStats(BaseModel):
    subject_name: str
    subject_code: str
    document_count: int

class DocumentByMajorStats(BaseModel):
    major_name: str
    major_code: str
    document_count: int

class FileTypeStats(BaseModel):
    file_type: str
    count: int

class DocumentRankingStats(BaseModel):
    title: str
    view_count: int
    download_count: int
    subject_name: str
    uploaded_by: str

class HighestRatedDocumentStats(BaseModel):
    title: str
    avg_rating: float
    rating_count: int
    view_count: int
    download_count: int
    subject_name: str
    uploaded_by: str

class ActiveUserStats(BaseModel):
    username: str
    full_name: str
    documents_uploaded: int
    comments_made: int
    ratings_given: int
    activity_score: int

class StorageUsageStats(BaseModel):
    total_storage_used: int
    by_file_type: List[Dict[str, Any]]

class RatingDistributionStats(BaseModel):
    score: int
    count: int

class ForumActivityStats(BaseModel):
    total_posts: int
    total_replies: int
    most_active_forums: List[Dict[str, Any]]
    
class SearchRequest(BaseModel):
    query: str
    search_in: List[str] = ["title", "description", "content"]
    limit: int = 10

class SearchResult(BaseModel):
    document_id: int
    title: str
    description: Optional[str]
    relevance_score: float
    snippet: str
    
class BulkOperationRequest(BaseModel):
    document_ids: List[int]
    operation: str 
    reason: Optional[str] = None