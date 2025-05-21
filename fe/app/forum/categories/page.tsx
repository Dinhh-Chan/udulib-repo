import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, MessageSquare, Users, BookOpen, FileText, Lightbulb, Bell } from "lucide-react"

export default function ForumCategoriesPage() {
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
            <span>Danh mục</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục diễn đàn</h1>
          <p className="text-muted-foreground">Khám phá các chủ đề thảo luận theo danh mục</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Câu hỏi</CardTitle>
                  <CardDescription>Đặt câu hỏi và nhận câu trả lời</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">2 giờ trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=questions">Xem tất cả câu hỏi</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Thảo luận</CardTitle>
                  <CardDescription>Thảo luận về các chủ đề học tập</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">187</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">5 giờ trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=discussions">Xem tất cả thảo luận</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Tài nguyên</CardTitle>
                  <CardDescription>Chia sẻ tài nguyên học tập</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">132</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">1 ngày trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=resources">Xem tất cả tài nguyên</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>Thông báo từ quản trị viên</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">3 ngày trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=announcements">Xem tất cả thông báo</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Kinh nghiệm học tập</CardTitle>
                  <CardDescription>Chia sẻ kinh nghiệm học tập</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">98</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">2 ngày trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=experiences">Xem tất cả kinh nghiệm</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Mẹo và thủ thuật</CardTitle>
                  <CardDescription>Mẹo và thủ thuật học tập hiệu quả</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span>Tổng số bài viết:</span>
                  <span className="font-medium">76</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bài viết mới nhất:</span>
                  <span className="font-medium">4 ngày trước</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/forum?category=tips">Xem tất cả mẹo</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="flex justify-center mt-4">
          <Button asChild>
            <Link href="/forum/new">Tạo bài viết mới</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
