# API Documentation - UDULib

## Tổng quan

UDULib API cung cấp các endpoints để quản lý tài liệu học tập, người dùng, diễn đàn và thống kê. API sử dụng FastAPI và hỗ trợ cả JWT authentication và API Key authentication.

## Base URL
```
http://localhost:8021/api/v1
```

## Danh sách tất cả API Endpoints

### 🔐 Authentication

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/auth/token` | POST | Đăng nhập và lấy JWT token | No |
| `/api/v1/auth/google` | POST | Đăng nhập bằng Google | No |
| `/api/v1/auth/test-token` | POST | Kiểm tra token hợp lệ | Yes (JWT) |
| `/api/v1/auth/refresh` | POST | Làm mới access token | Yes (Refresh Token) |
| `/api/v1/auth/register` | POST | Đăng ký tài khoản mới | No |
| `/api/v1/auth/forgot-password` | POST | Quên mật khẩu | No |
| `/api/v1/auth/reset-password` | POST | Đặt lại mật khẩu | No |

#### Ví dụ Authentication

**1. Đăng nhập**
```bash
POST /api/v1/auth/token
Content-Type: application/x-www-form-urlencoded

username=admin@example.com&password=admin
```
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "user_id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Administrator",
    "role": "admin"
  }
}
```

**2. Đăng ký**
```bash
POST /api/v1/auth/register
Content-Type: application/json
```
```json
{
  "email": "student@example.com",
  "username": "student123",
  "password": "password123",
  "full_name": "Nguyễn Văn A"
}
```
Response:
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "user_id": 2,
    "email": "student@example.com",
    "username": "student123",
    "full_name": "Nguyễn Văn A",
    "role": "student",
    "is_active": true
  }
}
```

### 👥 Users

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/users/` | GET | Lấy danh sách người dùng | Yes (Admin) |
| `/api/v1/users/` | POST | Tạo người dùng mới | Yes (Admin) |
| `/api/v1/users/me` | GET | Lấy thông tin người dùng hiện tại | Yes (JWT) |
| `/api/v1/users/me` | PUT | Cập nhật thông tin người dùng hiện tại | Yes (JWT) |
| `/api/v1/users/{user_id}` | GET | Lấy thông tin người dùng cụ thể | Yes (JWT) |
| `/api/v1/users/{user_id}` | PUT | Cập nhật người dùng | Yes (Admin) |
| `/api/v1/users/{user_id}` | DELETE | Xóa người dùng | Yes (Admin) |

#### Ví dụ Users

**1. Lấy thông tin tôi**
```bash
GET /api/v1/users/me
Authorization: Bearer {token}
```
Response:
```json
{
  "user_id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "full_name": "Administrator",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**2. Cập nhật thông tin**
```bash
PUT /api/v1/users/me
Authorization: Bearer {token}
Content-Type: application/json
```
```json
{
  "full_name": "Quản trị viên hệ thống",
  "phone": "0123456789"
}
```
Response:
```json
{
  "message": "Cập nhật thành công",
  "user": {
    "user_id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Quản trị viên hệ thống",
    "phone": "0123456789",
    "role": "admin"
  }
}
```

### 🏫 Majors (Ngành học)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/majors/` | GET | Lấy danh sách ngành học | Yes (JWT) |
| `/api/v1/majors/` | POST | Tạo ngành học mới | Yes (Admin) |
| `/api/v1/majors/{major_id}` | GET | Lấy thông tin ngành học cụ thể | Yes (JWT) |
| `/api/v1/majors/{major_id}` | PUT | Cập nhật ngành học | Yes (Admin) |
| `/api/v1/majors/{major_id}` | DELETE | Xóa ngành học | Yes (Admin) |
| `/api/v1/majors/{major_id}/subjects` | GET | Lấy môn học theo ngành | Yes (JWT) |

#### Ví dụ Majors

**1. Lấy danh sách ngành học**
```bash
GET /api/v1/majors/?page=1&per_page=10
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "major_id": 1,
      "name": "Công nghệ thông tin",
      "code": "CNTT",
      "description": "Ngành công nghệ thông tin",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "major_id": 2,
      "name": "Kinh tế",
      "code": "KT",
      "description": "Ngành kinh tế",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 12,
  "page": 1,
  "per_page": 10,
  "pages": 2
}
```

**2. Tạo ngành học mới**
```bash
POST /api/v1/majors/
Authorization: Bearer {token}
Content-Type: application/json
```
```json
{
  "name": "Kỹ thuật phần mềm",
  "code": "KTPM",
  "description": "Ngành kỹ thuật phần mềm"
}
```
Response:
```json
{
  "major_id": 13,
  "name": "Kỹ thuật phần mềm",
  "code": "KTPM",
  "description": "Ngành kỹ thuật phần mềm",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 📚 Subjects (Môn học)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/subjects/` | GET | Lấy danh sách môn học | Yes (JWT) |
