"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  MessageSquare,
  Eye,
  ThumbsUp,
  Clock,
  User,
  Share2,
  Flag,
  ReplyIcon,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getForumPost, getForumReplies, createForumReply } from "@/lib/api/forum"
import type { ForumPost as ForumPostType, ForumReply as ForumReplyType } from "@/types/forum"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import Loading from "@/app/loading"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

const REPLIES_PER_PAGE = 5
const MAX_REPLY_LENGTH = 1000

export default function ForumPostPage({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [post, setPost] = useState<ForumPostType | null>(null)
  const [replies, setReplies] = useState<ForumReplyType[]>([])
  const [commentTree, setCommentTree] = useState<ForumReplyType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [replyContent, setReplyContent] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)
  const resolvedParams = use(params)

  // Hàm xây dựng cây bình luận
  const buildCommentTree = (flatReplies: ForumReplyType[]) => {
    const map: { [id: number]: ForumReplyType & { replies: ForumReplyType[] } } = {}
    const roots: (ForumReplyType & { replies: ForumReplyType[] })[] = []

    // Tạo map reply_id -> reply
    flatReplies.forEach(reply => {
      map[reply.reply_id] = { ...reply, replies: [] }
    })

    // Gắn replies vào reply cha
    flatReplies.forEach(reply => {
      if (reply.parent_id) {
        const parent = map[reply.parent_id]
        if (parent) {
          parent.replies.push(map[reply.reply_id])
        }
      } else {
        roots.push(map[reply.reply_id])
      }
    })

    return roots
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [postData, repliesData] = await Promise.all([
          getForumPost(parseInt(resolvedParams.postId)),
          getForumReplies(parseInt(resolvedParams.postId), currentPage, REPLIES_PER_PAGE)
        ])
        setPost(postData)
        setReplies(repliesData.replies)
        setCommentTree(buildCommentTree(repliesData.replies))
        setTotalPages(Math.ceil(repliesData.total / REPLIES_PER_PAGE))
      } catch (err) {
        setError("Không thể tải dữ liệu bài viết")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [resolvedParams.postId, currentPage])

  const handleSubmitReply = async (e?: React.FormEvent, parentId?: number) => {
    e?.preventDefault()
    
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để bình luận")
      router.push("/login?callbackUrl=" + window.location.pathname)
      return
    }

    const content = parentId ? replyContent : newReply
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận")
      return
    }

    if (content.length > MAX_REPLY_LENGTH) {
      toast.error(`Bình luận không được vượt quá ${MAX_REPLY_LENGTH} ký tự`)
      return
    }

    try {
      setReplyLoading(true)
      const reply = await createForumReply({
        post_id: parseInt(resolvedParams.postId),
        content: content,
        parent_id: parentId || replyTo
      })
      
      const updatedReplies = [reply, ...replies]
      setReplies(updatedReplies)
      setCommentTree(buildCommentTree(updatedReplies))
      setNewReply("")
      setReplyContent("")
      setReplyTo(null)
      toast.success("Đăng bình luận thành công")
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Không thể đăng bình luận")
    } finally {
      setReplyLoading(false)
    }
  }

  const handleReplyTo = (replyId: number) => {
    setReplyTo(replyId)
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.focus()
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const renderComment = (reply: ForumReplyType) => {
    return (
      <div key={reply.reply_id} className="border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" alt={reply.author.full_name || 'User'} />
            <AvatarFallback>{(reply.author.full_name || 'U').substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{reply.author.full_name || reply.author.username || "Ẩn danh"}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: vi })}
          </span>
          <Badge variant="outline" className="text-xs">
            {reply.author.role === "student" ? "Sinh viên" : 
             reply.author.role === "teacher" ? "Giảng viên" : 
             reply.author.role === "admin" ? "Quản trị viên" : 
             "Thành viên"}
          </Badge>
        </div>
        <div className="text-sm">{reply.content}</div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs"
            onClick={() => setReplyTo(reply.reply_id)}
          >
            Trả lời
          </Button>
          <Button variant="link" size="sm" className="px-0 text-xs">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Hữu ích
          </Button>
          <Button variant="link" size="sm" className="px-0 text-xs">
            <Flag className="h-3 w-3 mr-1" />
            Báo cáo
          </Button>
        </div>
        {/* Form trả lời */}
        {replyTo === reply.reply_id && (
          <form
            onSubmit={(e) => handleSubmitReply(e, reply.reply_id)}
            className="flex flex-col gap-2 mt-2"
          >
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập trả lời..."
              rows={2}
              required
              disabled={replyLoading}
              maxLength={MAX_REPLY_LENGTH}
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {replyContent.length}/{MAX_REPLY_LENGTH} ký tự
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={replyLoading || !replyContent.trim() || replyContent.length > MAX_REPLY_LENGTH}
                >
                  {replyLoading ? "Đang gửi..." : "Gửi trả lời"}
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setReplyTo(null)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </form>
        )}
        {/* Hiển thị replies nếu có */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="pl-4 mt-2 border-l space-y-2">
            {reply.replies.map((childReply) => renderComment(childReply))}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error || "Không tìm thấy bài viết"}</AlertDescription>
        </Alert>
      </div>
    )
  }

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
            <span>Bài viết</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant={post.category === "question" ? "default" : "outline"}>
              {post.category === "question"
                ? "Câu hỏi"
                : post.category === "discussion"
                  ? "Thảo luận"
                  : post.category === "resource"
                    ? "Tài nguyên"
                    : "Thông báo"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={post.author.full_name || 'User'} />
                    <AvatarFallback>{(post.author.full_name || 'U').substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{post.author.full_name}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: vi })}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.author.role === "student" ? "Sinh viên" : 
                       post.author.role === "teacher" ? "Giảng viên" : 
                       post.author.role === "admin" ? "Quản trị viên" : 
                       "Thành viên"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{post.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Hữu ích
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Báo cáo
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Trả lời ({replies.length})</h2>
              </div>

              {commentTree.length > 0 ? (
                <div className="space-y-4">
                  {commentTree.map((reply) => renderComment(reply))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Chưa có câu trả lời</AlertTitle>
                  <AlertDescription>Hãy là người đầu tiên trả lời câu hỏi này!</AlertDescription>
                </Alert>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Trả lời bài viết</h3>
                <form onSubmit={(e) => handleSubmitReply(e)} className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <Textarea 
                        placeholder="Viết câu trả lời của bạn..." 
                        className="min-h-[150px]"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        maxLength={MAX_REPLY_LENGTH}
                        required
                        disabled={isSubmitting}
                      />
                      <div className="text-sm text-muted-foreground mt-2 text-right">
                        {newReply.length}/{MAX_REPLY_LENGTH} ký tự
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <div className="text-sm text-muted-foreground">
                        Hỗ trợ định dạng Markdown và code blocks
                      </div>
                      <Button 
                        type="submit"
                        disabled={isSubmitting || !newReply.trim() || newReply.length > MAX_REPLY_LENGTH}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Đang gửi..." : "Gửi trả lời"}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Thống kê bài viết</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Trả lời</span>
                    </div>
                    <span>{replies.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Đăng lúc</span>
                    </div>
                    <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: vi })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Về tác giả</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={post.author.full_name || 'User'} />
                    <AvatarFallback>{(post.author.full_name || 'U').substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{post.author.full_name || 'User'}</div>
                      {post.author.status === "active" && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Đã kích hoạt 
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.author.role === "student" ? "Sinh viên" : 
                       post.author.role === "teacher" ? "Giảng viên" : 
                       post.author.role === "admin" ? "Quản trị viên" : 
                       "Thành viên"}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Chức vụ</span>
                    <span>{post.author.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ngày tham gia</span>
                    <span>
                      {post.author.created_at 
                        ? formatDistanceToNow(new Date(post.author.created_at), { addSuffix: true, locale: vi })
                        : "Chưa có thông tin"}
                    </span>
                  </div>
                  {post.author.last_login && (
                    <div className="flex items-center justify-between">
                      <span>Đăng nhập lần cuối</span>
                      <span>
                        {formatDistanceToNow(new Date(post.author.last_login), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}