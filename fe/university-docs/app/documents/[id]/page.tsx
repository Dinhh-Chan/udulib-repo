"use client"

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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import React from "react"
import { Textarea } from "@/components/ui/textarea"

interface Document {
  document_id: number
  title: string
  description: string
  file_path: string
  file_size: number
  file_type: string
  created_at: string
  updated_at: string
  view_count: number
  download_count: number
  average_rating: number
  subject: {
    subject_id: number
    subject_name: string
    subject_code: string
    description: string
    major_id: number
    year_id: number
  }
  user: {
    user_id: number
    username: string
    full_name: string
    email: string
  }
  tags: Array<{
    tag_id: number
    tag_name: string
  }>
}

interface Rating {
  rating_id: number;
  document_id: number;
  user_id: number;
  score: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

interface Comment {
  comment_id: number;
  document_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: { full_name: string; username: string };
  replies?: Comment[];
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
  const userCache = useRef<{ [userId: number]: { full_name: string; username: string } }>({});
  const [showComments, setShowComments] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserId(user.user_id);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!id || !userId || hasIncreasedView.current) return;

    const checkAndIncreaseView = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/history?document_id=${id}&user_id=${userId}&page=1&per_page=1`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const history = await checkRes.json();

      if (!Array.isArray(history) || history.length === 0) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/view`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      hasIncreasedView.current = true;
    };

    checkAndIncreaseView();
  }, [id, userId]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        )
        if (!response.ok) {
          throw new Error(`Lỗi khi tải dữ liệu: ${response.status}`)
        }
        const data = await response.json()
        setDocument(data)
      } catch (err) {
        console.error("Error fetching document:", err)
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument();

    const fetchRatings = async () => {
      try {
        setRatingLoading(true)
        setRatingError(null)
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ratings?document_id=${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!res.ok) throw new Error("Không thể tải đánh giá")
        const data = await res.json()
        setRatings(Array.isArray(data) ? data : [])
        if (userId) {
          const found = (Array.isArray(data) ? data : []).find((r: Rating) => r.user_id === userId)
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
    fetchRatings()
  }, [id, userId])

  const fetchUserInfo = async (userId: number, token: string | null) => {
    if (userCache.current[userId]) return userCache.current[userId];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const userData = await res.json();
        userCache.current[userId] = { full_name: userData.full_name, username: userData.username };
        return userCache.current[userId];
      }
    } catch {}
    return { full_name: "Ẩn danh", username: "" };
  };

  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments?document_id=${id}&include_replies=true&page=1&per_page=20`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Không thể tải bình luận");
        let data = await res.json();
        const tree = buildCommentTree(data);
        await fillUserInfoForComments(tree, token, fetchUserInfo);
        setComments(tree);
      } catch (err) {}
    };
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !userId) return;
    setCommentLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          document_id: Number(id),
          content: commentContent,
        }),
      });
      if (!res.ok) throw new Error("Không thể gửi bình luận");
      let newComment = await res.json();
      // Nếu comment chưa có user, fetch user info
      if (!newComment.user && newComment.user_id) {
        try {
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${newComment.user_id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            newComment.user = { full_name: userData.full_name, username: userData.username };
          }
        } catch {}
      }
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
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ratings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          document_id: Number(id),
          score: pendingScore,
        }),
      })
      if (!res.ok) throw new Error("Không thể gửi đánh giá")
      const newRating = await res.json()
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = bytes / Math.pow(k, i)
    return `${size.toFixed(1)} ${sizes[i]}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  const fetchReplies = async (parentId: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments?parent_comment_id=${parentId}&page=1&per_page=20`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Không thể tải replies");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyContent.trim() || !userId) return;
    setReplyLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          document_id: Number(id),
          content: replyContent,
          parent_comment_id: parentId,
        }),
      });
      if (!res.ok) throw new Error("Không thể gửi reply");
      const newReply = await res.json();
      if (!newReply.user && newReply.user_id) {
        newReply.user = await fetchUserInfo(newReply.user_id, token);
      }
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
    <div key={comment.comment_id} className="border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm">{comment.user?.full_name || comment.user?.username || "Ẩn danh"}</span>
        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
      </div>
      <div className="text-sm">{comment.content}</div>
      <Button
        variant="link"
        size="sm"
        className="px-0 text-xs"
        onClick={() => setReplyingToId(comment.comment_id)}
      >
        Trả lời
      </Button>
      {/* Hiển thị replies nếu có */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-4 mt-2 border-l space-y-2">
          {comment.replies.map((reply) => renderComment(reply))}
        </div>
      )}
      {/* Form trả lời */}
      {replyingToId === comment.comment_id && (
        <form
          onSubmit={(e) => handleSubmitReply(e, comment.comment_id)}
          className="flex flex-col gap-2 mt-2"
        >
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Nhập trả lời..."
            rows={2}
            required
            disabled={replyLoading}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={replyLoading || !replyContent.trim()}>
              {replyLoading ? "Đang gửi..." : "Gửi trả lời"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setReplyingToId(null)}>
              Hủy
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  function buildCommentTree(flatComments: any[]) {
    const map: { [id: number]: any } = {};
    const roots: any[] = [];

    // Tạo map comment_id -> comment
    flatComments.forEach(comment => {
      map[comment.comment_id] = { ...comment, replies: [] };
    });

    // Gắn replies vào comment cha
    flatComments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parent = map[comment.parent_comment_id];
        if (parent) {
          parent.replies.push(map[comment.comment_id]);
        }
      } else {
        roots.push(map[comment.comment_id]);
      }
    });

    return roots;
  }

  async function fillUserInfoForComments(comments: any[], token: string | null, fetchUserInfo: any) {
    for (const comment of comments) {
      if (!comment.user && comment.user_id) {
        comment.user = await fetchUserInfo(comment.user_id, token);
      }
      if (comment.replies && comment.replies.length > 0) {
        await fillUserInfoForComments(comment.replies, token, fetchUserInfo);
      }
    }
  }

  function getGoogleDrivePreviewUrl(url: string) {
    if (!url) return null;
    return url.replace(/\/(edit|view)(\?.*)?$/, "/preview");
  }

  const handleDownloadClick = () => {
    if (!document) return;
    setDownloadUrl(document.file_path);
    setShowDownloadConfirm(true);
  };

  const getDownloadUrl = (url: string) => {
    // Nếu là Google Docs, chuyển sang link export PDF
    const match = url.match(/https:\/\/docs\.google\.com\/document\/d\/([\w-]+)/);
    if (match) {
      return `https://docs.google.com/document/d/${match[1]}/export?format=pdf`;
    }
    return url;
  };

  const confirmDownload = () => {
    setShowDownloadConfirm(false);
    const finalUrl = getDownloadUrl(downloadUrl);
    if (finalUrl.startsWith('http')) {
      window.open(finalUrl, '_blank', 'noopener');
    } else {
      if (downloadLinkRef.current) {
        downloadLinkRef.current.click();
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="flex justify-center items-center h-[500px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
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
          <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
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
            <div className="bg-muted rounded-lg flex items-center justify-center h-[500px] mb-4 p-0">
              {document.file_path && document.file_path.includes("docs.google.com") && getGoogleDrivePreviewUrl(document.file_path) ? (
                <iframe
                  src={getGoogleDrivePreviewUrl(document.file_path) as string}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 500, minWidth: '100%' }}
                  allow="autoplay"
                ></iframe>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thích
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments((v) => !v)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bình luận
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Báo cáo
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tải xuống tài liệu</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {document.tags?.map((tag) => (
                    <Badge key={tag.tag_id} variant="outline">
                      {tag.tag_name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="text-sm font-medium">{ratings.length} đánh giá:</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`text-yellow-400 focus:outline-none ${userRating && userRating >= star ? "" : "opacity-40"}`}
                        onClick={() => handleStarClick(star)}
                        disabled={!!userRating || ratingLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(1) : "0.0"}/5)
                    {/* <span className="ml-1">({ratings.length} đánh giá)</span> */}
                  </div>
                </div>
                {userRating && <div className="text-xs text-green-600 mt-1">Bạn đã đánh giá {userRating} sao</div>}
                {ratingError && <div className="text-xs text-red-500 mt-1">{ratingError}</div>}
                <Button
                  className="w-full"
                  onClick={handleDownloadClick}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                {/* Thẻ a ẩn để download file nội bộ */}
                <a
                  href={getDownloadUrl(document.file_path)}
                  download
                  ref={downloadLinkRef}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                >Download</a>
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

        {showComments && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-2 mb-4">
              <Textarea
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Nhập bình luận của bạn..."
                rows={3}
                required
                disabled={commentLoading}
              />
              <Button type="submit" disabled={commentLoading || !commentContent.trim()}>
                {commentLoading ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
            </form>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-muted-foreground">Chưa có bình luận nào.</div>
              ) : (
                comments.map((comment) => renderComment(comment))
              )}
            </div>
          </div>
        )}
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
      {/* Modal xác nhận tải xuống */}
      <Dialog open={showDownloadConfirm} onOpenChange={setShowDownloadConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận tải xuống</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn tải tài liệu này về máy không?</div>
          <DialogFooter>
            <Button onClick={() => setShowDownloadConfirm(false)} variant="outline">Huỷ</Button>
            <Button onClick={confirmDownload}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}