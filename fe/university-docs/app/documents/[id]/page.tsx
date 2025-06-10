"use client"

import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronRight,
  Download,
  FileText,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Eye,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import React from "react"
import { Textarea } from "@/components/ui/textarea"
import { 
  getPublicDocumentPreviewUrl,
  getDocumentFullPreviewUrl,
  downloadPublicDocument,
  isUserAuthenticated,
  getCurrentUser
} from "@/lib/api/documents"
import {
  fetchDocument,
  fetchRatings,
  createRating,
  fetchComments,
  createComment,
  checkUserViewHistory,
  increaseViewCount,
  formatFileSize,
  formatDate,
  buildCommentTree,
  fillUserInfoForComments,
  toggleLikeDocument,
  fetchDocumentsBySubject
} from "@/lib/api/document-detail"
import { Document, Rating, Comment, PreviewSupport } from "@/lib/api/types"
import Loading from "../../loading"
import { HeartLike } from "@/components/ui/heart-like"
import RadioRating from '../../../components/ui/RadioRating'
import { useMemo } from "react"
import { Document as DocType } from "@/lib/api/types"

function countAllComments(comments: Comment[]): number {
  let count = 0;
  for (const comment of comments) {
    count += 1;
    if (comment.replies && comment.replies.length > 0) {
      count += countAllComments(comment.replies);
    }
  }
  return count;
}

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState<number | null>(null)
  const [userRatingId, setUserRatingId] = useState<number | null>(null)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingError, setRatingError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingScore, setPendingScore] = useState<number | null>(null)
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null);
  const hasIncreasedView = useRef(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  
  // Thêm state mới cho logic preview
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [previewSupport, setPreviewSupport] = useState<PreviewSupport | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [relatedDocs, setRelatedDocs] = useState<DocType[]>([]);

  const renderPreview = () => {
    if (previewLoading) {
      return (
          <Loading />
      );
    }

    // Nếu file không hỗ trợ preview
    if (!previewUrl || previewError) {
      const retryPreview = async () => {
        try {
          setPreviewLoading(true);
          setPreviewError(false);
          
          let previewUrlToUse = "";
          if (isAuthenticated) {
            previewUrlToUse = getDocumentFullPreviewUrl(Number(id));
          } else {
            previewUrlToUse = getPublicDocumentPreviewUrl(Number(id), "medium");
          }
          
          setPreviewUrl(previewUrlToUse);
        } catch (error) {
          console.error("Error retrying preview:", error);
          setPreviewError(true);
        } finally {
          setPreviewLoading(false);
        }
      };

      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FileText className="h-16 w-16 mb-4" />
          <p>Không thể tải preview</p>
          <p className="text-sm">Thử tải lại preview hoặc tải xuống tài liệu</p>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={retryPreview} 
              variant="outline"
              disabled={previewLoading}
            >
              {previewLoading ? "Đang tải..." : "Thử lại"}
            </Button>
          </div>
        </div>
      );
    }

    // Hiển thị preview với overlay nếu chưa đăng nhập
    return (
      <div className="relative h-full">
        {renderPreviewContent()}
        
        {/* Overlay cho người dùng chưa đăng nhập */}
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 max-w-sm text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Đăng nhập để xem đầy đủ</h3>
              <p className="text-muted-foreground mb-4">
                Đăng nhập để xem toàn bộ nội dung và tải xuống tài liệu
              </p>
              <div className="flex gap-2">
                <Button onClick={() => router.push('/login')} className="flex-1">
                  Đăng nhập
                </Button>
                <Button variant="outline" onClick={() => router.push('/register')} className="flex-1">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreviewContent = () => {
    // API luôn trả về ảnh với content-type: image/jpeg
    return (
      <div className="w-full overflow-y-auto max-h-[80vh]">
        <img
          src={previewUrl}
          alt="Document preview"
          className="w-full h-auto rounded-lg"
          onError={(e) => {
            console.error("Failed to load image preview:", {
              url: previewUrl,
              error: e,
              target: e.target,
              isAuthenticated,
              documentId: id
            });
            setPreviewError(true);
            setPreviewUrl("");
          }}
          onLoad={() => {
            console.log("Image preview loaded successfully:", previewUrl);
            setPreviewError(false);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    // Kiểm tra authentication status
    setIsAuthenticated(isUserAuthenticated());
    
    if (typeof window !== "undefined") {
      try {
        const user = getCurrentUser();
        if (user) {
          setUserId(user.user_id);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!id || !userId || hasIncreasedView.current) return;

    const checkAndIncreaseView = async () => {
      try {
        const history = await checkUserViewHistory(id, userId);
        if (!Array.isArray(history) || history.length === 0) {
          await increaseViewCount(id);
        }
        hasIncreasedView.current = true;
      } catch (error) {
        console.error("Error checking/increasing view count:", error);
      }
    };

    checkAndIncreaseView();
  }, [id, userId]);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Lấy thông tin tài liệu
        const data = await fetchDocument(id);
        setDocument(data);
        
        // Nếu API trả về is_liked và like_count thì set luôn
        if (typeof data.is_liked === 'boolean') setIsLiked(data.is_liked);
        if (typeof data.like_count === 'number') setLikeCount(data.like_count);
        
        // Kiểm tra xem file có hỗ trợ preview không
        try {
            
            // Lấy URL preview phù hợp
            let previewUrlToUse = "";
            
            if (isAuthenticated) {
              // Người dùng đã đăng nhập - sử dụng full preview
              previewUrlToUse = getDocumentFullPreviewUrl(Number(id));
            } else {
              // Người dùng chưa đăng nhập - sử dụng preview cơ bản
              previewUrlToUse = getPublicDocumentPreviewUrl(Number(id), "medium");
            }
            
            setPreviewUrl(previewUrlToUse);
            setPreviewLoading(false);
          
        } catch (error) {
          console.error("Error checking preview support:", error);
        }
        
      } catch (err) {
        console.error("Error fetching document:", err)
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }

    const loadRatings = async () => {
      try {
        setRatingLoading(true)
        setRatingError(null)
        const data = await fetchRatings(id);
        setRatings(data);
        if (userId) {
          const found = data.find((r: Rating) => r.user_id === userId)
          if (found) {
            setUserRating(found.score)
            setUserRatingId(found.rating_id)
          } else {
            setUserRating(null)
            setUserRatingId(null)
          }
        }
      } catch (err) {
        setRatingError(err instanceof Error ? err.message : "Có lỗi khi tải đánh giá")
      } finally {
        setRatingLoading(false)
      }
    }

    loadDocument();
    loadRatings();
  }, [id, isAuthenticated, userId])

  useEffect(() => {
    if (!id) return;
    const loadComments = async () => {
      try {
        let data = await fetchComments(id);
        const tree = buildCommentTree(data);
        await fillUserInfoForComments(tree);
        setComments(tree);
      } catch (err) {}
    };
    loadComments();
  }, [id]);

  useEffect(() => {
    if (!document?.subject?.subject_id) return;
    fetchDocumentsBySubject(document.subject.subject_id, 10)
      .then(docs => {
        setRelatedDocs(docs.filter((doc: DocType) => doc.document_id !== document.document_id));
      });
  }, [document?.subject?.subject_id, document?.document_id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !userId) return;
    setCommentLoading(true);
    try {
      let newComment = await createComment(id, commentContent);
      setComments((prev) => [newComment, ...prev]);
      setCommentContent("");
    } catch (err) {
      // ignore
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStarClick = (score: number) => {
    if (userRating) return;
    setPendingScore(score)
    setShowConfirm(true)
  }

  const confirmRate = async () => {
    if (!pendingScore) return;
    setShowConfirm(false)
    setRatingLoading(true)
    setRatingError(null)
    try {
      const newRating = await createRating(id, pendingScore);
      setRatings((prev) => [...prev, newRating])
      setUserRating(pendingScore)
      setUserRatingId(newRating.rating_id)
    } catch (err) {
      setRatingError(err instanceof Error ? err.message : "Có lỗi khi gửi đánh giá")
    } finally {
      setRatingLoading(false)
      setPendingScore(null)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyContent.trim() || !userId) return;
    setReplyLoading(true);
    try {
      const newReply = await createComment(id, replyContent, parentId);
      setComments((prev) =>
        prev.map((c) =>
          c.comment_id === parentId
            ? { ...c, replies: c.replies ? [newReply, ...c.replies] : [newReply] }
            : c
        )
      );
      setReplyContent("");
      setReplyingToId(null);
    } catch {}
    setReplyLoading(false);
  };

  const renderComment = (comment: Comment) => (
    <Card key={comment.comment_id} className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {comment.user?.full_name?.substring(0, 2) || "ND"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <p className="font-semibold">{comment.user?.full_name || comment.user?.username || "Ẩn danh"}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(comment.created_at)}
              </p>
            </div>
            
            <div className="prose max-w-none mb-3 dark:prose-invert">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed text-sm">
                {comment.content}
              </p>
            </div>
            
            {/* Comment Actions */}
            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingToId(comment.comment_id)}
                className="text-muted-foreground hover:text-primary p-0 h-auto"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Phản hồi
              </Button>
            </div>

            {/* Reply Form */}
            {replyingToId === comment.comment_id && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <form onSubmit={(e) => handleSubmitReply(e, comment.comment_id)} className="space-y-3">
                  <Textarea
                    placeholder={`Phản hồi ${comment.user?.full_name || "bình luận này"}...`}
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                    disabled={replyLoading}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={replyLoading || !replyContent.trim()}
                    >
                      {replyLoading ? "Đang gửi..." : "Gửi phản hồi"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setReplyingToId(null)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-6 border-l-2 border-border pl-4">
                <div className="space-y-3">
                  {comment.replies.map((reply) => (
                    <div 
                      key={reply.comment_id} 
                      className="flex gap-3 p-3 rounded-lg bg-muted/20"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
                        {reply.user?.full_name?.substring(0, 2) || "ND"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{reply.user?.full_name || reply.user?.username || "Ẩn danh"}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(reply.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );



  const handleDownloadClick = async () => {
    if (!document) return;
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    setDownloadLoading(true);
    try {
      const downloadUrl = await downloadPublicDocument(Number(id));
      
      // Tạo link download
      const link = window.document.createElement('a');
      link.href = downloadUrl;
      link.download = document.title || 'document';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Cleanup URL
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("Tải xuống thành công!");
    } catch (error) {
      console.error("Error downloading:", error);
      toast.error("Không thể tải xuống tài liệu");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const result = await toggleLikeDocument(Number(id), isLiked);
      setIsLiked(result.is_liked);
      setLikeCount(result.like_count);
    } catch (error) {
      toast.error("Có lỗi khi like tài liệu");
    }
  };

  if (loading) {
    return (
      <Loading />
    )
  }

  if (error || !document) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="text-center py-8 text-red-500">
          {error || "Không tìm thấy tài liệu"}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/documents" className="hover:underline">
              Tài liệu
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{document.title}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
            <div className="flex items-center gap-2">
              <HeartLike isLiked={!!isLiked} onToggle={handleLike} disabled={downloadLoading} size="md" />
              <span className="text-sm text-muted-foreground">{likeCount} lượt thích</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">{document.description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.file_type?.split('/')?.[1]?.toUpperCase() || document.file_type?.toUpperCase() || 'UNKNOWN'}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{formatFileSize(document.file_size)}</span>
              <span className="text-muted-foreground">•</span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{formatDate(document.created_at)}</span>
              <span className="text-muted-foreground">•</span>
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.user.full_name}</span>
              <span className="text-muted-foreground">•</span>
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.view_count} lượt xem</span>
              <span className="text-muted-foreground">•</span>
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.download_count} lượt tải</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-muted rounded-lg flex items-center justify-center h-[500px] mb-4 p-0 overflow-hidden border-2 border-primary">
              {renderPreview()}
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tải xuống tài liệu</h3>
                <div className="flex items-center gap-2 mt-4">
                  <div className="text-sm font-medium">{ratings.length} đánh giá:</div>
                  <RadioRating
                    value={userRating || 0}
                    onChange={handleStarClick}
                    disabled={!!userRating || ratingLoading}
                    loading={ratingLoading}
                  />
                  <div className="text-sm text-muted-foreground">
                    ({ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(1) : "0.0"}/5)
                  </div>
                </div>
                {userRating && <div className="text-xs text-green-600 mt-1">Bạn đã đánh giá {userRating} sao</div>}
                {ratingError && <div className="text-xs text-red-500 mt-1">{ratingError}</div>}
                <br />
                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    onClick={handleDownloadClick}
                    disabled={downloadLoading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadLoading ? "Đang tải..." : "Tải xuống"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setShowLoginPrompt(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Đăng nhập để tải xuống
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Đã có {document.download_count} lượt tải xuống
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Thông tin môn học</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Môn học</div>
                    <div className="text-sm text-muted-foreground">{document.subject.subject_name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Mã môn học</div>
                    <div className="text-sm text-muted-foreground">{document.subject.subject_code}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1">
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Viết bình luận</h3>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    rows={4}
                    required
                    disabled={commentLoading}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={commentLoading || !commentContent.trim()}>
                      {commentLoading ? "Đang gửi..." : "Đăng bình luận"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Bình luận ({countAllComments(comments)})</h3>
              </div>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => renderComment(comment))}
                </div>
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Chưa có bình luận nào</p>
                    <p className="text-muted-foreground text-sm">Hãy là người đầu tiên bình luận về tài liệu này!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="w-full md:w-80">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tài liệu liên quan</h3>
                {relatedDocs.length === 0 ? (
                  <div className="text-muted-foreground text-sm">Không có tài liệu liên quan.</div>
                ) : (
                  <ul className="space-y-3">
                    {relatedDocs.map((doc: Document) => (
                      <li key={doc.document_id}>
                        <Link href={`/documents/${doc.document_id}`} className="font-medium hover:underline">
                          {doc.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {doc.file_type?.toUpperCase()} • {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Modal xác nhận đánh giá */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đánh giá</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn đánh giá {pendingScore} sao cho tài liệu này không?</div>
          <DialogFooter>
            <Button onClick={() => setShowConfirm(false)} variant="outline">Huỷ</Button>
            <Button onClick={confirmRate} disabled={ratingLoading}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal yêu cầu đăng nhập */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="mb-4">
              Bạn cần đăng nhập để tải xuống tài liệu và xem đầy đủ nội dung.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLoginPrompt(false)} variant="outline">
              Hủy
            </Button>
            <Button onClick={() => router.push('/login')}>
              Đăng nhập
            </Button>
            <Button onClick={() => router.push('/register')} variant="outline">
              Đăng ký
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}