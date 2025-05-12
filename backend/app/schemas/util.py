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