| `/api/v1/subjects/` | POST | Tạo môn học mới | Yes (Admin) |
| `/api/v1/subjects/{subject_id}` | GET | Lấy thông tin môn học cụ thể | Yes (JWT) |
| `/api/v1/subjects/{subject_id}` | PUT | Cập nhật môn học | Yes (Admin) |
| `/api/v1/subjects/{subject_id}` | DELETE | Xóa môn học | Yes (Admin) |
| `/api/v1/subjects/academic-year/{year_id}` | GET | Lấy môn học theo năm học | Yes (JWT) |

#### Ví dụ Subjects

**1. Lấy danh sách môn học**
```bash
GET /api/v1/subjects/?major_id=1&page=1&per_page=5
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "subject_id": 1,
      "name": "Toán cao cấp",
      "code": "MATH101",
      "credits": 3,
      "major": {
        "major_id": 1,
        "name": "Công nghệ thông tin"
      },
      "academic_year": {
        "year_id": 1,
        "name": "2023-2024"
      },
      "description": "Môn toán cao cấp cho sinh viên IT"
    }
  ],
  "total": 15,
  "page": 1,
  "per_page": 5,
  "pages": 3
}
```

### 📄 Documents (Tài liệu)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/documents/` | GET | Lấy danh sách tài liệu | Yes (JWT) |
| `/api/v1/documents/` | POST | Tải lên tài liệu mới | Yes (JWT) |
| `/api/v1/documents/{document_id}` | GET | Lấy thông tin tài liệu cụ thể | Yes (JWT) |
| `/api/v1/documents/{document_id}` | PUT | Cập nhật tài liệu | Yes (Owner/Admin) |
| `/api/v1/documents/{document_id}` | DELETE | Xóa tài liệu | Yes (Owner/Admin) |
| `/api/v1/documents/{document_id}/download` | GET | Tải xuống tài liệu | Yes (JWT) |
| `/api/v1/documents/{document_id}/view` | POST | Tăng view count | Yes (JWT) |
| `/api/v1/documents/search` | GET | Tìm kiếm tài liệu | Yes (JWT) |
| `/api/v1/documents/my-documents` | GET | Lấy tài liệu của tôi | Yes (JWT) |
| `/api/v1/documents/pending` | GET | Lấy tài liệu chờ duyệt | Yes (Admin) |
| `/api/v1/documents/{document_id}/approve` | POST | Duyệt tài liệu | Yes (Admin) |
| `/api/v1/documents/{document_id}/reject` | POST | Từ chối tài liệu | Yes (Admin) |

#### Ví dụ Documents

**1. Lấy danh sách tài liệu**
```bash
GET /api/v1/documents/?subject_id=1&status=approved&page=1&per_page=5
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "document_id": 1,
      "title": "Bài giảng Toán cao cấp - Chương 1",
      "description": "Giới thiệu về giới hạn và liên tục",
      "file_name": "toan-cao-cap-chuong-1.pdf",
      "file_size": 2048576,
      "file_type": "pdf",
      "status": "approved",
      "view_count": 234,
      "download_count": 89,
      "average_rating": 4.5,
      "created_at": "2024-01-10T09:00:00Z",
      "author": {
        "user_id": 5,
        "username": "teacher1",
        "full_name": "TS. Nguyễn Văn A"
      },
      "subject": {
        "subject_id": 1,
        "name": "Toán cao cấp",
        "code": "MATH101"
      },
      "tags": ["toán học", "giới hạn", "liên tục"]
    }
  ],
  "total": 45,
  "page": 1,
  "per_page": 5,
  "pages": 9
}
```

**2. Upload tài liệu**
```bash
POST /api/v1/documents/
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
title: "Bài tập Lập trình Python"
description: "Bộ bài tập thực hành Python cơ bản"
subject_id: 2
tags: ["python", "programming", "exercises"]
```
Response:
```json
{
  "document_id": 125,
  "title": "Bài tập Lập trình Python",
  "description": "Bộ bài tập thực hành Python cơ bản",
  "file_name": "bai-tap-python.pdf",
  "file_size": 1024000,
  "file_type": "pdf",
  "status": "pending",
  "view_count": 0,
  "download_count": 0,
  "created_at": "2024-01-15T14:30:00Z",
  "message": "Tài liệu đã được tải lên và đang chờ duyệt"
}
```

