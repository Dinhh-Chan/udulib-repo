"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PostEditor from "@/components/forum/post-editor"

export default function ReplyToPostPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Trong thực tế, bạn sẽ lấy dữ liệu bài viết từ API dựa trên params.id
  const post = {
    id: params.id,
    title: "Cách giải bài tập về con trỏ trong C++?",
  }

  const handleSubmit = (content: string) => {
    setIsSubmitting(true)

    // Giả lập quá trình gửi trả lời
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
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
            <Link href={`/forum/${post.id}`} className="hover:underline">
              Bài viết
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Trả lời</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Trả lời bài viết</h1>
          <p className="text-muted-foreground">Viết câu trả lời của bạn cho bài viết: {post.title}</p>
        </div>

        {isSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Gửi trả lời thành công!</CardTitle>
              <CardDescription>Trả lời của bạn đã được gửi thành công.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Trả lời đã được gửi</AlertTitle>
                <AlertDescription>
                  Trả lời của bạn đã được gửi thành công và hiện đã có trên bài viết. Cảm ơn bạn đã đóng góp!
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/forum/${post.id}`}>Quay lại bài viết</Link>
              </Button>
              <Button asChild>
                <Link href="/forum">Quay lại diễn đàn</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Viết trả lời của bạn</CardTitle>
              <CardDescription>Chia sẻ kiến thức và góp ý của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <PostEditor
                placeholder="Viết trả lời của bạn..."
                onSubmit={handleSubmit}
                submitLabel={isSubmitting ? "Đang gửi..." : "Gửi trả lời"}
                minHeight="300px"
              />
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>Hỗ trợ định dạng Markdown và code blocks</div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
