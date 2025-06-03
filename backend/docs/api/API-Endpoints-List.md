# Danh sách tất cả API Endpoints - UDULib

> **Tổng cộng: 100+ endpoints** | **Base URL:** `http://localhost:8021/api/v1`

## 🔐 Authentication (7 endpoints)
```
POST   /auth/token              # Đăng nhập JWT
POST   /auth/google             # Đăng nhập Google  
POST   /auth/test-token         # Kiểm tra token
POST   /auth/refresh            # Làm mới token
POST   /auth/register           # Đăng ký
POST   /auth/forgot-password    # Quên mật khẩu
POST   /auth/reset-password     # Đặt lại mật khẩu
```

## 👥 Users (7 endpoints)
```
GET    /users/                  # Danh sách người dùng
POST   /users/                  # Tạo người dùng
GET    /users/me                # Thông tin tôi
PUT    /users/me                # Cập nhật thông tin tôi
GET    /users/{user_id}         # Thông tin user
PUT    /users/{user_id}         # Cập nhật user
DELETE /users/{user_id}         # Xóa user
```

## 🏫 Majors (6 endpoints) 
```
GET    /majors/                 # Danh sách ngành học
POST   /majors/                 # Tạo ngành học
GET    /majors/{major_id}       # Thông tin ngành
PUT    /majors/{major_id}       # Cập nhật ngành
DELETE /majors/{major_id}       # Xóa ngành
GET    /majors/{major_id}/subjects # Môn học theo ngành
```

## 📅 Academic Years (6 endpoints)
```
GET    /academic-years/         # Danh sách năm học
POST   /academic-years/         # Tạo năm học
GET    /academic-years/{year_id} # Thông tin năm học
PUT    /academic-years/{year_id} # Cập nhật năm học  
DELETE /academic-years/{year_id} # Xóa năm học
GET    /academic-years/current  # Năm học hiện tại
```

## 📚 Subjects (6 endpoints)
```
GET    /subjects/               # Danh sách môn học
POST   /subjects/               # Tạo môn học
GET    /subjects/{subject_id}   # Thông tin môn học
PUT    /subjects/{subject_id}   # Cập nhật môn học
DELETE /subjects/{subject_id}   # Xóa môn học
GET    /subjects/academic-year/{year_id} # Môn học theo năm
```

## 📄 Documents (12 endpoints)
```
GET    /documents/              # Danh sách tài liệu
POST   /documents/              # Tải lên tài liệu
GET    /documents/{document_id} # Thông tin tài liệu
PUT    /documents/{document_id} # Cập nhật tài liệu
DELETE /documents/{document_id} # Xóa tài liệu
GET    /documents/{document_id}/download # Tải xuống
POST   /documents/{document_id}/view # Tăng view
GET    /documents/search        # Tìm kiếm
GET    /documents/my-documents  # Tài liệu của tôi
GET    /documents/pending       # Tài liệu chờ duyệt
POST   /documents/{document_id}/approve # Duyệt tài liệu
POST   /documents/{document_id}/reject # Từ chối tài liệu
```

## 🏷️ Tags (5 endpoints)
```
GET    /tags/                   # Danh sách tags
POST   /tags/                   # Tạo tag
GET    /tags/{tag_id}           # Thông tin tag
PUT    /tags/{tag_id}           # Cập nhật tag
DELETE /tags/{tag_id}           # Xóa tag
```

## 🏷️ Document Tags (3 endpoints)
```
GET    /documents/{document_id}/tags # Tags của tài liệu
POST   /documents/{document_id}/tags # Thêm tag
DELETE /documents/{document_id}/tags/{tag_id} # Xóa tag
```

## 💬 Comments (7 endpoints)
```
GET    /comments/               # Danh sách bình luận
POST   /comments/               # Tạo bình luận
GET    /comments/{comment_id}   # Thông tin bình luận
PUT    /comments/{comment_id}   # Cập nhật bình luận
DELETE /comments/{comment_id}   # Xóa bình luận
GET    /comments/document/{document_id} # Bình luận theo tài liệu
GET    /comments/{comment_id}/replies # Phản hồi bình luận
```

## ⭐ Ratings (7 endpoints)
```
GET    /ratings/                # Danh sách đánh giá
POST   /ratings/                # Tạo đánh giá
GET    /ratings/{rating_id}     # Thông tin đánh giá
PUT    /ratings/{rating_id}     # Cập nhật đánh giá
DELETE /ratings/{rating_id}     # Xóa đánh giá
GET    /ratings/document/{document_id} # Đánh giá theo tài liệu
GET    /ratings/my-rating/{document_id} # Đánh giá của tôi
```

## 📜 Document History (3 endpoints)
```
GET    /history/                # Lịch sử tài liệu
GET    /history/document/{document_id} # Lịch sử theo tài liệu
GET    /history/my-history      # Lịch sử của tôi
```

