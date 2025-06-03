# Statistics API Documentation

## Tổng quan

Statistics API cung cấp 16 endpoints để xem thống kê chi tiết về hệ thống UDULib. Tất cả endpoints đều yêu cầu JWT authentication, một số chỉ dành cho admin.

**Base URL**: `http://localhost:8021/api/v1/statistics/`

## Endpoints

### 1. 📊 Thống kê tổng quan
```
GET /overview
```

**Response:**
```json
{
  "total_documents": 1250,
  "total_users": 856,
  "total_subjects": 45,
  "total_majors": 12,
  "total_views": 45678,
  "total_downloads": 23456,
  "pending_documents": 23,
  "active_users": 234
}
```

### 2. 📄 Tài liệu theo trạng thái
```
GET /documents/by-status
```

**Response:**
```json
{
  "approved": 1150,
  "pending": 85,
  "rejected": 15
}
```

### 3. 📚 Tài liệu theo môn học
```
GET /documents/by-subject
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)

**Response:**
```json
[
  {
    "subject_name": "Toán cao cấp",
    "document_count": 234,
    "avg_rating": 4.2
  },
  {
    "subject_name": "Lập trình Python",
    "document_count": 187,
    "avg_rating": 4.5
  }
]
```

### 4. 🏫 Tài liệu theo ngành học
```
GET /documents/by-major
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)

**Response:**
```json
[
  {
    "major_name": "Công nghệ thông tin",
    "document_count": 567,
    "avg_rating": 4.3
  },
  {
    "major_name": "Kinh tế",
    "document_count": 234,
    "avg_rating": 4.1
  }
]
```

### 5. 📁 Tài liệu theo loại file
```
GET /documents/by-file-type
```

**Response:**
```json
[
  {
    "file_type": "pdf",
    "count": 890,
    "percentage": 65.2
  },
  {
    "file_type": "docx",
    "count": 234,
    "percentage": 17.1
  },
  {
    "file_type": "pptx",
    "count": 126,
    "percentage": 9.2
  }
]
```

### 6. 👁️ Tài liệu được xem nhiều nhất
```
GET /documents/most-viewed
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)

**Response:**
```json
[
  {
    "document_id": 123,
    "title": "Bài giảng Toán cao cấp",
    "view_count": 2345,
    "rating": 4.5,
    "author": "TS. Nguyễn Văn A"
  }
]
```

### 7. ⬇️ Tài liệu được tải nhiều nhất
```
GET /documents/most-downloaded
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)

**Response:**
```json
[
  {
    "document_id": 456,
    "title": "Đề cương môn Lập trình",
    "download_count": 1234,
    "rating": 4.7,
    "author": "ThS. Trần Thị B"
  }
]
```

### 8. ⭐ Tài liệu có đánh giá cao nhất
```
GET /documents/highest-rated
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)
- `min_ratings` (optional): Số đánh giá tối thiểu (default: 5)

**Response:**
```json
[
  {
    "document_id": 789,
    "title": "Giáo trình Java nâng cao",
    "average_rating": 4.9,
    "total_ratings": 156,
    "author": "PGS. Lê Văn C"
  }
]
```

### 9. 🏃 Người dùng tích cực nhất
```
GET /users/most-active
```

**Query Parameters:**
- `limit` (optional): Giới hạn số lượng kết quả (default: 10)

**Response:**
```json
[
  {
    "user_id": 12,
    "username": "nguyen_van_a",
    "full_name": "Nguyễn Văn A",
    "documents_uploaded": 45,
    "total_views": 12345,
    "total_downloads": 6789,
    "forum_posts": 23,
    "comments": 67
  }
]
```

### 10. ⏰ Hoạt động theo thời gian
```
GET /activity/by-time
```

**Query Parameters:**
- `period` (optional): Khoảng thời gian ('day', 'week', 'month') (default: 'day')
- `days` (optional): Số ngày gần đây (default: 30)

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "document_uploads": 12,
    "document_views": 234,
    "document_downloads": 89,
    "new_users": 3,
    "forum_posts": 15,
    "comments": 45
  }
]
```

### 11. 💾 Dung lượng lưu trữ (Admin only)
```
GET /storage/usage
```

**Auth Required:** Admin

