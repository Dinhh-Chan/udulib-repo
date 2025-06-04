"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getForumPostById, getForumReplies, updateForumPost, deleteForumPost, deleteForumReply, type ForumPost, type ForumReply } from "@/lib/api/forum"
import { toast } from "sonner"
import { ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReplyCardProps {
  reply: ForumReply
  onDelete: (id: number) => Promise<void>
}

function ReplyCard({ reply, onDelete }: ReplyCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium">{reply.user?.full_name}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(reply.created_at).toLocaleDateString()}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(reply.reply_id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Xóa</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm">{reply.content}</p>
      </CardContent>
    </Card>
  )
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params?.id ? Number(params.id) : 0
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")

  const fetchPost = async () => {
    try {
      const data = await getForumPostById(postId)
      setPost(data)
      setStatus(data.status)
    } catch (error) {
      console.error("Error fetching post:", error)
      toast.error("Không thể tải thông tin bài viết")
    }
  }

  const fetchReplies = async () => {
    try {
      setIsLoading(true)
      const data = await getForumReplies({ post_id: postId })
      setReplies(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching replies:", error)
      toast.error("Không thể tải danh sách phản hồi")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchReplies()
    }
  }, [postId])

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateForumPost(postId, { status: newStatus })
      setStatus(newStatus)
      toast.success("Đã cập nhật trạng thái bài viết")
    } catch (error) {
      console.error("Error updating post status:", error)
      toast.error("Không thể cập nhật trạng thái")
    }
  }

  const handleDeletePost = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

    try {
      await deleteForumPost(postId)
      toast.success("Đã xóa bài viết")
      router.back()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Không thể xóa bài viết")
    }
  }

  const handleDeleteReply = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) return

    try {
      await deleteForumReply(id)
      toast.success("Đã xóa phản hồi")
      fetchReplies()
    } catch (error) {
      console.error("Error deleting reply:", error)
      toast.error("Không thể xóa phản hồi")
    }
  }

  if (!post) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                Đăng bởi: {post.user?.full_name} • {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="hidden">Ẩn</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="destructive" onClick={handleDeletePost}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa bài viết
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Phản hồi ({replies.length})</h3>
        {isLoading ? (
          <div>Đang tải phản hồi...</div>
        ) : replies.length === 0 ? (
          <div className="text-center text-muted-foreground">Chưa có phản hồi nào</div>
        ) : (
          replies.map((reply) => (
            <ReplyCard
              key={reply.reply_id}
              reply={reply}
              onDelete={handleDeleteReply}
            />
          ))
        )}
      </div>
    </div>
  )
} 