**3. Tìm kiếm tài liệu**
```bash
GET /api/v1/documents/search?q=python&subject_id=2&file_type=pdf&page=1&per_page=10
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "document_id": 45,
      "title": "Giáo trình Python cơ bản",
      "description": "Hướng dẫn học Python từ cơ bản đến nâng cao",
      "file_type": "pdf",
      "view_count": 567,
      "average_rating": 4.8,
      "author": {
        "full_name": "ThS. Trần Thị B"
      },
      "relevance_score": 0.95
    }
  ],
  "total": 12,
  "query": "python",
  "page": 1,
  "per_page": 10
}
```

### 💬 Comments

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/comments/` | GET | Lấy danh sách bình luận | Yes (JWT) |
| `/api/v1/comments/` | POST | Tạo bình luận mới | Yes (JWT) |
| `/api/v1/comments/{comment_id}` | GET | Lấy thông tin bình luận cụ thể | Yes (JWT) |
| `/api/v1/comments/{comment_id}` | PUT | Cập nhật bình luận | Yes (Owner/Admin) |
| `/api/v1/comments/{comment_id}` | DELETE | Xóa bình luận | Yes (Owner/Admin) |
| `/api/v1/comments/document/{document_id}` | GET | Lấy bình luận theo tài liệu | Yes (JWT) |
| `/api/v1/comments/{comment_id}/replies` | GET | Lấy phản hồi bình luận | Yes (JWT) |

#### Ví dụ Comments

**1. Lấy bình luận theo tài liệu**
```bash
GET /api/v1/comments/document/1?page=1&per_page=5
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "comment_id": 1,
      "content": "Tài liệu rất hữu ích, cảm ơn thầy!",
      "created_at": "2024-01-12T10:30:00Z",
      "updated_at": "2024-01-12T10:30:00Z",
      "author": {
        "user_id": 15,
        "username": "student1",
        "full_name": "Nguyễn Văn C"
      },
      "document_id": 1,
      "parent_comment_id": null,
      "replies_count": 2
    }
  ],
  "total": 8,
  "page": 1,
  "per_page": 5
}
```

**2. Tạo bình luận**
```bash
POST /api/v1/comments/
Authorization: Bearer {token}
Content-Type: application/json
```
```json
{
  "document_id": 1,
  "content": "Phần này hơi khó hiểu, có thể giải thích rõ hơn không ạ?",
  "parent_comment_id": null
}
```
Response:
```json
{
  "comment_id": 25,
  "content": "Phần này hơi khó hiểu, có thể giải thích rõ hơn không ạ?",
  "created_at": "2024-01-15T15:30:00Z",
  "author": {
    "user_id": 20,
    "username": "student2",
    "full_name": "Lê Thị D"
  },
  "document_id": 1,
  "parent_comment_id": null
}
```

### ⭐ Ratings

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/ratings/` | GET | Lấy danh sách đánh giá | Yes (JWT) |
| `/api/v1/ratings/` | POST | Tạo đánh giá mới | Yes (JWT) |
| `/api/v1/ratings/{rating_id}` | GET | Lấy thông tin đánh giá cụ thể | Yes (JWT) |
| `/api/v1/ratings/{rating_id}` | PUT | Cập nhật đánh giá | Yes (Owner) |
| `/api/v1/ratings/{rating_id}` | DELETE | Xóa đánh giá | Yes (Owner/Admin) |
| `/api/v1/ratings/document/{document_id}` | GET | Lấy đánh giá theo tài liệu | Yes (JWT) |
| `/api/v1/ratings/my-rating/{document_id}` | GET | Lấy đánh giá của tôi cho tài liệu | Yes (JWT) |

#### Ví dụ Ratings

**1. Đánh giá tài liệu**
```bash
POST /api/v1/ratings/
Authorization: Bearer {token}
Content-Type: application/json
```
```json
{
  "document_id": 1,
  "score": 5,
  "comment": "Tài liệu rất chi tiết và dễ hiểu!"
}
```
Response:
```json
{
  "rating_id": 10,
  "document_id": 1,
  "score": 5,
  "comment": "Tài liệu rất chi tiết và dễ hiểu!",
  "created_at": "2024-01-15T16:00:00Z",
  "author": {
    "user_id": 20,
    "username": "student2",
    "full_name": "Lê Thị D"
  }
}
```

**2. Lấy đánh giá theo tài liệu**
```bash
GET /api/v1/ratings/document/1?page=1&per_page=5
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "rating_id": 10,
      "score": 5,
      "comment": "Tài liệu rất chi tiết và dễ hiểu!",
      "created_at": "2024-01-15T16:00:00Z",
      "author": {
        "username": "student2",
        "full_name": "Lê Thị D"
      }
    }
  ],
  "total": 15,
  "average_score": 4.7,
  "rating_distribution": {
    "5": 8,
    "4": 5,
    "3": 2,
    "2": 0,
    "1": 0
  }
}
```

