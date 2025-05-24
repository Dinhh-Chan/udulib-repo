-- 1. Chèn dữ liệu vào bảng academic_years
INSERT INTO academic_years (year_name, year_order) VALUES
('Năm 1', 1),
('Năm 2', 2),
('Năm 3', 3),
('Năm 4', 4),
('Năm 5', 5);

-- 2. Chèn dữ liệu vào bảng majors
INSERT INTO majors (major_name, major_code, description) VALUES
('Công nghệ Thông tin', 'CNTT001', 'Chương trình đào tạo về phát triển phần mềm và hệ thống thông tin'),
('Kỹ thuật Điện', 'KTĐ001', 'Chương trình đào tạo về kỹ thuật điện và điện tử'),
('Quản trị Kinh doanh', 'QTKD001', 'Chương trình đào tạo về quản trị và kinh doanh'),
('Kỹ thuật Cơ khí', 'KTC001', 'Chương trình đào tạo về thiết kế và chế tạo máy'),
('Khoa học Dữ liệu', 'KHDL001', 'Chương trình đào tạo về phân tích và xử lý dữ liệu');

-- 3. Chèn dữ liệu vào bảng users
INSERT INTO users (username, email, password_hash, full_name, role, status, university_id) VALUES
('nguyenvana', 'nguyen.van.a@university.edu.vn', '$2a$10$hashedpassword1', 'Nguyễn Văn An', 'student', 'active', 'SV001'),
('tranb', 'tran.thi.b@university.edu.vn', '$2a$10$hashedpassword2', 'Trần Thị Bình', 'student', 'active', 'SV002'),
('leminhc', 'le.minh.c@university.edu.vn', '$2a$10$hashedpassword3', 'Lê Minh Châu', 'student', 'pending', 'SV003'),
('phamd', 'pham.van.d@university.edu.vn', '$2a$10$hashedpassword4', 'Phạm Văn Đức', 'student', 'active', 'SV004'),
('hoangt', 'hoang.thi.t@university.edu.vn', '$2a$10$hashedpassword5', 'Hoàng Thị Thảo', 'student', 'active', 'SV005'),
('gv_nguyen', 'nguyen.gv@university.edu.vn', '$2a$10$hashedpassword6', 'TS. Nguyễn Văn Hùng', 'lecturer', 'active', 'GV001'),
('gv_tran', 'tran.gv@university.edu.vn', '$2a$10$hashedpassword7', 'PGS. Trần Thị Lan', 'lecturer', 'active', 'GV002'),
('admin_01', 'admin01@university.edu.vn', '$2a$10$hashedpassword8', 'Quản trị viên 01', 'admin', 'active', 'QT001'),
('admin_02', 'admin02@university.edu.vn', '$2a$10$hashedpassword9', 'Quản trị viên 02', 'admin', 'active', 'QT002'),
('nguyent', 'nguyen.thanh.t@university.edu.vn', '$2a$10$hashedpassword10', 'Nguyễn Thanh Tùng', 'student', 'active', 'SV006');

-- 4. Chèn dữ liệu vào bảng subjects
INSERT INTO subjects (subject_name, subject_code, description, major_id, year_id) VALUES
('Lập trình Cơ bản', 'CNTT101', 'Giới thiệu về lập trình với Python', 1, 1),
('Cấu trúc Dữ liệu', 'CNTT201', 'Cấu trúc dữ liệu và thuật toán', 1, 2),
('Hệ điều hành', 'CNTT301', 'Cơ bản về hệ điều hành', 1, 3),
('Mạch Điện', 'KTĐ101', 'Cơ bản về mạch điện', 2, 1),
('Điện tử Công suất', 'KTĐ201', 'Ứng dụng điện tử công suất', 2, 2),
('Quản trị Doanh nghiệp', 'QTKD101', 'Nguyên lý quản trị doanh nghiệp', 3, 1),
('Kế toán Cơ bản', 'QTKD201', 'Kiến thức cơ bản về kế toán', 3, 2),
('Thiết kế Cơ khí', 'KTC101', 'Cơ bản về thiết kế cơ khí', 4, 1),
('Cơ học Kỹ thuật', 'KTC201', 'Nguyên lý cơ học trong kỹ thuật', 4, 2),
('Khoa học Dữ liệu Cơ bản', 'KHDL101', 'Giới thiệu về khoa học dữ liệu', 5, 1);

