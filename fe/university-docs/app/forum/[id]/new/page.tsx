"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getForum, createForumPost } from "@/lib/api/forum"
import { toast } from "sonner"
import type { Forum } from "@/types/forum"

export default function NewForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })
  const resolvedParams = use(params)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?callbackUrl=/forum/${resolvedParams.id}/new`)
      return
    }

    if (isAuthenticated) {
      loadForum()
    }
  }, [isLoading, isAuthenticated, router, resolvedParams.id])

  const loadForum = async () => {
    try {
      const forumData = await getForum(parseInt(resolvedParams.id))
      setForum(forumData)
    } catch (error) {
      console.error("Error loading forum data:", error)
      toast.error("Không thể tải thông tin diễn đàn")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết")
      return
    }
    
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết")
      return
    }

    try {
      setIsSubmitting(true)
      await createForumPost({
        forum_id: parseInt(resolvedParams.id),
        title: formData.title.trim(),
        content: formData.content.trim()
      })
      
      toast.success("Đăng bài viết thành công!")
      router.push(`/forum/${resolvedParams.id}`)
    } catch (error: any) {
      console.error("Error creating post:", error)
      toast.error(error.message || "Không thể đăng bài viết")
    } finally {
      setIsSubmitting(false)
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

  if (!forum) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="text-center">
          <p>Không tìm thấy diễn đàn</p>
          <Button asChild className="mt-4">
            <Link href="/forum">Quay lại danh sách diễn đàn</Link>
          </Button>
        </div>
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
            <Link href={`/forum/${resolvedParams.id}`} className="hover:underline">
              {forum.subject_name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Tạo bài viết mới</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tạo bài viết mới</h1>
              <p className="text-muted-foreground">Đăng bài viết trong diễn đàn {forum.subject_name}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/forum/${resolvedParams.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto w-full">
          <CardHeader>
            <CardTitle>Thông tin bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bài viết *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Viết nội dung bài viết của bạn..."
                  rows={10}
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Chia sẻ câu hỏi, thảo luận hoặc kiến thức của bạn về môn học này.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang đăng..." : "Đăng bài viết"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/forum/${resolvedParams.id}`}>
                    Hủy
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 