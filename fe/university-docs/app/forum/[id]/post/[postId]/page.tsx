"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ArrowLeft, MessageSquare, Eye, Clock, User, Reply, Heart, Bookmark, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { getForum, getForumPost, getForumReplies, createForumReply, createReplyToComment, getForumPosts } from "@/lib/api/forum"
import { toast } from "sonner"
import type { Forum, ForumPost, ForumReply } from "@/types/forum"
import { Separator } from "@/components/ui/separator"

export default function ForumPostDetailPage({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [allReplies, setAllReplies] = useState<ForumReply[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReplies, setTotalReplies] = useState(0)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyToCommentContent, setReplyToCommentContent] = useState("")
  const [isSubmittingReplyToComment, setIsSubmittingReplyToComment] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set())
  const [visibleReplies, setVisibleReplies] = useState(3) // Hiển thị 3 comments đầu tiên
  const [forumPostsCount, setForumPostsCount] = useState(0) // Số bài viết trong forum
  const [expandedNestedReplies, setExpandedNestedReplies] = useState<Set<number>>(new Set()) // Track nested replies expansion
  const resolvedParams = use(params)

  useEffect(() => {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Load post data khi đã đăng nhập
    if (isAuthenticated && resolvedParams?.id && resolvedParams?.postId) {
      loadPost()
    }
  }, [isLoading, isAuthenticated, resolvedParams?.id, resolvedParams?.postId, router])

  useEffect(() => {
    if (isAuthenticated && post) {
      loadReplies()
    }
  }, [isAuthenticated, post, currentPage])

  const loadPost = async () => {
    try {
      const [forumData, postData, forumPostsData] = await Promise.all([
        getForum(parseInt(resolvedParams.id)),
        getForumPost(parseInt(resolvedParams.postId)),
        getForumPosts(parseInt(resolvedParams.id))
      ])
      setForum(forumData)
      setPost(postData)
      setForumPostsCount(forumPostsData.length)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Không thể tải thông tin bài viết")
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadReplies = async () => {
    try {
      // Lấy tất cả replies một lần
      const repliesData = await getForumReplies(parseInt(resolvedParams.postId), 1, 1000)
      
      // Sắp xếp replies theo thời gian mới nhất trước
      const sortedReplies = repliesData.replies.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setAllReplies(sortedReplies)
      
      // Tính tổng số tất cả replies (bao gồm child replies)
      const countAllReplies = (repliesList: ForumReply[]): number => {
        let count = repliesList.length
        repliesList.forEach(reply => {
          if (reply.child_replies && reply.child_replies.length > 0) {
            count += countAllReplies(reply.child_replies)
          }
        })
        return count
      }
      
      const totalAllReplies = countAllReplies(sortedReplies)
      setTotalReplies(totalAllReplies)
      
      // Hiển thị replies theo số lượng visibleReplies
      setReplies(sortedReplies.slice(0, visibleReplies))
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

  const handleSubmitReplyToComment = async (e: React.FormEvent, replyId: number) => {
    e.preventDefault()
    
    if (!replyToCommentContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi")
      return
    }

    try {
      setIsSubmittingReplyToComment(true)
      await createReplyToComment(replyId, replyToCommentContent.trim())
      
      setReplyToCommentContent("")
      setReplyingTo(null)
      toast.success("Đăng phản hồi thành công!")
      
      // Reload replies để hiển thị phản hồi mới
      await loadReplies()
    } catch (error: any) {
      console.error("Error creating reply to comment:", error)
      toast.error(error.message || "Không thể đăng phản hồi")
    } finally {
      setIsSubmittingReplyToComment(false)
    }
  }

  const handleReplyClick = (replyId: number) => {
    setReplyingTo(replyId)
    setReplyToCommentContent("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyToCommentContent("")
  }

  const toggleReplyExpanded = (replyId: number) => {
    const newExpandedReplies = new Set(expandedReplies)
    if (newExpandedReplies.has(replyId)) {
      newExpandedReplies.delete(replyId)
    } else {
      newExpandedReplies.add(replyId)
    }
    setExpandedReplies(newExpandedReplies)
  }

  const loadMoreReplies = () => {
    const newVisibleCount = Math.min(visibleReplies + 5, allReplies.length)
    setVisibleReplies(newVisibleCount)
    setReplies(allReplies.slice(0, newVisibleCount))
  }

  const showLessReplies = () => {
    setVisibleReplies(3)
    setReplies(allReplies.slice(0, 3))
  }

  // Hàm để cắt ngắn nội dung
  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const toggleNestedRepliesExpanded = (replyId: number) => {
    const newExpandedNestedReplies = new Set(expandedNestedReplies)
    if (newExpandedNestedReplies.has(replyId)) {
      newExpandedNestedReplies.delete(replyId)
    } else {
      newExpandedNestedReplies.add(replyId)
    }
    setExpandedNestedReplies(newExpandedNestedReplies)
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!forum || !post) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-center">
          <p>Không tìm thấy bài viết</p>
          <Button asChild className="mt-4">
            <Link href="/forum">Quay lại diễn đàn</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-6 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/forum" className="hover:underline">Diễn đàn</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/forum/${resolvedParams.id}`} className="hover:underline">
            {forum.subject_name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate">{post.title}</span>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Post Card */}
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-border">
                    <AvatarImage src="/placeholder.svg" alt={post.author?.username || "Người dùng"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {post.author?.full_name?.substring(0, 2) || "ND"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{post.author?.full_name || "Người dùng"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">@{post.author?.username || "user"}</p>
                  </div>
                </div>

                {/* Post Title */}
                <h1 className="text-2xl font-bold mb-4 leading-tight">{post.title}</h1>

                {/* Post Content */}
                <div className="prose max-w-none mb-6 dark:prose-invert">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {isContentExpanded || post.content.length <= 300 
                      ? post.content 
                      : truncateContent(post.content, 300)
                    }
                  </p>
                  {post.content.length > 300 && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary hover:text-primary/80"
                      onClick={() => setIsContentExpanded(!isContentExpanded)}
                    >
                      {isContentExpanded ? "Thu gọn" : "Xem thêm"}
                    </Button>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Post Stats & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{totalReplies} bình luận</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>0 lượt xem</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      Thích
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reply Form */}
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                      BẠN
                    </AvatarFallback>
                  </Avatar>
                  <form onSubmit={handleSubmitReply} className="flex-1">
                    <Textarea
                      placeholder="Viết bình luận của bạn..."
                      rows={3}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="mb-3 resize-none"
                      required
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmittingReply}
                      >
                        {isSubmittingReply ? "Đang đăng..." : "Đăng bình luận"}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Bình luận ({totalReplies})</h3>
              </div>

              {replies.length > 0 ? (
                <>
                  {replies.map((reply) => (
                    <Card key={reply.reply_id} className="shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 ring-2 ring-border">
                            <AvatarImage src="/placeholder.svg" alt={reply.author?.username || "Người dùng"} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                              {reply.author?.full_name?.substring(0, 2) || "ND"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">{reply.author?.full_name || "Người dùng"}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(reply.created_at).toLocaleDateString("vi-VN", {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            
                            <div className="prose max-w-none mb-3 dark:prose-invert">
                              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                                {expandedReplies.has(reply.reply_id) || reply.content.length <= 200
                                  ? reply.content
                                  : truncateContent(reply.content, 200)
                                }
                              </p>
                              {reply.content.length > 200 && (
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto text-primary hover:text-primary/80 text-sm"
                                  onClick={() => toggleReplyExpanded(reply.reply_id)}
                                >
                                  {expandedReplies.has(reply.reply_id) ? "Thu gọn" : "Xem thêm"}
                                </Button>
                              )}
                            </div>
                            
                            {/* Comment Actions */}
                            <div className="flex items-center gap-4 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReplyClick(reply.reply_id)}
                                className="text-muted-foreground hover:text-primary p-0 h-auto"
                              >
                                <Reply className="h-4 w-4 mr-1" />
                                Phản hồi
                              </Button>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === reply.reply_id && (
                              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                                <form onSubmit={(e) => handleSubmitReplyToComment(e, reply.reply_id)} className="space-y-3">
                                  <Textarea
                                    placeholder={`Phản hồi ${reply.author?.full_name || "bình luận này"}...`}
                                    rows={3}
                                    value={replyToCommentContent}
                                    onChange={(e) => setReplyToCommentContent(e.target.value)}
                                    required
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      type="submit" 
                                      size="sm" 
                                      disabled={isSubmittingReplyToComment}
                                    >
                                      {isSubmittingReplyToComment ? "Đang đăng..." : "Đăng phản hồi"}
                                    </Button>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={handleCancelReply}
                                    >
                                      Hủy
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* Nested Replies */}
                            {reply.child_replies && reply.child_replies.length > 0 && (
                              <div className="mt-4 ml-6 border-l-2 border-border pl-4">
                                <div className="space-y-3">
                                  {/* Sắp xếp nested replies theo thời gian mới nhất và hiển thị 2 đầu tiên hoặc tất cả nếu đã expand */}
                                  {(expandedNestedReplies.has(reply.reply_id) 
                                    ? reply.child_replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                    : reply.child_replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2)
                                  ).map((nestedReply, index) => (
                                    <div 
                                      key={nestedReply.reply_id} 
                                      className={`flex gap-3 p-3 rounded-lg bg-muted/20 ${
                                        index > 0 ? 'border-t border-border/50' : ''
                                      }`}
                                    >
                                      <Avatar className="h-8 w-8 ring-1 ring-border/50">
                                        <AvatarImage src="/placeholder.svg" alt={nestedReply.author?.username || "Người dùng"} />
                                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs">
                                          {nestedReply.author?.full_name?.substring(0, 2) || "ND"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <p className="font-medium text-sm truncate">{nestedReply.author?.full_name || "Người dùng"}</p>
                                          <span className="text-xs text-muted-foreground">•</span>
                                          <p className="text-xs text-muted-foreground flex-shrink-0">
                                            {new Date(nestedReply.created_at).toLocaleDateString("vi-VN", {
                                              month: 'short',
                                              day: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </p>
                                        </div>
                                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                          {nestedReply.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Nút xem thêm/thu gọn nested replies */}
                                  {reply.child_replies.length > 2 && (
                                    <div className="pt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleNestedRepliesExpanded(reply.reply_id)}
                                        className="text-xs text-muted-foreground hover:text-primary h-auto p-2"
                                      >
                                        {expandedNestedReplies.has(reply.reply_id) ? (
                                          <>
                                            <ChevronUp className="h-3 w-3 mr-1" />
                                            Thu gọn phản hồi
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="h-3 w-3 mr-1" />
                                            Xem thêm {reply.child_replies.length - 2} phản hồi
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Load More/Less Buttons */}
                  {allReplies.length > 3 && (
                    <div className="flex justify-center gap-2 pt-4">
                      {visibleReplies < allReplies.length && (
                        <Button
                          variant="outline"
                          onClick={loadMoreReplies}
                          className="flex items-center gap-2"
                        >
                          <ChevronDown className="h-4 w-4" />
                          Xem thêm bình luận ({allReplies.length - visibleReplies} còn lại)
                        </Button>
                      )}
                      {visibleReplies > 3 && (
                        <Button
                          variant="outline"
                          onClick={showLessReplies}
                          className="flex items-center gap-2"
                        >
                          <ChevronUp className="h-4 w-4" />
                          Thu gọn
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Chưa có bình luận nào</p>
                    <p className="text-muted-foreground text-sm">Hãy là người đầu tiên bình luận về bài viết này!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Author Info */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin tác giả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16 ring-2 ring-border">
                    <AvatarImage src="/placeholder.svg" alt={post.author?.username || "Người dùng"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {post.author?.full_name?.substring(0, 2) || "ND"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg">{post.author?.full_name || "Người dùng"}</h4>
                    <p className="text-sm text-muted-foreground">@{post.author?.username || "user"}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vai trò:</span>
                    <span>{post.author?.role || "Sinh viên"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã trường:</span>
                    <span>{post.author?.university_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tham gia:</span>
                    <span>{new Date(post.author?.created_at).toLocaleDateString("vi-VN", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post Info */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin bài viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <Badge variant="secondary">{forum.subject_name}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đăng:</span>
                  <span>{new Date(post.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lượt xem:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bình luận:</span>
                  <span>{totalReplies}</span>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Button variant="outline" asChild className="w-full">
              <Link href={`/forum/${resolvedParams.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại diễn đàn
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}