-- 5. Chèn dữ liệu vào bảng documents
INSERT INTO documents (title, description, file_path, file_size, file_type, subject_id, user_id, status, view_count, download_count) VALUES
('Tài liệu Lập trình Python', 'Tài liệu chi tiết về Python', '/uploads/python_101.pdf', 2048000, 'application/pdf', 1, 1, 'approved', 15, 8),
('Ghi chú Cấu trúc Dữ liệu', 'Hướng dẫn về danh sách liên kết và cây nhị phân', '/uploads/ds_notes.pdf', 5242880, 'application/pdf', 2, 2, 'pending', 3, 1),
('Bài tập Mạch Điện', 'Bài tập thực hành mạch điện', '/uploads/circuit_exercises.pdf', 1048576, 'application/pdf', 4, 3, 'approved', 12, 6),
('Quản trị Doanh nghiệp 101', 'Tài liệu về quản trị doanh nghiệp', '/uploads/business_101.pdf', 3145728, 'application/pdf', 6, 4, 'approved', 10, 4),
('Hướng dẫn Thiết kế Cơ khí', 'Hướng dẫn sử dụng AutoCAD', '/uploads/mechanical_design.pdf', 4194304, 'application/pdf', 8, 5, 'pending', 5, 2),
('Giới thiệu Khoa học Dữ liệu', 'Tài liệu cơ bản về khoa học dữ liệu', '/uploads/data_science_101.pdf', 2097152, 'application/pdf', 10, 1, 'approved', 20, 10),
('Hệ điều hành Linux', 'Tài liệu về hệ điều hành Linux', '/uploads/linux_os.pdf', 2621440, 'application/pdf', 3, 2, 'rejected', 2, 0),
('Điện tử Công suất Bài tập', 'Bài tập thực hành điện tử công suất', '/uploads/power_electronics.pdf', 1572864, 'application/pdf', 5, 3, 'approved', 8, 3);

-- 6. Chèn dữ liệu vào bảng tags
INSERT INTO tags (tag_name) VALUES
('lập trình'),
('python'),
('cấu trúc dữ liệu'),
('mạch điện'),
('quản trị'),
('cơ khí'),
('khoa học dữ liệu'),
('hệ điều hành'),
('điện tử'),
('kế toán');

-- 7. Chèn dữ liệu vào bảng document_tags
INSERT INTO document_tags (document_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 1),
(3, 4), (3, 9),
(4, 5), (4, 10),
(5, 6), (6, 7),
(7, 8), (8, 9);

-- 8. Chèn dữ liệu vào bảng comments
INSERT INTO comments (document_id, user_id, content, status) VALUES
(1, 2, 'Tài liệu rất chi tiết và dễ hiểu!', 'approved'),
(1, 3, 'Có thể bổ sung thêm ví dụ về vòng lặp?', 'approved'),
(3, 4, 'Bài tập này rất hữu ích cho kỳ thi', 'approved'),
(4, 5, 'Cần thêm thông tin về chiến lược kinh doanh', 'pending'),
(6, 1, 'Rất hay, đặc biệt là phần xử lý dữ liệu', 'approved'),
(3, 2, 'Cần giải thích thêm về mạch song song', 'approved'),
(1, 4, 'Cảm ơn vì tài liệu này!', 'approved');

-- 9. Chèn dữ liệu vào bảng ratings
INSERT INTO ratings (document_id, user_id, score) VALUES
(1, 2, 4),
(1, 3, 3),
(3, 4, 5),
(4, 5, 4),
(6, 1, 5),
(3, 2, 4),
(1, 4, 5),
(6, 3, 3);

-- 10. Chèn dữ liệu vào bảng document_history
INSERT INTO document_history (document_id, user_id, action) VALUES
(1, 2, 'view'),
(1, 3, 'download'),
(3, 4, 'view'),
(4, 5, 'download'),
(6, 1, 'view'),
(3, 2, 'download'),
(1, 4, 'view'),
(6, 3, 'download'),
(2, 1, 'view'),
(5, 2, 'view');