### 🗣️ Forums & Forum Posts

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/forums/` | GET | Lấy danh sách diễn đàn | Yes (JWT) |
| `/api/v1/forum-posts/` | GET | Lấy danh sách bài viết | Yes (JWT) |
| `/api/v1/forum-posts/` | POST | Tạo bài viết mới | Yes (JWT) |
| `/api/v1/forum-posts/{post_id}` | GET | Lấy thông tin bài viết cụ thể | Yes (JWT) |

#### Ví dụ Forums

**1. Lấy danh sách diễn đàn**
```bash
GET /api/v1/forums/?subject_id=1
Authorization: Bearer {token}
```
Response:
```json
{
  "items": [
    {
      "forum_id": 1,
      "name": "Hỏi đáp Toán cao cấp",
      "description": "Diễn đàn thảo luận về môn Toán cao cấp",
      "subject": {
        "subject_id": 1,
        "name": "Toán cao cấp"
      },
      "posts_count": 45,
      "last_post": {
        "post_id": 123,
        "title": "Cách giải bài tập về giới hạn",
        "created_at": "2024-01-15T14:20:00Z",
        "author": "student3"
      }
    }
  ]
}
```

**2. Tạo bài viết diễn đàn**
```bash
POST /api/v1/forum-posts/
Authorization: Bearer {token}
Content-Type: application/json
```
```json
{
  "forum_id": 1,
  "title": "Câu hỏi về tính liên tục của hàm số",
  "content": "Em không hiểu rõ về điều kiện để hàm số liên tục tại một điểm. Mong thầy cô và các bạn giải đáp."
}
```
Response:
```json
{
  "post_id": 150,
  "forum_id": 1,
  "title": "Câu hỏi về tính liên tục của hàm số",
  "content": "Em không hiểu rõ về điều kiện để hàm số liên tục tại một điểm...",
  "created_at": "2024-01-15T16:30:00Z",
  "author": {
    "user_id": 25,
    "username": "student3",
    "full_name": "Phạm Văn E"
  },
  "views_count": 1,
  "replies_count": 0,
  "is_pinned": false
}
```

### 📅 Academic Years (Năm học)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/academic-years/` | GET | Lấy danh sách năm học | Yes (JWT) |
| `/api/v1/academic-years/` | POST | Tạo năm học mới | Yes (Admin) |
| `/api/v1/academic-years/{year_id}` | GET | Lấy thông tin năm học cụ thể | Yes (JWT) |
| `/api/v1/academic-years/{year_id}` | PUT | Cập nhật năm học | Yes (Admin) |
| `/api/v1/academic-years/{year_id}` | DELETE | Xóa năm học | Yes (Admin) |
| `/api/v1/academic-years/current` | GET | Lấy năm học hiện tại | Yes (JWT) |

### 🏷️ Tags

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/tags/` | GET | Lấy danh sách tags | Yes (JWT) |
| `/api/v1/tags/` | POST | Tạo tag mới | Yes (JWT) |
| `/api/v1/tags/{tag_id}` | GET | Lấy thông tin tag cụ thể | Yes (JWT) |
| `/api/v1/tags/{tag_id}` | PUT | Cập nhật tag | Yes (JWT) |
| `/api/v1/tags/{tag_id}` | DELETE | Xóa tag | Yes (JWT) |

### 🏷️ Document Tags

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/documents/{document_id}/tags` | GET | Lấy tags của tài liệu | Yes (JWT) |
| `/api/v1/documents/{document_id}/tags` | POST | Thêm tag cho tài liệu | Yes (Owner/Admin) |
| `/api/v1/documents/{document_id}/tags/{tag_id}` | DELETE | Xóa tag khỏi tài liệu | Yes (Owner/Admin) |

### 📜 Document History

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/history/` | GET | Lấy lịch sử tài liệu | Yes (JWT) |
| `/api/v1/history/document/{document_id}` | GET | Lấy lịch sử theo tài liệu | Yes (JWT) |
| `/api/v1/history/my-history` | GET | Lấy lịch sử của tôi | Yes (JWT) |

### 🔗 Shared Links

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/shared-links/` | GET | Lấy danh sách liên kết chia sẻ | Yes (JWT) |
| `/api/v1/shared-links/` | POST | Tạo liên kết chia sẻ mới | Yes (JWT) |
| `/api/v1/shared-links/{link_id}` | GET | Lấy thông tin liên kết cụ thể | Yes (JWT) |
| `/api/v1/shared-links/{link_id}` | PUT | Cập nhật liên kết chia sẻ | Yes (Owner) |
| `/api/v1/shared-links/{link_id}` | DELETE | Xóa liên kết chia sẻ | Yes (Owner/Admin) |
| `/api/v1/shared-links/access/{token}` | GET | Truy cập tài liệu qua liên kết | No |

