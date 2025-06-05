"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Search, MessageSquare, Eye, ThumbsUp, Clock, User, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { getForum, getForumPosts } from "@/lib/api/forum"
import type { Forum, ForumPost } from "@/types/forum"

export default function ForumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isLoading, isAuthenticated, router, resolvedParams.id])

  const loadData = async () => {
    try {
      const [forumData, postsData] = await Promise.all([
        getForum(parseInt(resolvedParams.id)),
        getForumPosts(parseInt(resolvedParams.id))
      ])
      setForum(forumData)
      setPosts(postsData)
    } catch (error) {
      console.error("Error loading forum data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (isLoading || isLoadingData) {
    return <div>Đang tải...</div>
  }

  if (!forum) {
    return <div>Không tìm thấy diễn đàn</div>
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
            <Link href={`/forum/${resolvedParams.id}`} className="hover:underline">
              {forum.subject_name}
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{forum.subject_name}</h1>
              <p className="text-muted-foreground">Thảo luận và chia sẻ kiến thức về môn học</p>
            </div>
            <Button asChild>
              <Link href={`/forum/${resolvedParams.id}/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài viết mới
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm bài viết..." className="pl-9" />
          </div>

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Card key={post.post_id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/forum/${resolvedParams.id}/post/${post.post_id}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={"/placeholder.svg"} 
                          alt={post.author?.username || "Người dùng"} 
                        />
                        <AvatarFallback>
                          {post.author?.username?.substring(0, 2) || "ND"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                </CardContent>
                <CardContent className="flex justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author?.username || "Người dùng"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
