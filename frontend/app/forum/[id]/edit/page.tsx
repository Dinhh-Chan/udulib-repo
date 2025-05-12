"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import PostEditor from "@/components/forum/post-editor"

export default function EditForumPostPage({ params }: { params: { id: string } }) {
  // Trong thực tế, bạn sẽ lấy dữ liệu bài viết từ API dựa trên params.id
  const initialPost = {
    id: params.id,
    title: "Cách giải bài tập về con trỏ trong C++?",
    content:
      "Mình đang gặp khó khăn với bài tập về con trỏ trong C++. Cụ thể là bài tập yêu cầu tạo một mảng động và thực hiện các thao tác trên mảng đó.\n\nĐoạn code của mình như sau:\n\n```\nint* arr = new int[5];\nfor (int i = 0; i < 5; i++) {\n    arr[i] = i * 2;\n}\n\n// Thực hiện một số thao tác\n// ...\n\ndelete[] arr;\n// Tại sao sau khi delete, nếu tôi truy cập arr[0] lại gặp lỗi?\n```\n\nMình không hiểu tại sao khi giải phóng bộ nhớ bằng delete[] arr rồi, nếu tiếp tục truy cập arr[0] thì lại gặp lỗi? Làm thế nào để tránh lỗi này?\n\nCảm ơn mọi người đã đọc và giúp đỡ!",
    category: "question",
    department: "it",
    course: "intro-to-programming",
    tags: ["C++", "Con trỏ", "Bài tập"],
  }

  const [title, setTitle] = useState(initialPost.title)
  const [content, setContent] = useState(initialPost.content)
  const [category, setCategory] = useState(initialPost.category)
  const [department, setDepartment] = useState(initialPost.department)
  const [course, setCourse] = useState(initialPost.course)
  const [tags, setTags] = useState<string[]>(initialPost.tags)
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Giả lập quá trình cập nhật bài viết
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  const handleContentSubmit = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
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
            <Link href={`/forum/${params.id}`} className="hover:underline">
              Bài viết
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Chỉnh sửa</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h1>
          <p className="text-muted-foreground">Cập nhật thông tin và nội dung bài viết của bạn</p>
        </div>

        {isSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật thành công!</CardTitle>
              <CardDescription>Bài viết của bạn đã được cập nhật thành công.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Bài viết đã được cập nhật</AlertTitle>
                <AlertDescription>
                  Bài viết của bạn đã được cập nhật thành công và hiện đã có trên diễn đàn. Cảm ơn bạn đã đóng góp!
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/forum/${params.id}`}>Xem bài viết</Link>
              </Button>
              <Button asChild>
                <Link href="/forum">Quay lại diễn đàn</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
                <CardDescription>Chỉnh sửa thông tin bài viết của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề bài viết</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Loại bài viết</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Chọn loại bài viết" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Câu hỏi</SelectItem>
                      <SelectItem value="discussion">Thảo luận</SelectItem>
                      <SelectItem value="resource">Tài nguyên</SelectItem>
                      <SelectItem value="announcement">Thông báo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Ngành học</Label>
                    <Select value={department} onValueChange={setDepartment} required>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Chọn ngành học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">Công nghệ thông tin</SelectItem>
                        <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                        <SelectItem value="accounting">Kế toán</SelectItem>
                        <SelectItem value="business">Quản trị kinh doanh</SelectItem>
                        <SelectItem value="economics">Kinh tế</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Môn học (tùy chọn)</Label>
                    <Select value={course} onValueChange={setCourse}>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Chọn môn học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intro-to-programming">Nhập môn lập trình</SelectItem>
                        <SelectItem value="data-structures">Cấu trúc dữ liệu và giải thuật</SelectItem>
                        <SelectItem value="oop">Lập trình hướng đối tượng</SelectItem>
                        <SelectItem value="database">Cơ sở dữ liệu</SelectItem>
                        <SelectItem value="web-development">Phát triển ứng dụng web</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung bài viết</Label>
                  <PostEditor
                    initialValue={content}
                    placeholder="Viết nội dung bài viết của bạn..."
                    onSubmit={handleContentSubmit}
                    submitLabel="Cập nhật nội dung"
                    minHeight="300px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Thẻ tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Nhập thẻ tag"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lưu ý</AlertTitle>
                  <AlertDescription>
                    Bài viết của bạn sẽ được hiển thị công khai trên diễn đàn. Vui lòng tuân thủ quy tắc cộng đồng và
                    không đăng nội dung vi phạm bản quyền.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật bài viết"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </div>
  )
}
