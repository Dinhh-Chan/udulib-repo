"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, MessageSquare, Eye, ThumbsUp, Clock, User, Share2, Flag, ReplyIcon, Check, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { getForum, getForumPost, getForumReplies } from "@/lib/api/forum"
import type { Forum, ForumPost, ForumReply } from "@/types/forum"

export default function ForumPostPage({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
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

  const loadData = async () => {
    try {
      const [forumData, postData, repliesData] = await Promise.all([
        getForum(parseInt(resolvedParams.id)),
        getForumPost(parseInt(resolvedParams.postId)),
        getForumReplies(parseInt(resolvedParams.postId))
      ])
      setForum(forumData)
      setPost(postData)
      setReplies(repliesData)
    } catch (error) {
      console.error("Error loading post data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (isLoading || isLoadingData) {
    return <div>Đang tải...</div>
  }

  if (!forum || !post) {
    return <div>Không tìm thấy bài viết</div>
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
            <ChevronRight className="h-4 w-4" />
            <span>Bài viết</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={post.author?.avatar_url || "/placeholder.svg"} 
                      alt={post.author?.username || "Người dùng"} 
                    />
                    <AvatarFallback>
                      {post.author?.username?.substring(0, 2) || "ND"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{post.author?.username || "Người dùng"}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{post.content}</p>
                </div>
              </CardContent>
              <CardContent className="flex justify-between border-t pt-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Hữu ích (0)
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
              </CardContent>
            </Card>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Bình luận ({replies.length})</h2>
              </div>

              {replies.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {replies.map((reply) => (
                    <Card key={reply.reply_id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={reply.author?.avatar_url || "/placeholder.svg"} 
                              alt={reply.author?.username || "Người dùng"} 
                            />
                            <AvatarFallback>
                              {reply.author?.username?.substring(0, 2) || "ND"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{reply.author?.username || "Người dùng"}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(reply.created_at).toLocaleDateString("vi-VN")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{reply.content}</p>
                        </div>
                      </CardContent>
                      <CardContent className="flex justify-between border-t pt-6">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Hữu ích (0)
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ReplyIcon className="h-4 w-4 mr-2" />
                            Trả lời
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4 mr-2" />
                          Báo cáo
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Chưa có bình luận</AlertTitle>
                  <AlertDescription>Hãy là người đầu tiên bình luận!</AlertDescription>
                </Alert>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Viết bình luận</h3>
                <Card>
                  <CardContent className="pt-6">
                    <Textarea placeholder="Viết bình luận của bạn..." className="min-h-[150px]" />
                  </CardContent>
                  <CardContent className="flex justify-between border-t pt-6">
                    <div className="text-sm text-muted-foreground">Hỗ trợ định dạng Markdown và code blocks</div>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Gửi bình luận
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 