### 🔔 Notifications

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/notifications/` | GET | Lấy danh sách thông báo | Yes (JWT) |
| `/api/v1/notifications/` | POST | Tạo thông báo mới | Yes (Admin) |
| `/api/v1/notifications/{notification_id}` | GET | Lấy thông tin thông báo cụ thể | Yes (JWT) |
| `/api/v1/notifications/{notification_id}` | PUT | Cập nhật thông báo | Yes (Admin) |
| `/api/v1/notifications/{notification_id}` | DELETE | Xóa thông báo | Yes (Admin) |
| `/api/v1/notifications/my-notifications` | GET | Lấy thông báo của tôi | Yes (JWT) |
| `/api/v1/notifications/{notification_id}/read` | POST | Đánh dấu đã đọc | Yes (JWT) |

### 💭 Forum Replies

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/forum-replies/` | GET | Lấy danh sách phản hồi | Yes (JWT) |
| `/api/v1/forum-replies/` | POST | Tạo phản hồi mới | Yes (JWT) |
| `/api/v1/forum-replies/{reply_id}` | GET | Lấy thông tin phản hồi cụ thể | Yes (JWT) |
| `/api/v1/forum-replies/{reply_id}` | PUT | Cập nhật phản hồi | Yes (Owner/Admin) |
| `/api/v1/forum-replies/{reply_id}` | DELETE | Xóa phản hồi | Yes (Owner/Admin) |
| `/api/v1/forum-replies/post/{post_id}` | GET | Lấy phản hồi theo bài viết | Yes (JWT) |

### 📊 Statistics (API mới nhất)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|--------------|
| `/api/v1/statistics/overview` | GET | Thống kê tổng quan hệ thống | Yes (JWT) |
| `/api/v1/statistics/documents/by-status` | GET | Thống kê tài liệu theo trạng thái | Yes (JWT) |
| `/api/v1/statistics/documents/by-subject` | GET | Thống kê tài liệu theo môn học | Yes (JWT) |
| `/api/v1/statistics/documents/by-major` | GET | Thống kê tài liệu theo ngành học | Yes (JWT) |
| `/api/v1/statistics/documents/by-file-type` | GET | Thống kê tài liệu theo loại file | Yes (JWT) |
| `/api/v1/statistics/documents/most-viewed` | GET | Tài liệu được xem nhiều nhất | Yes (JWT) |
| `/api/v1/statistics/documents/most-downloaded` | GET | Tài liệu được tải nhiều nhất | Yes (JWT) |
| `/api/v1/statistics/documents/highest-rated` | GET | Tài liệu có đánh giá cao nhất | Yes (JWT) |
| `/api/v1/statistics/users/most-active` | GET | Người dùng tích cực nhất | Yes (JWT) |
| `/api/v1/statistics/activity/by-time` | GET | Thống kê hoạt động theo thời gian | Yes (JWT) |
| `/api/v1/statistics/storage/usage` | GET | Thống kê dung lượng lưu trữ | Yes (Admin) |
| `/api/v1/statistics/engagement/rating-distribution` | GET | Phân bố điểm đánh giá | Yes (JWT) |
| `/api/v1/statistics/forum/activity` | GET | Thống kê hoạt động diễn đàn | Yes (JWT) |
| `/api/v1/statistics/trends/document-engagement` | GET | Xu hướng tương tác tài liệu | Yes (JWT) |
| `/api/v1/statistics/subjects/performance` | GET | Hiệu suất môn học | Yes (JWT) |
| `/api/v1/statistics/quality/content-analysis` | GET | Phân tích chất lượng nội dung | Yes (JWT) |

## Chi tiết xác thực

### JWT Authentication

API sử dụng JWT (JSON Web Tokens) cho xác thực người dùng. Flow xác thực:

1. Đăng nhập qua endpoint `/api/v1/auth/token`
2. Nhận JWT token
3. Sử dụng token trong header `Authorization: Bearer {token}` cho các request tiếp theo

**Ví dụ đăng nhập:**

```bash
curl -X POST "http://localhost:8021/api/v1/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin"
```

**Phản hồi:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "full_name": "Administrator",
    "role": "admin"
  }
}
```

### Google Authentication

```bash
curl -X POST "http://localhost:8021/api/v1/auth/google" \
  -H "Content-Type: application/json" \
  -d '{"token": "GOOGLE_ID_TOKEN"}'
```

## Ví dụ sử dụng API

### 1. Tải lên tài liệu

```bash
curl -X POST "http://localhost:8021/api/v1/documents/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@document.pdf" \
  -F "title=Bài giảng Toán cao cấp" \
  -F "description=Bài giảng chương 1" \
  -F "subject_id=1"
