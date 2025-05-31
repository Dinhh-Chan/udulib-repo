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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

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
              <span className="text-muted-foreground">{document.file_type.split('/')[1].toUpperCase()}</span>
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
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[500px] mb-4">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Xem trước tài liệu</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Tài liệu này có thể được xem trước trực tiếp trên trình duyệt.
                </p>
                <Button className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống để xem đầy đủ
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thích
                </Button>
                <Button variant="ghost" size="sm">
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
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
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
    </div>
  )
}