**Response:**
```json
{
  "total_size_bytes": 12456789012,
  "total_size_gb": 11.6,
  "documents_count": 1250,
  "average_size_mb": 9.5,
  "by_file_type": [
    {
      "file_type": "pdf",
      "size_bytes": 8234567890,
      "size_gb": 7.7,
      "count": 890
    }
  ],
  "storage_limit_gb": 100,
  "usage_percentage": 11.6
}
```

### 12. 📈 Phân bố điểm đánh giá
```
GET /engagement/rating-distribution
```

**Response:**
```json
{
  "rating_distribution": {
    "1": 23,
    "2": 45,
    "3": 123,
    "4": 456,
    "5": 678
  },
  "average_rating": 4.2,
  "total_ratings": 1325,
  "participation_rate": 0.68
}
```

### 13. 🗣️ Hoạt động diễn đàn
```
GET /forum/activity
```

**Response:**
```json
{
  "total_forums": 45,
  "total_posts": 1234,
  "total_replies": 2345,
  "active_forums": 23,
  "most_active_forum": {
    "forum_id": 5,
    "name": "Hỏi đáp lập trình",
    "posts_count": 234,
    "replies_count": 567
  },
  "recent_activity": [
    {
      "date": "2024-01-15",
      "new_posts": 12,
      "new_replies": 34
    }
  ]
}
```

### 14. 📊 Xu hướng tương tác tài liệu
```
GET /trends/document-engagement
```

**Query Parameters:**
- `days` (optional): Số ngày gần đây (default: 30)

**Response:**
```json
{
  "engagement_trends": [
    {
      "date": "2024-01-15",
      "views": 234,
      "downloads": 89,
      "ratings": 12,
      "comments": 23
    }
  ],
  "growth_rates": {
    "views": 12.5,
    "downloads": 8.3,
    "ratings": 15.2,
    "comments": 22.1
  },
  "peak_hours": {
    "views": "14:00-15:00",
    "downloads": "10:00-11:00"
  }
}
```

### 15. 📚 Hiệu suất môn học
```
GET /subjects/performance
```

**Response:**
```json
[
  {
    "subject_id": 1,
    "subject_name": "Toán cao cấp",
    "documents_count": 234,
    "total_views": 12345,
    "total_downloads": 6789,
    "average_rating": 4.2,
    "engagement_score": 8.5,
    "trend": "increasing"
  }
]
```

### 16. 🔍 Phân tích chất lượng nội dung
```
GET /quality/content-analysis
```

**Response:**
```json
{
  "quality_metrics": {
    "high_quality_documents": 892,
    "medium_quality_documents": 234,
    "low_quality_documents": 124,
    "average_rating_threshold": 4.0
  },
  "content_health": {
    "documents_with_ratings": 1089,
    "documents_with_comments": 567,
    "documents_without_engagement": 161
  },
  "recommendations": [
    "Khuyến khích đánh giá cho 161 tài liệu chưa có tương tác",
    "Xem xét chất lượng 124 tài liệu có điểm thấp"
  ]
}
```

## Ví dụ sử dụng

### Lấy thống kê tổng quan

```bash
curl -X GET "http://localhost:8021/api/v1/statistics/overview" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Xem top 5 tài liệu được xem nhiều nhất

```bash
curl -X GET "http://localhost:8021/api/v1/statistics/documents/most-viewed?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Xem hoạt động trong 7 ngày qua theo ngày

```bash
curl -X GET "http://localhost:8021/api/v1/statistics/activity/by-time?period=day&days=7" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Xem dung lượng lưu trữ (Admin)

```bash
curl -X GET "http://localhost:8021/api/v1/statistics/storage/usage" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Lưu ý quan trọng

1. **Authentication**: Tất cả endpoints đều yêu cầu JWT token hợp lệ
2. **Admin endpoints**: Endpoint `/storage/usage` chỉ dành cho admin
3. **Rate limiting**: Áp dụng giới hạn 100 requests/phút
4. **Caching**: Kết quả được cache 5-15 phút tùy endpoint
5. **Pagination**: Các endpoints list sử dụng `limit` parameter thay vì pagination thông thường

## Error Codes

- **200**: Thành công
- **401**: Chưa xác thực
- **403**: Không có quyền (đối với admin endpoints)  
- **422**: Tham số không hợp lệ
- **500**: Lỗi server

## Performance

- Tất cả queries đã được tối ưu với indexes
- Sử dụng async SQLAlchemy cho hiệu suất cao
- Kết quả phức tạp được cache để giảm tải database
- Hỗ trợ concurrent requests 