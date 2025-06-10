import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserForumPosts } from "@/lib/api/forum"
import { ForumPost } from "@/types/forum"
import { toast } from "sonner"

interface ForumTabProps {
  userId: number
}

export default function ForumTab({ userId }: ForumTabProps) {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [isLoadingForumPosts, setIsLoadingForumPosts] = useState(false)
  const [forumCurrentPage, setForumCurrentPage] = useState(1)
  const [forumTotalPages, setForumTotalPages] = useState(1)

  const fetchUserForumPosts = async () => {
    setIsLoadingForumPosts(true)
    try {
      const response = await getUserForumPosts(userId, forumCurrentPage, 5)
      setForumPosts(response.posts || [])
      setForumTotalPages(response.total_pages)
    } catch (error) {
      console.error("Error fetching forum posts:", error)
      toast.error("Không thể tải danh sách bài viết")
      setForumPosts([])
    } finally {
      setIsLoadingForumPosts(false)
    }
  }

  useEffect(() => {
    fetchUserForumPosts()
  }, [userId, forumCurrentPage])

  const handleDeleteForumPost = (postId: number) => {
    // Emit event để parent component xử lý
    const event = new CustomEvent('deleteForumPost', { detail: { postId } })
    window.dispatchEvent(event)
  }

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Bài viết diễn đàn</CardTitle>
        <CardDescription className="text-sm">Quản lý các bài viết bạn đã đăng trên diễn đàn</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingForumPosts ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : forumPosts && forumPosts.length > 0 ? (
          <>
            <div className="space-y-3 sm:space-y-4">
              {forumPosts.map((post) => (
                <div key={post.post_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    {post.status === "approved" ? (
                      <Link href={`/forum/posts/${post.post_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                        {post.title}
                      </Link>
                    ) : (
                      <span className="font-medium text-muted-foreground text-sm sm:text-base block truncate">
                        {post.title}
                      </span>
                    )}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <Badge variant={post.status === "approved" ? "default" : "secondary"} className="text-xs">
                        {post.status === "approved" ? "Đã duyệt" : 
                         post.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                      </Badge>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate max-w-[120px] sm:max-w-none">{(post as any).forum_name || "Diễn đàn"}</span>
                      {post.reply_count !== undefined && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{post.reply_count} trả lời</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                      {post.content.length > 100 && '...'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.status === "approved" && (
                      <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
                        <Link href={`/forum/posts/${post.post_id}`}>Xem</Link>
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteForumPost(post.post_id)}
                      className="text-xs sm:text-sm"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {forumTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForumCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={forumCurrentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Trước
                </Button>
                <span className="flex items-center px-4 text-sm">
                  Trang {forumCurrentPage} / {forumTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForumCurrentPage((prev) => Math.min(prev + 1, forumTotalPages))}
                  disabled={forumCurrentPage === forumTotalPages}
                  className="w-full sm:w-auto"
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
            Chưa có bài viết nào được đăng
          </div>
        )}
      </CardContent>
    </Card>
  )
} 