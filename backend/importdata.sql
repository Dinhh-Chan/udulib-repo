DO $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN
        SELECT c.relname as sequence_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'S'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq.sequence_name) || ' RESTART WITH 1';
    END LOOP;
END
$$;


INSERT INTO academic_years (year_name, year_order, created_at, updated_at) VALUES
('2020-2021', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2021-2022', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2022-2023', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2023-2024', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2024-2025', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO majors (major_name, major_code, description, created_at, updated_at) VALUES
('Công nghệ thông tin', 'CNTT01', 'Ngành học về phát triển phần mềm và hệ thống thông tin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật phần mềm', 'KTPM01', 'Tập trung vào quy trình phát triển phần mềm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Khoa học máy tính', 'KHMT01', 'Nghiên cứu lý thuyết và thuật toán máy tính', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật điện', 'KTĐ01', 'Ngành học về thiết kế hệ thống điện', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật cơ khí', 'CK01', 'Thiết kế và chế tạo máy móc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kinh tế', 'KT01', 'Nghiên cứu kinh tế và quản lý tài chính', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quản trị kinh doanh', 'QTKD01', 'Quản lý doanh nghiệp và chiến lược kinh doanh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing', 'MKT01', 'Nghiên cứu thị trường và chiến lược tiếp thị', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kế toán', 'KT02', 'Quản lý tài chính và kiểm toán', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Luật', 'LUAT01', 'Nghiên cứu pháp luật và tư pháp', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ngôn ngữ Anh', 'NNA01', 'Học ngôn ngữ và văn hóa Anh', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sư phạm Toán', 'SPT01', 'Đào tạo giáo viên Toán học', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sư phạm Văn', 'SPV01', 'Đào tạo giáo viên Ngữ văn', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hóa học', 'HH01', 'Nghiên cứu hóa học và ứng dụng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vật lý', 'VL01', 'Nghiên cứu vật lý lý thuyết và ứng dụng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sinh học', 'SH01', 'Nghiên cứu sinh vật và hệ sinh thái', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Y học', 'Y01', 'Đào tạo bác sĩ và chăm sóc sức khỏe', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dược học', 'D01', 'Nghiên cứu và sản xuất dược phẩm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Điều dưỡng', 'DD01', 'Đào tạo điều dưỡng viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kiến trúc', 'KT03', 'Thiết kế công trình và quy hoạch đô thị', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Xây dựng', 'XD01', 'Kỹ thuật xây dựng công trình', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Công nghệ thực phẩm', 'CNTP01', 'Nghiên cứu chế biến thực phẩm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Công nghệ sinh học', 'CNSH01', 'Ứng dụng sinh học trong công nghệ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Môi trường', 'MT01', 'Nghiên cứu bảo vệ môi trường', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hóa dầu', 'HD01', 'Nghiên cứu dầu mỏ và hóa chất', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Logistics', 'LOG01', 'Quản lý chuỗi cung ứng và vận tải', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Du lịch', 'DL01', 'Quản lý du lịch và lữ hành', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tâm lý học', 'TLH01', 'Nghiên cứu hành vi và tâm lý con người', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Xã hội học', 'XHH01', 'Nghiên cứu xã hội và văn hóa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Truyền thông', 'TT01', 'Nghiên cứu truyền thông và báo chí', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO users (username, email, password_hash, full_name, role, status, university_id, created_at, updated_at, last_login) VALUES
('sv001', 'sv001@uni.edu.vn', 'hash123', 'Nguyễn Văn An', 'student', 'active', 'SV001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv002', 'sv002@uni.edu.vn', 'hash123', 'Trần Thị Bình', 'student', 'active', 'SV002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv003', 'sv003@uni.edu.vn', 'hash123', 'Lê Minh Châu', 'student', 'active', 'SV003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv004', 'sv004@uni.edu.vn', 'hash123', 'Phạm Quốc Dũng', 'student', 'active', 'SV004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv005', 'sv005@uni.edu.vn', 'hash123', 'Hoàng Thị Em', 'student', 'active', 'SV005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv006', 'sv006@uni.edu.vn', 'hash123', 'Đỗ Văn Phú', 'student', 'active', 'SV006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv007', 'sv007@uni.edu.vn', 'hash123', 'Vũ Thị Giang', 'student', 'active', 'SV007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv008', 'sv008@uni.edu.vn', 'hash123', 'Bùi Minh Hùng', 'student', 'active', 'SV008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv009', 'sv009@uni.edu.vn', 'hash123', 'Ngô Thị Hồng', 'student', 'active', 'SV009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv010', 'sv010@uni.edu.vn', 'hash123', 'Lý Văn Khánh', 'student', 'active', 'SV010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('gv001', 'gv001@uni.edu.vn', 'hash123', 'TS. Nguyễn Văn Hùng', 'lecturer', 'active', 'GV001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('gv002', 'gv002@uni.edu.vn', 'hash123', 'PGS. Trần Thị Lan', 'lecturer', 'active', 'GV002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('gv003', 'gv003@uni.edu.vn', 'hash123', 'TS. Lê Minh Tuấn', 'lecturer', 'active', 'GV003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('gv004', 'gv004@uni.edu.vn', 'hash123', 'TS. Phạm Thị Mai', 'lecturer', 'active', 'GV004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('gv005', 'gv005@uni.edu.vn', 'hash123', 'PGS. Hoàng Văn Long', 'lecturer', 'active', 'GV005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('admin001', 'admin001@uni.edu.vn', 'hash123', 'Nguyễn Thị Quản Trị', 'admin', 'active', 'AD001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv011', 'sv011@uni.edu.vn', 'hash123', 'Trần Văn Nam', 'student', 'active', 'SV011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv012', 'sv012@uni.edu.vn', 'hash123', 'Lê Thị Oanh', 'student', 'active', 'SV012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv013', 'sv013@uni.edu.vn', 'hash123', 'Phạm Văn Phong', 'student', 'active', 'SV013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv014', 'sv014@uni.edu.vn', 'hash123', 'Hoàng Thị Quyên', 'student', 'active', 'SV014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv015', 'sv015@uni.edu.vn', 'hash123', 'Đỗ Minh Sơn', 'student', 'active', 'SV015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv016', 'sv016@uni.edu.vn', 'hash123', 'Vũ Thị Thảo', 'student', 'active', 'SV016', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv017', 'sv017@uni.edu.vn', 'hash123', 'Bùi Văn Tâm', 'student', 'active', 'SV017', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv018', 'sv018@uni.edu.vn', 'hash123', 'Ngô Thị Uyên', 'student', 'active', 'SV018', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv019', 'sv019@uni.edu.vn', 'hash123', 'Lý Văn Vinh', 'student', 'active', 'SV019', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv020', 'sv020@uni.edu.vn', 'hash123', 'Nguyễn Thị Xuân', 'student', 'active', 'SV020', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv021', 'sv021@uni.edu.vn', 'hash123', 'Trần Văn Ý', 'student', 'active', 'SV021', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv022', 'sv022@uni.edu.vn', 'hash123', 'Lê Thị Ánh', 'student', 'active', 'SV022', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv023', 'sv023@uni.edu.vn', 'hash123', 'Phạm Văn Bảo', 'student', 'active', 'SV023', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('sv024', 'sv024@uni.edu.vn', 'hash123', 'Hoàng Thị Cúc', 'student', 'active', 'SV024', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);


INSERT INTO subjects (subject_name, subject_code, description, major_id, year_id, created_at, updated_at) VALUES
('Lập trình cơ bản', 'LTCB01', 'Giới thiệu lập trình với C', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cấu trúc dữ liệu', 'CTDL01', 'Cấu trúc dữ liệu và thuật toán', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hệ điều hành', 'HDH01', 'Nguyên lý hệ điều hành', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật phần mềm', 'KTPM02', 'Quy trình phát triển phần mềm', 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế giao diện', 'TKGD01', 'Thiết kế giao diện người dùng', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Trí tuệ nhân tạo', 'TTNT01', 'Giới thiệu về AI', 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Điện tử cơ bản', 'DTCB01', 'Nguyên lý mạch điện', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Điện tử công suất', 'DTCS01', 'Ứng dụng điện tử công suất', 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cơ học kỹ thuật', 'CHKT01', 'Cơ học vật rắn', 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế máy', 'TKM01', 'Thiết kế máy móc cơ khí', 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kinh tế vi mô', 'KTV01', 'Nguyên lý kinh tế vi mô', 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kinh tế vĩ mô', 'KTV02', 'Nguyên lý kinh tế vĩ mô', 6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quản trị chiến lược', 'QTC01', 'Lập kế hoạch chiến lược doanh nghiệp', 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing căn bản', 'MKT02', 'Giới thiệu marketing', 8, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nghiên cứu thị trường', 'NCTT01', 'Phương pháp nghiên cứu thị trường', 8, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kế toán tài chính', 'KTT01', 'Nguyên lý kế toán tài chính', 9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Luật dân sự', 'LDS01', 'Cơ sở pháp luật dân sự', 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Luật thương mại', 'LTM01', 'Pháp luật thương mại', 10, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Anh văn 1', 'AV01', 'Tiếng Anh cơ bản', 11, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Anh văn chuyên ngành', 'AVCN01', 'Tiếng Anh cho ngành CNTT', 11, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phương pháp giảng dạy Toán', 'PPGDT01', 'Phương pháp dạy học Toán', 12, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phương pháp giảng dạy Văn', 'PPGDV01', 'Phương pháp dạy học Văn', 13, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hóa hữu cơ', 'HHC01', 'Hóa học hữu cơ cơ bản', 14, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vật lý đại cương', 'VLD01', 'Vật lý cơ bản', 15, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sinh học phân tử', 'SHPT01', 'Sinh học ở cấp độ phân tử', 16, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Giải phẫu học', 'GPH01', 'Cơ sở giải phẫu cơ thể người', 17, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dược lý học', 'DLH01', 'Nghiên cứu tác dụng của thuốc', 18, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chăm sóc bệnh nhân', 'CSBN01', 'Kỹ năng chăm sóc bệnh nhân', 19, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế kiến trúc', 'TKT01', 'Nguyên lý thiết kế kiến trúc', 20, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật xây dựng', 'KTXD01', 'Kỹ thuật thi công công trình', 21, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO documents (title, description, file_path, file_size, file_type, subject_id, user_id, status, view_count, download_count, created_at, updated_at) VALUES
('Bài giảng Lập trình C', 'Tài liệu bài giảng lập trình C cơ bản', '/files/ltcb01.pdf', 2048000, 'pdf', 1, 1, 'approved', 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cấu trúc dữ liệu và thuật toán', 'Tài liệu về cấu trúc dữ liệu', '/files/ctdl01.pdf', 3072000, 'pdf', 2, 2, 'approved', 15, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hệ điều hành Linux', 'Hướng dẫn sử dụng Linux', '/files/hdh01.pdf', 4096000, 'pdf', 3, 3, 'approved', 20, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quy trình phát triển phần mềm', 'Tài liệu kỹ thuật phần mềm', '/files/ktpm02.pdf', 2560000, 'pdf', 4, 4, 'approved', 12, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế UI/UX', 'Hướng dẫn thiết kế giao diện', '/files/tkgd01.pdf', 3584000, 'pdf', 5, 5, 'approved', 18, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Giới thiệu AI', 'Tài liệu cơ bản về trí tuệ nhân tạo', '/files/ttnt01.pdf', 5120000, 'pdf', 6, 6, 'approved', 25, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mạch điện tử cơ bản', 'Tài liệu về mạch điện', '/files/dtcb01.pdf', 2048000, 'pdf', 7, 7, 'approved', 10, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Điện tử công suất', 'Ứng dụng điện tử công suất', '/files/dtcs01.pdf', 3072000, 'pdf', 8, 8, 'approved', 15, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cơ học vật rắn', 'Tài liệu cơ học kỹ thuật', '/files/chkt01.pdf', 2560000, 'pdf', 9, 9, 'approved', 12, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế máy móc', 'Hướng dẫn thiết kế máy', '/files/tkm01.pdf', 4096000, 'pdf', 10, 10, 'approved', 20, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kinh tế vi mô cơ bản', 'Tài liệu kinh tế vi mô', '/files/ktv01.pdf', 2048000, 'pdf', 11, 11, 'approved', 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kinh tế vĩ mô nâng cao', 'Tài liệu kinh tế vĩ mô', '/files/ktv02.pdf', 3072000, 'pdf', 12, 12, 'approved', 15, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chiến lược doanh nghiệp', 'Tài liệu quản trị chiến lược', '/files/qtc01.pdf', 2560000, 'pdf', 13, 13, 'approved', 12, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing căn bản', 'Giới thiệu marketing', '/files/mkt02.pdf', 3584000, 'pdf', 14, 14, 'approved', 18, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nghiên cứu thị trường', 'Phương pháp nghiên cứu thị trường', '/files/nctt01.pdf', 5120000, 'pdf', 15, 15, 'approved', 25, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kế toán tài chính', 'Nguyên lý kế toán', '/files/ktt01.pdf', 2048000, 'pdf', 16, 16, 'approved', 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Luật dân sự cơ bản', 'Tài liệu luật dân sự', '/files/lds01.pdf', 3072000, 'pdf', 17, 17, 'approved', 15, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Luật thương mại', 'Pháp luật thương mại', '/files/ltm01.pdf', 2560000, 'pdf', 18, 18, 'approved', 12, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Anh văn cơ bản', 'Tài liệu tiếng Anh', '/files/av01.pdf', 3584000, 'pdf', 19, 19, 'approved', 18, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Anh văn CNTT', 'Tiếng Anh chuyên ngành CNTT', '/files/avcn01.pdf', 5120000, 'pdf', 20, 20, 'approved', 25, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phương pháp dạy Toán', 'Tài liệu giảng dạy Toán', '/files/ppgdt01.pdf', 2048000, 'pdf', 21, 21, 'approved', 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phương pháp dạy Văn', 'Tài liệu giảng dạy Văn', '/files/ppgdv01.pdf', 3072000, 'pdf', 22, 22, 'approved', 15, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hóa hữu cơ cơ bản', 'Tài liệu hóa hữu cơ', '/files/hhc01.pdf', 2560000, 'pdf', 23, 23, 'approved', 12, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vật lý đại cương', 'Tài liệu vật lý cơ bản', '/files/vld01.pdf', 3584000, 'pdf', 24, 24, 'approved', 18, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sinh học phân tử', 'Tài liệu sinh học phân tử', '/files/shpt01.pdf', 5120000, 'pdf', 25, 25, 'approved', 25, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Giải phẫu học', 'Tài liệu giải phẫu', '/files/gph01.pdf', 2048000, 'pdf', 26, 26, 'approved', 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dược lý học', 'Tài liệu dược lý', '/files/dlh01.pdf', 3072000, 'pdf', 27, 27, 'approved', 15, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chăm sóc bệnh nhân', 'Tài liệu chăm sóc bệnh nhân', '/files/csbn01.pdf', 2560000, 'pdf', 28, 28, 'approved', 12, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thiết kế kiến trúc', 'Tài liệu thiết kế kiến trúc', '/files/tkt01.pdf', 3584000, 'pdf', 29, 29, 'approved', 18, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kỹ thuật xây dựng', 'Tài liệu kỹ thuật xây dựng', '/files/ktxd01.pdf', 5120000, 'pdf', 30, 30, 'approved', 25, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO tags (tag_name, created_at) VALUES
('bài giảng', CURRENT_TIMESTAMP),
('bài tập', CURRENT_TIMESTAMP),
('lý thuyết', CURRENT_TIMESTAMP),
('thực hành', CURRENT_TIMESTAMP),
('đề thi', CURRENT_TIMESTAMP),
('tài liệu tham khảo', CURRENT_TIMESTAMP),
('hướng dẫn', CURRENT_TIMESTAMP),
('báo cáo', CURRENT_TIMESTAMP),
('đồ án', CURRENT_TIMESTAMP),
('luận văn', CURRENT_TIMESTAMP),
('cơ bản', CURRENT_TIMESTAMP),
('nâng cao', CURRENT_TIMESTAMP),
('chuyên ngành', CURRENT_TIMESTAMP),
('kỹ thuật', CURRENT_TIMESTAMP),
('nghiên cứu', CURRENT_TIMESTAMP),
('thống kê', CURRENT_TIMESTAMP),
('phân tích', CURRENT_TIMESTAMP),
('thiết kế', CURRENT_TIMESTAMP),
('lập trình', CURRENT_TIMESTAMP),
('mạng máy tính', CURRENT_TIMESTAMP),
('cơ khí', CURRENT_TIMESTAMP),
('điện tử', CURRENT_TIMESTAMP),
('kinh tế', CURRENT_TIMESTAMP),
('marketing', CURRENT_TIMESTAMP),
('luật', CURRENT_TIMESTAMP),
('tiếng Anh', CURRENT_TIMESTAMP),
('giáo dục', CURRENT_TIMESTAMP),
('hóa học', CURRENT_TIMESTAMP),
('vật lý', CURRENT_TIMESTAMP),
('y học', CURRENT_TIMESTAMP);


INSERT INTO document_tags (document_id, tag_id, created_at) VALUES
(1, 1, CURRENT_TIMESTAMP), -- Bài giảng Lập trình C - bài giảng
(1, 19, CURRENT_TIMESTAMP), -- Bài giảng Lập trình C - lập trình
(2, 2, CURRENT_TIMESTAMP), -- Cấu trúc dữ liệu và thuật toán - bài tập
(2, 3, CURRENT_TIMESTAMP), -- Cấu trúc dữ liệu và thuật toán - lý thuyết
(3, 3, CURRENT_TIMESTAMP), -- Hệ điều hành Linux - lý thuyết
(3, 20, CURRENT_TIMESTAMP), -- Hệ điều hành Linux - mạng máy tính
(4, 1, CURRENT_TIMESTAMP), -- Quy trình phát triển phần mềm - bài giảng
(4, 13, CURRENT_TIMESTAMP), -- Quy trình phát triển phần mềm - chuyên ngành
(5, 18, CURRENT_TIMESTAMP), -- Thiết kế UI/UX - thiết kế
(5, 7, CURRENT_TIMESTAMP), -- Thiết kế UI/UX - hướng dẫn
(6, 3, CURRENT_TIMESTAMP), -- Giới thiệu AI - lý thuyết
(6, 15, CURRENT_TIMESTAMP), -- Giới thiệu AI - nghiên cứu
(7, 1, CURRENT_TIMESTAMP), -- Mạch điện tử cơ bản - bài giảng
(7, 22, CURRENT_TIMESTAMP), -- Mạch điện tử cơ bản - điện tử
(8, 3, CURRENT_TIMESTAMP), -- Điện tử công suất - lý thuyết
(8, 22, CURRENT_TIMESTAMP), -- Điện tử công suất - điện tử
(9, 3, CURRENT_TIMESTAMP), -- Cơ học vật rắn - lý thuyết
(9, 21, CURRENT_TIMESTAMP), -- Cơ học vật rắn - cơ khí
(10, 18, CURRENT_TIMESTAMP), -- Thiết kế máy móc - thiết kế
(10, 21, CURRENT_TIMESTAMP), -- Thiết kế máy móc - cơ khí
(11, 1, CURRENT_TIMESTAMP), -- Kinh tế vi mô cơ bản - bài giảng
(11, 23, CURRENT_TIMESTAMP), -- Kinh tế vi mô cơ bản - kinh tế
(12, 3, CURRENT_TIMESTAMP), -- Kinh tế vĩ mô nâng cao - lý thuyết
(12, 23, CURRENT_TIMESTAMP), -- Kinh tế vĩ mô nâng cao - kinh tế
(13, 1, CURRENT_TIMESTAMP), -- Chiến lược doanh nghiệp - bài giảng
(13, 24, CURRENT_TIMESTAMP), -- Chiến lược doanh nghiệp - marketing
(14, 1, CURRENT_TIMESTAMP), -- Marketing căn bản - bài giảng
(14, 24, CURRENT_TIMESTAMP), -- Marketing căn bản - marketing
(15, 15, CURRENT_TIMESTAMP), -- Nghiên cứu thị trường - nghiên cứu
(15, 24, CURRENT_TIMESTAMP); -- Nghiên cứu thị trường - marketing


INSERT INTO comments (document_id, user_id, content, status, created_at, updated_at) VALUES
(1, 1, 'Tài liệu rất chi tiết, dễ hiểu!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'Cần thêm ví dụ thực hành.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 'Rất hữu ích cho môn Cấu trúc dữ liệu.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 4, 'Cảm ơn bạn đã chia sẻ!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 5, 'Tài liệu Linux này rất hay.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 'Có thể bổ sung phần cấu hình server không?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 7, 'Tài liệu tốt, cần thêm case study.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 8, 'Rất phù hợp với môn Kỹ thuật phần mềm.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 9, 'Hướng dẫn thiết kế giao diện rất thực tế.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 10, 'Cảm ơn tác giả!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 11, 'Tài liệu AI dễ hiểu cho người mới.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 12, 'Cần thêm phần về machine learning.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 13, 'Tài liệu mạch điện rất chi tiết.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 14, 'Hữu ích cho môn Điện tử cơ bản.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 15, 'Tài liệu điện tử công suất rất hay.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 16, 'Cần thêm ví dụ ứng dụng.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 17, 'Cơ học vật rắn được giải thích rõ ràng.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 18, 'Cảm ơn người upload!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 19, 'Tài liệu thiết kế máy rất hữu ích.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 20, 'Rất tốt cho môn Thiết kế máy.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 21, 'Kinh tế vi mô được trình bày dễ hiểu.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 22, 'Cần thêm bài tập ứng dụng.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 23, 'Tài liệu kinh tế vĩ mô rất chi tiết.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 24, 'Hữu ích cho sinh viên kinh tế.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 25, 'Tài liệu quản trị chiến lược rất hay.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 26, 'Cảm ơn tác giả đã chia sẻ!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 27, 'Marketing căn bản được trình bày rõ.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 28, 'Rất hữu ích cho môn Marketing.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 29, 'Nghiên cứu thị trường rất thực tế.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 30, 'Cần thêm ví dụ thực tiễn.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO ratings (document_id, user_id, score, created_at, updated_at) VALUES
(1, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 5, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 8, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 9, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 11, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 12, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 13, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 14, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 15, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 16, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 17, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 18, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 19, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 20, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 21, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 22, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 23, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 24, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 25, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 26, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 27, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 28, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 29, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 30, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO document_history (document_id, user_id, action, created_at) VALUES
(1, 1, 'view', CURRENT_TIMESTAMP),
(1, 2, 'download', CURRENT_TIMESTAMP),
(2, 3, 'view', CURRENT_TIMESTAMP),
(2, 4, 'download', CURRENT_TIMESTAMP),
(3, 5, 'view', CURRENT_TIMESTAMP),
(3, 6, 'download', CURRENT_TIMESTAMP),
(4, 7, 'view', CURRENT_TIMESTAMP),
(4, 8, 'download', CURRENT_TIMESTAMP),
(5, 9, 'view', CURRENT_TIMESTAMP),
(5, 10, 'download', CURRENT_TIMESTAMP),
(6, 11, 'view', CURRENT_TIMESTAMP),
(6, 12, 'download', CURRENT_TIMESTAMP),
(7, 13, 'view', CURRENT_TIMESTAMP),
(7, 14, 'download', CURRENT_TIMESTAMP),
(8, 15, 'view', CURRENT_TIMESTAMP),
(8, 16, 'download', CURRENT_TIMESTAMP),
(9, 17, 'view', CURRENT_TIMESTAMP),
(9, 18, 'download', CURRENT_TIMESTAMP),
(10, 19, 'view', CURRENT_TIMESTAMP),
(10, 20, 'download', CURRENT_TIMESTAMP),
(11, 21, 'view', CURRENT_TIMESTAMP),
(11, 22, 'download', CURRENT_TIMESTAMP),
(12, 23, 'view', CURRENT_TIMESTAMP),
(12, 24, 'download', CURRENT_TIMESTAMP),
(13, 25, 'view', CURRENT_TIMESTAMP),
(13, 26, 'download', CURRENT_TIMESTAMP),
(14, 27, 'view', CURRENT_TIMESTAMP),
(14, 28, 'download', CURRENT_TIMESTAMP),
(15, 29, 'view', CURRENT_TIMESTAMP),
(15, 30, 'download', CURRENT_TIMESTAMP);


INSERT INTO shared_links (document_id, user_id, share_token, expiration_date, created_at) VALUES
(1, 1, 'token_001', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(2, 2, 'token_002', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(3, 3, 'token_003', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(4, 4, 'token_004', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(5, 5, 'token_005', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(6, 6, 'token_006', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(7, 7, 'token_007', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(8, 8, 'token_008', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(9, 9, 'token_009', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(10, 10, 'token_010', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(11, 11, 'token_011', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(12, 12, 'token_012', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(13, 13, 'token_013', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(14, 14, 'token_014', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(15, 15, 'token_015', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(16, 16, 'token_016', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(17, 17, 'token_017', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(18, 18, 'token_018', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(19, 19, 'token_019', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(20, 20, 'token_020', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(21, 21, 'token_021', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(22, 22, 'token_022', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(23, 23, 'token_023', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(24, 24, 'token_024', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(25, 25, 'token_025', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(26, 26, 'token_026', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(27, 27, 'token_027', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(28, 28, 'token_028', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(29, 29, 'token_029', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP),
(30, 30, 'token_030', CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP);


INSERT INTO forums (subject_id, created_at) VALUES
(1, CURRENT_TIMESTAMP),
(2, CURRENT_TIMESTAMP),
(3, CURRENT_TIMESTAMP),
(4, CURRENT_TIMESTAMP),
(5, CURRENT_TIMESTAMP),
(6, CURRENT_TIMESTAMP),
(7, CURRENT_TIMESTAMP),
(8, CURRENT_TIMESTAMP),
(9, CURRENT_TIMESTAMP),
(10, CURRENT_TIMESTAMP),
(11, CURRENT_TIMESTAMP),
(12, CURRENT_TIMESTAMP),
(13, CURRENT_TIMESTAMP),
(14, CURRENT_TIMESTAMP),
(15, CURRENT_TIMESTAMP),
(16, CURRENT_TIMESTAMP),
(17, CURRENT_TIMESTAMP),
(18, CURRENT_TIMESTAMP),
(19, CURRENT_TIMESTAMP),
(20, CURRENT_TIMESTAMP),
(21, CURRENT_TIMESTAMP),
(22, CURRENT_TIMESTAMP),
(23, CURRENT_TIMESTAMP),
(24, CURRENT_TIMESTAMP),
(25, CURRENT_TIMESTAMP),
(26, CURRENT_TIMESTAMP),
(27, CURRENT_TIMESTAMP),
(28, CURRENT_TIMESTAMP),
(29, CURRENT_TIMESTAMP),
(30, CURRENT_TIMESTAMP);



INSERT INTO forum_posts (forum_id, user_id, title, content, status, created_at, updated_at) VALUES
(1, 1, 'Hỏi về lập trình C', 'Làm thế nào để quản lý bộ nhớ trong C?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'Cần tài liệu lập trình C', 'Ai có tài liệu lập trình C hay không?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 'Cấu trúc dữ liệu nào hiệu quả?', 'Khi nào nên dùng danh sách liên kết?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 4, 'Thuật toán sắp xếp', 'So sánh quicksort và mergesort?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 5, 'Cấu hình Linux', 'Hướng dẫn cấu hình server trên Linux?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 'Hỏi về lệnh Linux', 'Lệnh nào để kiểm tra CPU?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 7, 'Quy trình Agile', 'Agile khác Scrum như thế nào?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 8, 'Tài liệu Kỹ thuật phần mềm', 'Cần tài liệu về quy trình phát triển phần mềm.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 9, 'Thiết kế giao diện', 'Công cụ nào tốt để thiết kế UI?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 10, 'Hỏi về UX', 'Làm thế nào để cải thiện UX?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 11, 'AI cơ bản', 'AI và machine learning khác nhau thế nào?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 12, 'Tài liệu AI', 'Ai có tài liệu AI cơ bản không?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 13, 'Mạch điện tử', 'Cách phân tích mạch điện đơn giản?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 14, 'Tài liệu mạch điện', 'Cần tài liệu mạch điện cơ bản.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 15, 'Điện tử công suất', 'Ứng dụng của điện tử công suất?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 16, 'Hỏi về biến tần', 'Biến tần hoạt động thế nào?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 17, 'Cơ học vật rắn', 'Cách tính lực tác dụng?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 18, 'Tài liệu cơ học', 'Cần tài liệu cơ học kỹ thuật.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 19, 'Thiết kế máy', 'Phần mềm nào để thiết kế máy?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 20, 'Hỏi về CAD', 'Cách sử dụng AutoCAD?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 21, 'Kinh tế vi mô', 'Cầu và cung ảnh hưởng thế nào?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 22, 'Tài liệu kinh tế vi mô', 'Cần tài liệu kinh tế vi mô.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 23, 'Kinh tế vĩ mô', 'GDP được tính như thế nào?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 24, 'Hỏi về lạm phát', 'Lạm phát ảnh hưởng đến kinh tế ra sao?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 25, 'Chiến lược doanh nghiệp', 'Làm thế nào để lập kế hoạch chiến lược?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 26, 'Tài liệu quản trị', 'Cần tài liệu quản trị chiến lược.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 27, 'Marketing căn bản', '4P trong marketing là gì?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 28, 'Tài liệu marketing', 'Cần tài liệu marketing cơ bản.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 29, 'Nghiên cứu thị trường', 'Phương pháp nghiên cứu thị trường nào hiệu quả?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 30, 'Hỏi về khảo sát', 'Cách thiết kế khảo sát thị trường?', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO forum_replies (post_id, user_id, content, status, created_at, updated_at) VALUES
(1, 2, 'Quản lý bộ nhớ trong C cần dùng con trỏ cẩn thận.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 3, 'Bạn có thể dùng malloc và free.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 4, 'Mình có tài liệu hay, sẽ chia sẻ.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 5, 'Cảm ơn bạn nhé!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 'Danh sách liên kết tốt cho dữ liệu động.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 7, 'Nên xem tài liệu của Cormen.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 8, 'Quicksort nhanh hơn nhưng không ổn định.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 9, 'Mergesort tốt cho dữ liệu lớn.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 10, 'Cấu hình server cần chú ý bảo mật.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 11, 'Dùng lệnh useradd để thêm user.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 12, 'Lệnh top hoặc htop để kiểm tra CPU.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 13, 'Cảm ơn bạn, rất hữu ích!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 14, 'Agile linh hoạt hơn Scrum.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 15, 'Scrum là một dạng của Agile.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 16, 'Mình có tài liệu, sẽ gửi bạn.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 17, 'Cảm ơn nhiều!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 18, 'Figma là công cụ tốt để thiết kế UI.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 19, 'Adobe XD cũng rất tốt.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 20, 'UX cần tập trung vào người dùng.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 21, 'Nên làm khảo sát người dùng.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 22, 'AI bao gồm cả machine learning.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 23, 'Machine learning là một nhánh của AI.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 24, 'Mình có tài liệu AI, sẽ chia sẻ.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 25, 'Cảm ơn bạn nhiều!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 26, 'Dùng phương pháp phân tích mạch.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 27, 'Cần thực hành nhiều.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 28, 'Mình có tài liệu, sẽ gửi.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 29, 'Cảm ơn bạn nhé!', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 30, 'Biến tần điều chỉnh tốc độ động cơ.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 1, 'Ứng dụng trong công nghiệp rất nhiều.', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO notifications (user_id, title, content, is_read, type, reference_id, created_at) VALUES
(1, 'Tài liệu mới', 'Tài liệu Lập trình C đã được upload.', FALSE, 'document', 1, CURRENT_TIMESTAMP),
(2, 'Bình luận mới', 'Có bình luận mới trên tài liệu của bạn.', FALSE, 'comment', 1, CURRENT_TIMESTAMP),
(3, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá 5 sao.', FALSE, 'rating', 1, CURRENT_TIMESTAMP),
(4, 'Chia sẻ tài liệu', 'Tài liệu của bạn đã được chia sẻ.', FALSE, 'share', 1, CURRENT_TIMESTAMP),
(5, 'Bài đăng mới', 'Có bài đăng mới trong diễn đàn.', FALSE, 'forum_post', 1, CURRENT_TIMESTAMP),
(6, 'Phản hồi mới', 'Có phản hồi mới trong bài đăng của bạn.', FALSE, 'forum_reply', 1, CURRENT_TIMESTAMP),
(7, 'Tài liệu mới', 'Tài liệu Hệ điều hành đã được upload.', FALSE, 'document', 3, CURRENT_TIMESTAMP),
(8, 'Bình luận mới', 'Có bình luận mới trên tài liệu của bạn.', FALSE, 'comment', 3, CURRENT_TIMESTAMP),
(9, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá 4 sao.', FALSE, 'rating', 3, CURRENT_TIMESTAMP),
(10, 'Chia sẻ tài liệu', 'Tài liệu của bạn đã được chia sẻ.', FALSE, 'share', 3, CURRENT_TIMESTAMP),
(11, 'Bài đăng mới', 'Có bài đăng mới trong diễn đàn.', FALSE, 'forum_post', 3, CURRENT_TIMESTAMP),
(12, 'Phản hồi mới', 'Có phản hồi mới trong bài đăng của bạn.', FALSE, 'forum_reply', 3, CURRENT_TIMESTAMP),
(13, 'Tài liệu mới', 'Tài liệu Mạch điện tử đã được upload.', FALSE, 'document', 7, CURRENT_TIMESTAMP),
(14, 'Bình luận mới', 'Có bình luận mới trên tài liệu của bạn.', FALSE, 'comment', 7, CURRENT_TIMESTAMP),
(15, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá 5 sao.', FALSE, 'rating', 7, CURRENT_TIMESTAMP),
(16, 'Chia sẻ tài liệu', 'Tài liệu của bạn đã được chia sẻ.', FALSE, 'share', 7, CURRENT_TIMESTAMP),
(17, 'Bài đăng mới', 'Có bài đăng mới trong diễn đàn.', FALSE, 'forum_post', 7, CURRENT_TIMESTAMP),
(18, 'Phản hồi mới', 'Có phản hồi mới trong bài đăng của bạn.', FALSE, 'forum_reply', 7, CURRENT_TIMESTAMP),
(19, 'Tài liệu mới', 'Tài liệu Cơ học đã được upload.', FALSE, 'document', 9, CURRENT_TIMESTAMP),
(20, 'Bình luận mới', 'Có bình luận mới trên tài liệu của bạn.', FALSE, 'comment', 9, CURRENT_TIMESTAMP),
(21, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá 4 sao.', FALSE, 'rating', 9, CURRENT_TIMESTAMP),
(22, 'Chia sẻ tài liệu', 'Tài liệu của bạn đã được chia sẻ.', FALSE, 'share', 9, CURRENT_TIMESTAMP),
(23, 'Bài đăng mới', 'Có bài đăng mới trong diễn đàn.', FALSE, 'forum_post', 9, CURRENT_TIMESTAMP),
(24, 'Phản hồi mới', 'Có phản hồi mới trong bài đăng của bạn.', FALSE, 'forum_reply', 9, CURRENT_TIMESTAMP),
(25, 'Tài liệu mới', 'Tài liệu Kinh tế vi mô đã được upload.', FALSE, 'document', 11, CURRENT_TIMESTAMP),
(26, 'Bình luận mới', 'Có bình luận mới trên tài liệu của bạn.', FALSE, 'comment', 11, CURRENT_TIMESTAMP),
(27, 'Đánh giá mới', 'Tài liệu của bạn nhận được đánh giá 5 sao.', FALSE, 'rating', 11, CURRENT_TIMESTAMP),
(28, 'Chia sẻ tài liệu', 'Tài liệu của bạn đã được chia sẻ.', FALSE, 'share', 11, CURRENT_TIMESTAMP),
(29, 'Bài đăng mới', 'Có bài đăng mới trong diễn đàn.', FALSE, 'forum_post', 11, CURRENT_TIMESTAMP),
(30, 'Phản hồi mới', 'Có phản hồi mới trong bài đăng của bạn.', FALSE, 'forum_reply', 11, CURRENT_TIMESTAMP);


INSERT INTO system_config (config_key, config_value, description, updated_at) VALUES
('max_file_size', '10485760', 'Kích thước tệp tối đa (bytes)', CURRENT_TIMESTAMP),
('allowed_file_types', 'pdf,doc,docx', 'Các loại tệp được phép upload', CURRENT_TIMESTAMP),
('upload_limit_per_user', '10', 'Giới hạn số tài liệu mỗi người dùng', CURRENT_TIMESTAMP),
('default_document_status', 'pending', 'Trạng thái mặc định của tài liệu', CURRENT_TIMESTAMP),
('notification_expiry_days', '30', 'Thời gian hết hạn thông báo (ngày)', CURRENT_TIMESTAMP),
('max_comments_per_document', '50', 'Số bình luận tối đa mỗi tài liệu', CURRENT_TIMESTAMP),
('rating_enabled', 'true', 'Cho phép đánh giá tài liệu', CURRENT_TIMESTAMP),
('share_link_expiry_days', '30', 'Thời gian hết hạn liên kết chia sẻ (ngày)', CURRENT_TIMESTAMP),
('forum_post_limit', '100', 'Giới hạn bài đăng trên diễn đàn', CURRENT_TIMESTAMP),
('max_replies_per_post', '50', 'Số phản hồi tối đa mỗi bài đăng', CURRENT_TIMESTAMP);