```

### 2. Tìm kiếm tài liệu

```bash
curl -X GET "http://localhost:8021/api/v1/documents/search?q=toán&subject_id=1&page=1&per_page=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Đánh giá tài liệu

```bash
curl -X POST "http://localhost:8021/api/v1/ratings/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": 1,
    "score": 5,
    "comment": "Tài liệu rất hữu ích!"
  }'
```

### 4. Tạo bài viết diễn đàn

```bash
curl -X POST "http://localhost:8021/api/v1/forum-posts/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "forum_id": 1,
    "title": "Câu hỏi về bài tập",
    "content": "Mình không hiểu bài tập này..."
  }'
```

### 5. Xem thống kê tổng quan

```bash
curl -X GET "http://localhost:8021/api/v1/statistics/overview" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Phân quyền

### Roles (Vai trò)

- **admin**: Quản trị viên - có tất cả quyền
- **teacher**: Giảng viên - có thể tạo và quản lý tài liệu, diễn đàn
- **student**: Sinh viên - có thể xem, tải, đánh giá tài liệu và tham gia diễn đàn

### Permissions Matrix

| Action | Admin | Teacher | Student |
|--------|-------|---------|---------|
| Quản lý người dùng | ✅ | ❌ | ❌ |
| Quản lý ngành/môn học | ✅ | ❌ | ❌ |
| Duyệt tài liệu | ✅ | ✅ | ❌ |
| Upload tài liệu | ✅ | ✅ | ✅ |
| Xem/tải tài liệu | ✅ | ✅ | ✅ |
| Đánh giá/bình luận | ✅ | ✅ | ✅ |
| Tham gia diễn đàn | ✅ | ✅ | ✅ |
| Xem thống kê chi tiết | ✅ | ✅ | ❌ |

## Mã lỗi API

| Mã lỗi | Mô tả |
|--------|-------|
| 200 | OK - Thành công |
| 201 | Created - Tạo thành công |
| 400 | Bad Request - Thông tin gửi lên không hợp lệ |
| 401 | Unauthorized - Chưa xác thực hoặc token không hợp lệ |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 422 | Unprocessable Entity - Dữ liệu không thể xử lý |
| 500 | Internal Server Error - Lỗi máy chủ |

## Cấu hình môi trường

Tất cả cấu hình có thể được đặt qua file `.env`:

```env
# Database
SQL_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5437/document_management

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50

# Redis
REDIS_URL=redis://localhost:6379

# Application
ENVIRONMENT=development
```

## API Documentation

- **Swagger UI**: `http://localhost:8021/docs`
- **ReDoc**: `http://localhost:8021/redoc`
- **OpenAPI Schema**: `http://localhost:8021/openapi.json`

## Pagination

Hầu hết API list đều hỗ trợ pagination:

```
GET /api/v1/documents/?page=1&per_page=20
```

**Response:**

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "per_page": 20,
  "pages": 5
}
```

## Rate Limiting

API có giới hạn tốc độ:
- 100 requests/phút cho người dùng đã xác thực
- 20 requests/phút cho người dùng chưa xác thực

## WebSocket Support

Hệ thống hỗ trợ WebSocket cho real-time notifications:

```javascript
const ws = new WebSocket('ws://localhost:8021/ws');
ws.onmessage = function(event) {
    const notification = JSON.parse(event.data);
    console.log('New notification:', notification);
};
```

## Swagger API Examples

Dưới đây là các mẫu request chuẩn Swagger format có thể sử dụng trực tiếp trong Swagger UI (`http://localhost:8021/docs`):

### 🔐 Authentication Examples

**1. Login Request**
```json
{
  "grant_type": "password",
  "username": "admin@example.com", 
  "password": "admin123",
  "scope": "",
  "client_id": "",
  "client_secret": ""
}
```

**2. Register Request**
```json
{
  "email": "student@udulib.com",
  "username": "student2024",
  "password": "SecurePass123!",
  "full_name": "Nguyễn Văn Student",
  "role": "student"
}
```