-- 11. Chèn dữ liệu vào bảng shared_links
INSERT INTO shared_links (document_id, user_id, share_token, expiration_date) VALUES
(1, 1, uuid_generate_v4(), '2025-12-31 23:59:59'),
(3, 3, uuid_generate_v4(), '2025-11-30 23:59:59'),
(4, 4, uuid_generate_v4(), '2025-10-31 23:59:59'),
(6, 1, uuid_generate_v4(), NULL),
(3, 2, uuid_generate_v4(), '2025-09-30 23:59:59');

-- 12. Chèn dữ liệu vào bảng forums
INSERT INTO forums (subject_id) VALUES
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

-- 13. Chèn dữ liệu vào bảng forum_posts
INSERT INTO forum_posts (forum_id, user_id, title, content, status) VALUES
(1, 1, 'Hỏi về vòng lặp trong Python', 'Làm thế nào để tối ưu vòng lặp for trong Python?', 'approved'),
(2, 2, 'Cây nhị phân cân bằng', 'Cần tài liệu về cây nhị phân cân bằng', 'pending'),
(3, 3, 'Hỏi về hệ điều hành Linux', 'Làm sao để cài đặt Linux trên máy ảo?', 'approved'),
(4, 4, 'Phân tích mạch điện', 'Cách tính điện trở song song?', 'approved'),
(6, 5, 'Chiến lược kinh doanh', 'Cần tài liệu về chiến lược kinh doanh số', 'approved'),
(8, 1, 'Hướng dẫn AutoCAD', 'Làm thế nào để vẽ 3D trong AutoCAD?', 'pending'),
(10, 2, 'Xử lý dữ liệu lớn', 'Cách xử lý dữ liệu lớn với Python?', 'approved');

-- 14. Chèn dữ liệu vào bảng forum_replies
INSERT INTO forum_replies (post_id, user_id, content, status) VALUES
(1, 6, 'Sử dụng list comprehension để tối ưu vòng lặp.', 'approved'),
(3, 7, 'Bạn có thể dùng VirtualBox để cài Linux.', 'approved'),
(4, 6, 'Dùng công thức 1/Rt = 1/R1 + 1/R2.', 'approved'),
(6, 4, 'Bạn nên đọc về chiến lược 4Ps.', 'approved'),
(10, 3, 'Dùng thư viện Pandas để xử lý dữ liệu lớn.', 'pending');

-- 15. Chèn dữ liệu vào bảng notifications
INSERT INTO notifications (user_id, title, content, is_read, type, reference_id) VALUES
(1, 'Bình luận mới', 'Tài liệu của bạn nhận được bình luận mới', FALSE, 'comment', 1),
(2, 'Tài liệu được duyệt', 'Tài liệu của bạn đã được duyệt', TRUE, 'document', 1),
(3, 'Phản hồi diễn đàn', 'Bài đăng của bạn có phản hồi mới', FALSE, 'forum_reply', 3),
(4, 'Tài liệu được tải xuống', 'Tài liệu của bạn đã được tải xuống', FALSE, 'document', 3),
(5, 'Bình luận mới', 'Tài liệu của bạn nhận được bình luận', TRUE, 'comment', 4),
(1, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá mới', FALSE, 'rating', 1),
(2, 'Diễn đàn mới', 'Diễn đàn bạn theo dõi có bài đăng mới', FALSE, 'forum_post', 2);

-- 16. Chèn dữ liệu vào bảng system_config
INSERT INTO system_config (config_key, config_value, description) VALUES
('max_file_size', '10485760', 'Kích thước tệp tối đa (10MB)'),
('allowed_file_types', 'pdf,doc,docx', 'Các loại tệp được phép tải lên'),
('default_document_status', 'pending', 'Trạng thái mặc định cho tài liệu mới'),
('notification_retention_days', '30', 'Số ngày lưu trữ thông báo'),
('max_comments_per_document', '100', 'Số bình luận tối đa cho mỗi tài liệu');