## 🔗 Shared Links (6 endpoints)
```
GET    /shared-links/           # Danh sách liên kết chia sẻ
POST   /shared-links/           # Tạo liên kết
GET    /shared-links/{link_id}  # Thông tin liên kết
PUT    /shared-links/{link_id}  # Cập nhật liên kết
DELETE /shared-links/{link_id}  # Xóa liên kết
GET    /shared-links/access/{token} # Truy cập qua liên kết
```

## 🔔 Notifications (7 endpoints)
```
GET    /notifications/          # Danh sách thông báo
POST   /notifications/          # Tạo thông báo
GET    /notifications/{notification_id} # Thông tin thông báo
PUT    /notifications/{notification_id} # Cập nhật thông báo
DELETE /notifications/{notification_id} # Xóa thông báo
GET    /notifications/my-notifications # Thông báo của tôi
POST   /notifications/{notification_id}/read # Đánh dấu đã đọc
```

## 🗣️ Forums (6 endpoints)
```
GET    /forums/                 # Danh sách diễn đàn
POST   /forums/                 # Tạo diễn đàn
GET    /forums/{forum_id}       # Thông tin diễn đàn
PUT    /forums/{forum_id}       # Cập nhật diễn đàn
DELETE /forums/{forum_id}       # Xóa diễn đàn
GET    /forums/subject/{subject_id} # Diễn đàn theo môn học
```

## 📝 Forum Posts (7 endpoints)
```
GET    /forum-posts/            # Danh sách bài viết
POST   /forum-posts/            # Tạo bài viết
GET    /forum-posts/{post_id}   # Thông tin bài viết
PUT    /forum-posts/{post_id}   # Cập nhật bài viết
DELETE /forum-posts/{post_id}   # Xóa bài viết
GET    /forum-posts/forum/{forum_id} # Bài viết theo diễn đàn
GET    /forum-posts/my-posts    # Bài viết của tôi
```

## 💭 Forum Replies (6 endpoints)
```
GET    /forum-replies/          # Danh sách phản hồi
POST   /forum-replies/          # Tạo phản hồi
GET    /forum-replies/{reply_id} # Thông tin phản hồi
PUT    /forum-replies/{reply_id} # Cập nhật phản hồi
DELETE /forum-replies/{reply_id} # Xóa phản hồi
GET    /forum-replies/post/{post_id} # Phản hồi theo bài viết
```

## 📊 Statistics (16 endpoints) - **MỚI NHẤT** ⭐
```
GET    /statistics/overview                            # Thống kê tổng quan
GET    /statistics/documents/by-status                 # Tài liệu theo trạng thái
GET    /statistics/documents/by-subject                # Tài liệu theo môn học
GET    /statistics/documents/by-major                  # Tài liệu theo ngành
GET    /statistics/documents/by-file-type              # Tài liệu theo loại file
GET    /statistics/documents/most-viewed               # Tài liệu xem nhiều nhất
GET    /statistics/documents/most-downloaded           # Tài liệu tải nhiều nhất
GET    /statistics/documents/highest-rated             # Tài liệu đánh giá cao nhất
GET    /statistics/users/most-active                   # Người dùng tích cực nhất
GET    /statistics/activity/by-time                    # Hoạt động theo thời gian
GET    /statistics/storage/usage                       # Dung lượng lưu trữ (Admin)
GET    /statistics/engagement/rating-distribution      # Phân bố điểm đánh giá
GET    /statistics/forum/activity                      # Hoạt động diễn đàn
GET    /statistics/trends/document-engagement          # Xu hướng tương tác
GET    /statistics/subjects/performance                # Hiệu suất môn học
GET    /statistics/quality/content-analysis            # Phân tích chất lượng
```

---

## 📋 Tóm tắt thống kê

| Module | Số endpoints | Ghi chú |
|--------|-------------|---------|
| Authentication | 7 | JWT + Google OAuth |
| Users | 7 | CRUD + profile |
| Majors | 6 | Quản lý ngành học |
| Academic Years | 6 | Quản lý năm học |
| Subjects | 6 | Quản lý môn học |
| Documents | 12 | Upload, download, approval |
| Tags | 5 | Tag management |
| Document Tags | 3 | Tag assignment |
| Comments | 7 | Comments + replies |
| Ratings | 7 | Rating system |
| Document History | 3 | View history |
| Shared Links | 6 | Document sharing |
| Notifications | 7 | Real-time notifications |
| Forums | 6 | Discussion forums |
| Forum Posts | 7 | Forum content |
| Forum Replies | 6 | Post replies |
| **Statistics** | **16** | **Advanced analytics** |
| **TỔNG CỘNG** | **105** | **Complete API** |

## 🔑 Authentication Methods

- **JWT Token**: Bearer token cho user authentication
- **Google OAuth**: Đăng nhập qua Google
- **Role-based**: Admin, Teacher, Student permissions

## 📖 Documentation Links

- **Main API Docs**: `/docs/api/Readme.md`
- **Statistics API**: `/docs/api/Statistics-API.md`  
- **Swagger UI**: `http://localhost:8021/docs`
- **ReDoc**: `http://localhost:8021/redoc`

---

*Cập nhật lần cuối: Tháng 1, 2025 - Thêm Statistics API với 16 endpoints mới* 