**3. Google OAuth Request**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkYzBiNzhmYWI4YjNjNDNkNjM2MzQ3NjRhZjY1NDNmNjNmNzZiMDIiLCJ0eXAiOiJKV1QifQ..."
}
```

### 👥 User Management Examples

**1. Create User (Admin)**
```json
{
  "email": "teacher@udulib.com",
  "username": "teacher001",
  "password": "TeacherPass123!",
  "full_name": "TS. Nguyễn Văn Giáo viên",
  "role": "teacher",
  "is_active": true,
  "phone": "+84987654321",
  "department": "Khoa Công nghệ thông tin"
}
```

**2. Update User Profile**
```json
{
  "full_name": "TS. Nguyễn Văn Giáo viên (Cập nhật)",
  "phone": "+84912345678",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Giảng viên môn Lập trình với 10 năm kinh nghiệm"
}
```

### 🏫 Major & Subject Examples

**1. Create Major**
```json
{
  "name": "Kỹ thuật phần mềm",
  "code": "SE",
  "description": "Ngành đào tạo chuyên gia phát triển phần mềm chất lượng cao",
  "is_active": true,
  "established_year": 2020
}
```

**2. Create Subject**
```json
{
  "name": "Lập trình hướng đối tượng",
  "code": "OOP101",
  "credits": 3,
  "major_id": 1,
  "academic_year_id": 1,
  "description": "Môn học cơ bản về lập trình hướng đối tượng",
  "prerequisites": ["Lập trình căn bản", "Cấu trúc dữ liệu"],
  "semester": 2
}
```

**3. Create Academic Year**
```json
{
  "name": "2024-2025",
  "start_date": "2024-09-01",
  "end_date": "2025-07-31",
  "is_current": true,
  "description": "Năm học 2024-2025"
}
```

### 📄 Document Management Examples

**1. Upload Document (Multipart Form)**
```
Content-Type: multipart/form-data

