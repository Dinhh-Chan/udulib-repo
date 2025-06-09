from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import relationship

from app.models.base import Base

class ForumPostLike(Base):
    __tablename__ = "forum_post_likes"

    like_id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.post_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("ForumPost", back_populates="likes")
    user = relationship("User", back_populates="forum_post_likes")

    # Constraints
    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='uix_forum_post_like'),
    ) 