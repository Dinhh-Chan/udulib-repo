"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ArrowLeft, MessageSquare, Eye, Clock, User, Reply } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { getForum, getForumPost, getForumReplies, createForumReply } from "@/lib/api/forum"
import { toast } from "sonner"
import type { Forum, ForumPost, ForumReply } from "@/types/forum"

export default function ForumPostDetailPage({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReplies, setTotalReplies] = useState(0)
  const resolvedParams = use(params)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=/forum/${resolvedParams.id}/post/${resolvedParams.postId}`)
      return
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isLoading, isAuthenticated, router, resolvedParams.id, resolvedParams.postId])

  useEffect(() => {
    if (isAuthenticated && post) {
      loadReplies()
    }
  }, [isAuthenticated, post, currentPage])

  const loadData = async () => {
    try {
      const [forumData, postData] = await Promise.all([
        getForum(parseInt(resolvedParams.id)),
        getForumPost(parseInt(resolvedParams.postId))
      ])
      setForum(forumData)
      setPost(postData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Không thể tải thông tin bài viết")
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadReplies = async () => {
    try {
      const repliesData = await getForumReplies(parseInt(resolvedParams.postId), currentPage, 5)
      setReplies(repliesData.replies)
      setTotalReplies(repliesData.total)
    } catch (error) {
      console.error("Error loading replies:", error)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi")
      return
    }

    try {
      setIsSubmittingReply(true)
      await createForumReply({
        post_id: parseInt(resolvedParams.postId),
        content: replyContent.trim()
      })
      
      setReplyContent("")
      toast.success("Đăng phản hồi thành công!")
      
      // Reload replies để hiển thị phản hồi mới
      await loadReplies()
    } catch (error: any) {
      console.error("Error creating reply:", error)
      toast.error(error.message || "Không thể đăng phản hồi")
    } finally {
      setIsSubmittingReply(false)
    }
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!forum || !post) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="text-center">
          <p>Không tìm thấy bài viết</p>
          <Button asChild className="mt-4">
            <Link href="/forum">Quay lại diễn đàn</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(totalReplies / 5)

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/forum" className="hover:underline">
              Diễn đàn
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/forum/${resolvedParams.id}`} className="hover:underline">
              {forum.subject_name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{post.title}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/forum/${resolvedParams.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại diễn đàn
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Bài viết chính */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={"/placeholder.svg"} 
                      alt={post.author?.username || "Người dùng"} 
                    />
                    <AvatarFallback>
                      {post.author?.full_name?.substring(0, 2) || "ND"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author?.full_name || "Người dùng"}</p>
                    <p className="text-sm text-muted-foreground">@{post.author?.username || "user"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.status === "approved" ? "default" : "secondary"}>
                    {post.status === "approved" ? "Đã duyệt" : 
                     post.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{totalReplies} phản hồi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>0 lượt xem</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form phản hồi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Reply className="h-5 w-5" />
                Viết phản hồi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <Textarea
                  placeholder="Viết phản hồi của bạn..."
                  rows={4}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isSubmittingReply}>
                  {isSubmittingReply ? "Đang đăng..." : "Đăng phản hồi"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danh sách phản hồi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Phản hồi ({totalReplies})</h3>
            {replies.length > 0 ? (
              <>
                {replies.map((reply) => (
                  <Card key={reply.reply_id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={"/placeholder.svg"} 
                            alt={reply.author?.username || "Người dùng"} 
                          />
                          <AvatarFallback>
                            {reply.author?.full_name?.substring(0, 2) || "ND"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{reply.author?.full_name || "Người dùng"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reply.created_at).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Phân trang */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có phản hồi nào. Hãy là người đầu tiên phản hồi!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}