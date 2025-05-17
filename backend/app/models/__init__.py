# Import all models
from app.models.user import User
from app.models.major import Major
from app.models.academic_year import AcademicYear
from app.models.subject import Subject
from app.models.document import Document
from app.models.department import Department
from app.models.tag import Tag
from app.models.document_tag import DocumentTag
from app.models.comment import Comment
from app.models.rating import Rating
from app.models.document_history import DocumentHistory
from app.models.shared_link import SharedLink
from app.models.forum import Forum
from app.models.forum_post import ForumPost
from app.models.forum_reply import ForumReply
from app.models.system_config import SystemConfig
from app.models.notification import Notification
from app.models.subject_department import SubjectDepartment
from sqlalchemy.orm import relationship

# Define relationships to avoid circular imports
User.documents = relationship("Document", back_populates="user")
User.comments = relationship("Comment", back_populates="user")
User.ratings = relationship("Rating", back_populates="user")
User.document_histories = relationship("DocumentHistory", back_populates="user")
User.shared_links = relationship("SharedLink", back_populates="user")
User.forum_posts = relationship("ForumPost", back_populates="user")
User.forum_replies = relationship("ForumReply", back_populates="user")
User.notifications = relationship("Notification", back_populates="user")

Major.subjects = relationship("Subject", back_populates="major")

AcademicYear.subjects = relationship("Subject", back_populates="academic_year")

Subject.major = relationship("Major", back_populates="subjects")
Subject.academic_year = relationship("AcademicYear", back_populates="subjects")
Subject.documents = relationship("Document", back_populates="subject")
Subject.forum = relationship("Forum", back_populates="subject", uselist=False)
Subject.departments = relationship("Department", secondary="subject_departments", back_populates="subjects")

Department.subjects = relationship("Subject", secondary="subject_departments", back_populates="departments")

Document.subject = relationship("Subject", back_populates="documents")
Document.user = relationship("User", back_populates="documents")
Document.comments = relationship("Comment", back_populates="document")
Document.ratings = relationship("Rating", back_populates="document")
Document.document_tags = relationship("DocumentTag", back_populates="document")
Document.document_histories = relationship("DocumentHistory", back_populates="document")
Document.shared_links = relationship("SharedLink", back_populates="document")

Tag.document_tags = relationship("DocumentTag", back_populates="tag")

DocumentTag.document = relationship("Document", back_populates="document_tags")
DocumentTag.tag = relationship("Tag", back_populates="document_tags")

Comment.document = relationship("Document", back_populates="comments")
Comment.user = relationship("User", back_populates="comments")

Rating.document = relationship("Document", back_populates="ratings")
Rating.user = relationship("User", back_populates="ratings")

DocumentHistory.document = relationship("Document", back_populates="document_histories")
DocumentHistory.user = relationship("User", back_populates="document_histories")

SharedLink.document = relationship("Document", back_populates="shared_links")
SharedLink.user = relationship("User", back_populates="shared_links")

Forum.subject = relationship("Subject", back_populates="forum")
Forum.posts = relationship("ForumPost", back_populates="forum")

ForumPost.forum = relationship("Forum", back_populates="posts")
ForumPost.user = relationship("User", back_populates="forum_posts")
ForumPost.replies = relationship("ForumReply", back_populates="post")

ForumReply.post = relationship("ForumPost", back_populates="replies")
ForumReply.user = relationship("User", back_populates="forum_replies")

Notification.user = relationship("User", back_populates="notifications")