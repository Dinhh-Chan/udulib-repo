"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Eye, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getForumPosts, deleteForumPost, type ForumPost } from "@/lib/api/forum"
import { AddPostDialog } from "./add-post-dialog"

interface ForumPostsTableProps {
  forumId: number
  page?: number
  per_page?: number
  onReload?: () => void
}

export function ForumPostsTable({ forumId, page = 1, per_page = 20, onReload }: ForumPostsTableProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getForumPosts({ 
        page, 
        per_page, 
        forum_id: forumId 
      })
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Không thể tải danh sách bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page, per_page, forumId])

  const handleView = (id: number) => {
    router.push(`/admin/forum/post/${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

    try {
      await deleteForumPost(id)
      toast.success("Đã xóa bài viết")
      fetchPosts()
      onReload?.()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Không thể xóa bài viết")
    }
  }

  const filteredPosts = posts.filter(post => {
    if (!post) return false
    const title = post.title || ""
    const content = post.content || ""
    const authorName = post.user?.full_name || ""
    const searchTermLower = searchTerm.toLowerCase()
    
    return title.toLowerCase().includes(searchTermLower) ||
           content.toLowerCase().includes(searchTermLower) ||
           authorName.toLowerCase().includes(searchTermLower)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <AddPostDialog forumId={forumId} onSuccess={fetchPosts} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Người đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có bài viết nào
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.post_id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.user?.full_name || "Không có tên"}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      post.status === "active" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {post.status === "active" ? "Hoạt động" : "Ẩn"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(post.post_id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.post_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
