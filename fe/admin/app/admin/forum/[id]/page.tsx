"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowLeft } from "lucide-react"
import { getForumById, getEnhancedForumPosts, deleteForumPost, type Forum, type ForumPost } from "@/lib/api/forum"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AddPostDialog } from "@/components/admin/add-post-dialog"

interface ForumPostsTableProps {
  posts: ForumPost[]
  isLoading: boolean
  onDelete: (id: number) => Promise<void>
  onView: (id: number) => void
}

function ForumPostsTable({ posts, isLoading, onDelete, onView }: ForumPostsTableProps) {
  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.post_id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
              <Badge variant={post.status === "active" ? "default" : "secondary"}>
                {post.status === "active" ? "Hoạt động" : "Ẩn"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Đăng bởi: {post.user?.username || post.user?.full_name || `Người dùng #${post.user_id}`} • {new Date(post.created_at).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-3">{post.content}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(post.post_id)}>
                Xem chi tiết
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(post.post_id)}>
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ForumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const forumId = params?.id ? Number(params.id) : 0
  const [forum, setForum] = useState<Forum | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchForum = async () => {
    try {
      const data = await getForumById(forumId)
      setForum(data)
    } catch (error) {
      console.error("Error fetching forum:", error)
      toast.error("Không thể tải thông tin diễn đàn")
    }
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getEnhancedForumPosts({
        forum_id: forumId,
        status: status === "all" ? undefined : status
      })
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Không thể tải danh sách bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (forumId) {
      fetchForum()
    }
  }, [forumId])

  useEffect(() => {
    if (forumId) {
      fetchPosts()
    }
  }, [forumId, status])

  const handleDeletePost = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

    try {
      await deleteForumPost(id)
      toast.success("Đã xóa bài viết")
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Không thể xóa bài viết")
    }
  }

  const handleViewPost = (id: number) => {
    router.push(`/admin/forum/post/${id}`)
  }

  const handleBack = () => {
    router.push("/admin/forum")
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Diễn đàn môn học</h2>
          <p className="text-muted-foreground">{forum?.description}</p>
        </div>
        <AddPostDialog forumId={forumId} onSuccess={fetchPosts} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="hidden">Ẩn</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Lọc
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh sách bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <ForumPostsTable
            posts={filteredPosts}
            isLoading={isLoading}
            onDelete={handleDeletePost}
            onView={handleViewPost}
          />
        </CardContent>
      </Card>
    </div>
  )
} 