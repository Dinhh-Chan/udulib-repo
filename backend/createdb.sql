-- Create database (optional)
-- CREATE DATABASE document_management;

-- Enable extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('student', 'lecturer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'banned', 'pending');
CREATE TYPE document_status AS ENUM ('approved', 'pending', 'rejected');
CREATE TYPE forum_status AS ENUM ('approved', 'pending', 'rejected');
CREATE TYPE history_action AS ENUM ('view', 'download');

-- 1. Create academic_years table
CREATE TABLE academic_years (
    year_id SERIAL PRIMARY KEY,
    year_name VARCHAR(50) NOT NULL,
    year_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create majors table
CREATE TABLE majors (
    major_id SERIAL PRIMARY KEY,
    major_name VARCHAR(100) NOT NULL,
    major_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for major_code
CREATE INDEX idx_major_code ON majors(major_code);

-- 3. Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    role user_role DEFAULT 'student' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    google_id VARCHAR(100),
    university_id VARCHAR(50),
    avatar_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create index for email
CREATE INDEX idx_user_email ON users(email);

-- 4. Create subjects table
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    description TEXT,
    major_id INTEGER NOT NULL REFERENCES majors(major_id),
    year_id INTEGER NOT NULL REFERENCES academic_years(year_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uix_major_subject_code UNIQUE (major_id, subject_code)
);

-- Create index for subject_code
CREATE INDEX idx_subject_code ON subjects(subject_code);

-- 5. Create documents table
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    status document_status DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for documents
CREATE INDEX idx_document_title ON documents(title);
CREATE INDEX idx_document_file_type ON documents(file_type);
CREATE INDEX idx_document_subject_id ON documents(subject_id);
CREATE INDEX idx_document_user_id ON documents(user_id);
CREATE INDEX idx_document_status ON documents(status);
CREATE INDEX idx_document_like_count ON documents(like_count);

-- 6. Create tags table
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for tag_name
CREATE INDEX idx_tag_name ON tags(tag_name);

-- 7. Create document_tags table (many-to-many relationship)
CREATE TABLE document_tags (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id),
    tag_id INTEGER NOT NULL REFERENCES tags(tag_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uix_document_tag UNIQUE (document_id, tag_id)
);

-- 7.1. Create document_likes table (for tracking who liked what document)
CREATE TABLE document_likes (
    like_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensure one like per user per document
    CONSTRAINT uix_document_like UNIQUE(document_id, user_id)
);

-- 8. Create comments table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES comments(comment_id) ON DELETE CASCADE,
    status forum_status DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create ratings table
CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uix_user_document_rating UNIQUE (user_id, document_id)
);

-- 10. Create document_history table
CREATE TABLE document_history (
    history_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    action history_action NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create shared_links table
CREATE TABLE shared_links (
    link_id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(document_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    share_token VARCHAR(100) NOT NULL UNIQUE,
    expiration_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Create forums table
CREATE TABLE forums (
    forum_id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL UNIQUE REFERENCES subjects(subject_id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Create forum_posts table
CREATE TABLE forum_posts (
    post_id SERIAL PRIMARY KEY,
    forum_id INTEGER NOT NULL REFERENCES forums(forum_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status forum_status DEFAULT 'approved',
    views INTEGER DEFAULT 0 NOT NULL,
    like_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Create forum_replies table
CREATE TABLE forum_replies (
    reply_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES forum_posts(post_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    content TEXT NOT NULL,
    status forum_status DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14.1. Create forum_post_likes table (for tracking who liked what)
CREATE TABLE forum_post_likes (
    like_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensure one like per user per post
    CONSTRAINT uix_forum_post_like UNIQUE(post_id, user_id)
);

-- 15. Create notifications table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) NOT NULL,
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Create system_config table
CREATE TABLE system_config (
    config_id SERIAL PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create additional indexes for performance
CREATE INDEX idx_document_history_document_user ON document_history(document_id, user_id);
CREATE INDEX idx_document_likes_document_id ON document_likes(document_id);
CREATE INDEX idx_document_likes_user_id ON document_likes(user_id);
CREATE INDEX idx_forum_posts_forum_id ON forum_posts(forum_id);
CREATE INDEX idx_forum_posts_views ON forum_posts(views);
CREATE INDEX idx_forum_posts_like_count ON forum_posts(like_count);
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_post_likes_post_id ON forum_post_likes(post_id);
CREATE INDEX idx_forum_post_likes_user_id ON forum_post_likes(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_shared_links_document_id ON shared_links(document_id);

-- Create composite indexes for frequently queried combinations
CREATE INDEX idx_documents_subject_status ON documents(subject_id, status);
CREATE INDEX idx_documents_user_created ON documents(user_id, created_at);
CREATE INDEX idx_ratings_document_score ON ratings(document_id, score);

-- Add triggers for updating 'updated_at' timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables with updated_at column
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON academic_years
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_majors_updated_at BEFORE UPDATE ON majors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraints with CASCADE options for better data integrity
ALTER TABLE documents
    ADD CONSTRAINT fk_documents_subject 
    FOREIGN KEY (subject_id) 
    REFERENCES subjects(subject_id) 
    ON DELETE RESTRICT,
    ADD CONSTRAINT fk_documents_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE comments
    ADD CONSTRAINT fk_comments_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_comments_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE ratings
    ADD CONSTRAINT fk_ratings_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_ratings_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE document_tags
    ADD CONSTRAINT fk_document_tags_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_document_tags_tag 
    FOREIGN KEY (tag_id) 
    REFERENCES tags(tag_id) 
    ON DELETE CASCADE;

ALTER TABLE document_likes
    ADD CONSTRAINT fk_document_likes_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_document_likes_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE CASCADE;

ALTER TABLE document_history
    ADD CONSTRAINT fk_document_history_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_document_history_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE shared_links
    ADD CONSTRAINT fk_shared_links_document 
    FOREIGN KEY (document_id) 
    REFERENCES documents(document_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_shared_links_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE forum_posts
    ADD CONSTRAINT fk_forum_posts_forum 
    FOREIGN KEY (forum_id) 
    REFERENCES forums(forum_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_forum_posts_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE forum_replies
    ADD CONSTRAINT fk_forum_replies_post 
    FOREIGN KEY (post_id) 
    REFERENCES forum_posts(post_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_forum_replies_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE RESTRICT;

ALTER TABLE forum_post_likes
    ADD CONSTRAINT fk_forum_post_likes_post 
    FOREIGN KEY (post_id) 
    REFERENCES forum_posts(post_id) 
    ON DELETE CASCADE,
    ADD CONSTRAINT fk_forum_post_likes_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE CASCADE;

-- Add comments to tables and columns for documentation
COMMENT ON TABLE users IS 'Stores user information including students, lecturers, and admins';
COMMENT ON TABLE documents IS 'Stores document metadata and file information with like tracking';
COMMENT ON TABLE document_likes IS 'Tracks individual likes for documents - prevents duplicate likes';
COMMENT ON TABLE subjects IS 'Stores subject/course information linked to majors and academic years';
COMMENT ON TABLE forums IS 'One-to-one relationship with subjects for forum functionality';
COMMENT ON TABLE forum_posts IS 'Forum posts with like and view tracking';
COMMENT ON TABLE forum_post_likes IS 'Tracks individual likes for forum posts - prevents duplicate likes';
COMMENT ON TABLE ratings IS 'Stores user ratings for documents (0-5 scale, 0 means like without rating)';
COMMENT ON TABLE document_history IS 'Tracks document views and downloads by users';
COMMENT ON TABLE shared_links IS 'Stores shareable links for documents with optional expiration';
COMMENT ON TABLE system_config IS 'Stores system configuration key-value pairs';

COMMENT ON COLUMN documents.like_count IS 'Cached count of likes for performance';
COMMENT ON COLUMN forum_posts.views IS 'Number of times this post has been viewed';
COMMENT ON COLUMN forum_posts.like_count IS 'Cached count of likes for performance';

-- Add some useful views
CREATE VIEW active_documents AS
SELECT d.*, s.subject_name, s.subject_code, u.username, u.full_name
FROM documents d
JOIN subjects s ON d.subject_id = s.subject_id
JOIN users u ON d.user_id = u.user_id
WHERE d.status = 'approved';

CREATE VIEW user_activity AS
SELECT u.user_id, u.username, u.full_name,
       COUNT(DISTINCT d.document_id) as uploaded_documents,
       COUNT(DISTINCT c.comment_id) as comments_made,
       COUNT(DISTINCT r.rating_id) as ratings_given
FROM users u
LEFT JOIN documents d ON u.user_id = d.user_id
LEFT JOIN comments c ON u.user_id = c.user_id
LEFT JOIN ratings r ON u.user_id = r.user_id
GROUP BY u.user_id, u.username, u.full_name;

-- Create function to calculate average rating for a document
CREATE OR REPLACE FUNCTION get_document_average_rating(doc_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(score) INTO avg_rating
    FROM ratings
    WHERE document_id = doc_id AND score > 0;
    
    RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to get document statistics
CREATE OR REPLACE FUNCTION get_document_stats(doc_id INTEGER)
RETURNS TABLE (
    total_views INTEGER,
    total_downloads INTEGER,
    average_rating NUMERIC,
    total_ratings INTEGER,
    total_comments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.view_count,
        d.download_count,
        get_document_average_rating(d.document_id),
        COUNT(DISTINCT r.rating_id)::INTEGER,
        COUNT(DISTINCT c.comment_id)::INTEGER
    FROM documents d
    LEFT JOIN ratings r ON d.document_id = r.document_id
    LEFT JOIN comments c ON d.document_id = c.document_id
    WHERE d.document_id = doc_id
    GROUP BY d.document_id, d.view_count, d.download_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user liked a forum post
CREATE OR REPLACE FUNCTION user_liked_forum_post(post_id_param INTEGER, user_id_param INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM forum_post_likes 
        WHERE post_id = post_id_param AND user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to get forum post stats
CREATE OR REPLACE FUNCTION get_forum_post_stats(post_id_param INTEGER)
RETURNS TABLE (
    views INTEGER,
    like_count INTEGER,
    reply_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fp.views,
        fp.like_count,
        COUNT(fr.reply_id)::INTEGER as reply_count
    FROM forum_posts fp
    LEFT JOIN forum_replies fr ON fp.post_id = fr.post_id
    WHERE fp.post_id = post_id_param
    GROUP BY fp.post_id, fp.views, fp.like_count;
END;
$$ LANGUAGE plpgsql;