file: [Select File - PDF/DOC/PPT]
title: "Bài giảng OOP - Design Patterns"
description: "Tài liệu chi tiết về các mẫu thiết kế trong lập trình hướng đối tượng"
subject_id: 5
document_type: "lecture"
visibility: "public"
allow_download: true
tags: ["design-patterns", "oop", "programming"]
```

**2. Document Search Parameters**
```json
{
  "q": "design patterns",
  "subject_id": 5,
  "major_id": 1,
  "file_type": "pdf",
  "document_type": "lecture",
  "author_id": 3,
  "min_rating": 4,
  "tags": ["oop", "programming"],
  "date_from": "2024-01-01",
  "date_to": "2024-12-31",
  "sort_by": "relevance",
  "order": "desc",
  "page": 1,
  "per_page": 20
}
```

**3. Document Update**
```json
{
  "title": "Bài giảng OOP - Design Patterns (Cập nhật 2024)",
  "description": "Phiên bản cập nhật với các ví dụ mới và bài tập thực hành",
  "tags": ["design-patterns", "oop", "programming", "updated-2024"],
  "visibility": "public",
  "allow_download": true,
  "version_notes": "Thêm chapter về Observer Pattern và Strategy Pattern"
}
```

### 💬 Comments & Ratings Examples

**1. Create Comment**
```json
{
  "document_id": 25,
  "content": "Tài liệu rất hay! Phần về Singleton Pattern giải thích rất rõ ràng. Có thể thêm ví dụ về thread-safe implementation không ạ?",
  "parent_comment_id": null,
  "is_anonymous": false
}
```

**2. Reply to Comment**
```json
{
  "document_id": 25,
  "content": "Cảm ơn bạn! Mình sẽ cập nhật thêm phần thread-safe trong phiên bản tiếp theo.",
  "parent_comment_id": 15,
  "is_anonymous": false
}
```

**3. Create Rating**
```json
{
  "document_id": 25,
  "score": 5,
  "comment": "Tài liệu xuất sắc! Rất dễ hiểu và có nhiều ví dụ thực tế. Recommend cho ai học OOP.",
  "criteria": {
    "content_quality": 5,
    "clarity": 5,
    "usefulness": 5,
    "accuracy": 5
  }
}
```

### 🗣️ Forum Examples

**1. Create Forum**
```json
{
  "name": "Thảo luận về Design Patterns",
  "description": "Diễn đàn trao đổi kinh nghiệm và thắc mắc về các mẫu thiết kế phần mềm",
  "subject_id": 5,
  "is_public": true,
  "allow_anonymous": false,
  "moderated": true
}
```

**2. Create Forum Post**
```json
{
  "forum_id": 3,
  "title": "Khi nào nên sử dụng Factory Pattern?",
  "content": "Xin chào các bạn!\n\nMình đang học về Factory Pattern nhưng chưa hiểu rõ khi nào thì nên sử dụng pattern này. Có ai có thể chia sẻ kinh nghiệm và ví dụ thực tế không?\n\nCảm ơn các bạn!",
  "is_pinned": false,
  "is_locked": false,
  "tags": ["factory-pattern", "design-patterns", "question"]
}
```

**3. Create Forum Reply**
```json
{
  "post_id": 45,
  "content": "Factory Pattern thường được dùng khi:\n\n1. Bạn cần tạo object nhưng không biết trước loại object cụ thể\n2. Logic tạo object phức tạp và muốn tách riêng\n3. Muốn thay đổi loại object được tạo mà không ảnh hưởng client code\n\nVí dụ: DatabaseConnectionFactory có thể tạo MySQL, PostgreSQL, hay SQLite connection tùy config.",
  "quote_reply_id": null
}
```

### 🔗 Sharing & Notifications Examples

**1. Create Shared Link**
```json
{
  "document_id": 25,
  "expires_at": "2024-12-31T23:59:59Z",
  "max_downloads": 100,
  "require_password": true,
  "password": "SharedDoc2024!",
  "allow_preview": true,
  "track_access": true,
  "description": "Link chia sẻ tài liệu Design Patterns cho lớp SE101"
}
```

**2. Create Notification**
```json
{
  "title": "Tài liệu mới được duyệt",
  "message": "Tài liệu 'Design Patterns in Java' của bạn đã được duyệt và công khai.",
  "type": "document_approved",
  "priority": "normal",
  "recipients": [25, 30, 35],
  "auto_expire": true,
  "expire_after_days": 7,
  "action_url": "/documents/125"
}
```

### 🏷️ Tags & Organization Examples

**1. Create Tags**
```json
{
  "name": "machine-learning",
  "description": "Tài liệu về học máy và trí tuệ nhân tạo",
  "color": "#FF6B6B",
  "is_system_tag": false,
  "category": "technology"
}
```

**2. Bulk Tag Assignment**
```json
{
  "document_id": 25,
  "tag_ids": [1, 5, 8, 12],
  "replace_existing": false
}
```

### 📊 Statistics Query Examples

**1. Activity Statistics**
```json
{
  "period": "month",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "group_by": "week",
  "metrics": ["views", "downloads", "uploads", "registrations"],
  "filters": {
    "subject_ids": [1, 2, 5],
    "user_roles": ["student", "teacher"]
  }
}
```

**2. Document Performance Query**
```json
{
  "time_range": "last_30_days",
  "min_views": 10,
  "sort_by": "engagement_score",
  "include_metrics": ["view_count", "download_count", "rating", "comments"],
  "subject_filter": [1, 2, 3],
  "limit": 50
}
```

### 🔍 Advanced Search Examples

**1. Multi-criteria Document Search**
```json
{
  "query": {
    "text": "machine learning python",
    "filters": {
      "subjects": [1, 2, 5],
      "file_types": ["pdf", "ipynb"],
      "date_range": {
        "from": "2024-01-01",
        "to": "2024-12-31"
      },
      "rating_range": {
        "min": 4.0,
        "max": 5.0
      },
      "tags": ["python", "ai", "tutorial"],
      "authors": [10, 15, 20]
    }
  },
  "sort": {
    "field": "relevance",
    "order": "desc"
  },
  "pagination": {
    "page": 1,
    "per_page": 20
  },
  "highlight": true,
  "include_facets": true
}
```

## Swagger UI Testing Guide

### Bước 1: Truy cập Swagger UI
```
http://localhost:8021/docs
```

### Bước 2: Authentication
1. Click vào nút **"Authorize"** 
2. Thực hiện login qua `/auth/token` endpoint
3. Copy `access_token` từ response
4. Paste vào field **"Value"** với format: `Bearer your_token_here`
5. Click **"Authorize"**

### Bước 3: Test API
1. Chọn endpoint muốn test
2. Click **"Try it out"**
3. Paste example request vào Request body
4. Adjust parameters nếu cần
5. Click **"Execute"**

### Bước 4: Common Test Scenarios

**Scenario 1: Upload và quản lý tài liệu**
```
1. POST /auth/token (Login)
2. POST /documents/ (Upload file)
3. GET /documents/{id} (View document)
4. POST /ratings/ (Rate document) 
5. POST /comments/ (Comment)
```

**Scenario 2: Forum interaction**
```
1. POST /auth/token (Login)
2. GET /forums/ (List forums)
3. POST /forum-posts/ (Create post)
4. POST /forum-replies/ (Reply to post)
5. GET /forum-posts/{id} (View post detail)
```

**Scenario 3: Admin workflow**
```
1. POST /auth/token (Admin login)
2. GET /documents/pending (Review pending docs)
3. POST /documents/{id}/approve (Approve)
4. GET /statistics/overview (View stats)
5. POST /notifications/ (Send notification)
```

## Kết luận

UDULib API cung cấp đầy đủ các endpoints để xây dựng ứng dụng quản lý tài liệu học tập hoàn chỉnh. Với hơn 100 endpoints, hệ thống hỗ trợ tất cả các chức năng từ quản lý người dùng, tài liệu, diễn đàn đến thống kê chi tiết.

Để biết thêm chi tiết về các tham số và response của từng endpoint, vui lòng tham khảo Swagger UI tại `/docs`.