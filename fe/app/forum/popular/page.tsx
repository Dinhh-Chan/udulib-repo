import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Search, MessageSquare, Eye, ThumbsUp, Clock, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PopularForumPostsPage() {
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
            <span>Bài viết phổ biến</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bài viết phổ biến</h1>
          <p className="text-muted-foreground">Những bài viết được quan tâm nhiều nhất trên diễn đàn</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm bài viết..." className="pl-9" />
          </div>

          <Tabs defaultValue="week" className="w-full">
            <TabsList className="w-full max-w-[400px] grid grid-cols-3">
              <TabsTrigger value="week">Tuần này</TabsTrigger>
              <TabsTrigger value="month">Tháng này</TabsTrigger>
              <TabsTrigger value="alltime">Mọi lúc</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="mt-6">
              <div className="flex flex-col gap-4">
                {popularPosts.slice(0, 5).map((post) => (
                  <ForumPostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="month" className="mt-6">
              <div className="flex flex-col gap-4">
                {popularPosts.map((post) => (
                  <ForumPostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="alltime" className="mt-6">
              <div className="flex flex-col gap-4">
                {popularPosts
                  .sort((a, b) => b.views - a.views)
                  .map((post) => (
                    <ForumPostCard key={post.id} post={post} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-center mt-4">
            <Button variant="outline" className="mx-2">
              Trang trước
            </Button>
            <div className="flex items-center">
              <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                1
              </Button>
              <Button variant="default" className="h-8 w-8 p-0 mx-1">
                2
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                3
              </Button>
              <span className="mx-1">...</span>
              <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                10
              </Button>
            </div>
            <Button variant="outline" className="mx-2">
              Trang sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ForumPostCard({ post }: { post: ForumPost }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              <Link href={`/forum/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={post.category === "question" ? "default" : "outline"}>
                {post.category === "question"
                  ? "Câu hỏi"
                  : post.category === "discussion"
                    ? "Thảo luận"
                    : post.category === "resource"
                      ? "Tài nguyên"
                      : "Thông báo"}
              </Badge>
              <Link
                href={`/departments/${post.departmentSlug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {post.department}
              </Link>
              {post.course && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <Link
                    href={`/departments/${post.departmentSlug}/courses/${post.courseSlug}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {post.course}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
              <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.replies}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

interface ForumPost {
  id: string
  title: string
  excerpt: string
  author: string
  authorAvatar?: string
  date: string
  category: "question" | "discussion" | "resource" | "announcement"
  department: string
  departmentSlug: string
  course?: string
  courseSlug?: string
  tags?: string[]
  replies: number
  views: number
  likes: number
}

const popularPosts: ForumPost[] = [
  {
    id: "2",
    title: "Chia sẻ tài liệu ôn thi môn Cấu trúc dữ liệu và giải thuật",
    excerpt:
      "Mình vừa tổng hợp một số tài liệu ôn thi môn Cấu trúc dữ liệu và giải thuật. Bao gồm các bài tập, đề thi các năm trước và một số ghi chú quan trọng. Hy vọng sẽ giúp ích cho các bạn trong kỳ thi sắp tới...",
    author: "Trần Thị Y",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "Hôm qua",
    category: "resource",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Cấu trúc dữ liệu và giải thuật",
    courseSlug: "data-structures",
    tags: ["Tài liệu", "Ôn thi", "CTDL"],
    replies: 12,
    views: 230,
    likes: 45,
  },
  {
    id: "3",
    title: "Thảo luận về các framework JavaScript hiện đại",
    excerpt:
      "Hiện nay có rất nhiều framework JavaScript như React, Vue, Angular, Svelte... Mỗi framework đều có ưu và nhược điểm riêng. Mình muốn mở một cuộc thảo luận về việc nên chọn framework nào để học và áp dụng vào dự án...",
    author: "Lê Văn Z",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "3 ngày trước",
    category: "discussion",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Phát triển ứng dụng web",
    courseSlug: "web-development",
    tags: ["JavaScript", "Framework", "Web"],
    replies: 25,
    views: 320,
    likes: 18,
  },
  {
    id: "5",
    title: "Kinh nghiệm thực tập tại các công ty công nghệ lớn",
    excerpt:
      "Mình vừa hoàn thành kỳ thực tập 3 tháng tại một công ty công nghệ lớn. Mình muốn chia sẻ một số kinh nghiệm từ quá trình ứng tuyển, phỏng vấn đến làm việc thực tế. Hy vọng sẽ giúp ích cho các bạn đang chuẩn bị đi thực tập...",
    author: "Phạm Thị W",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "2 tuần trước",
    category: "discussion",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    tags: ["Thực tập", "Kinh nghiệm", "Công nghệ"],
    replies: 18,
    views: 380,
    likes: 42,
  },
  {
    id: "7",
    title: "Làm thế nào để hiểu rõ về con trỏ trong C++?",
    excerpt:
      "Mình đang gặp khó khăn trong việc hiểu về con trỏ trong C++. Mình đã đọc nhiều tài liệu nhưng vẫn cảm thấy khó hiểu. Ai có kinh nghiệm học C++ có thể chia sẻ cách học hiệu quả không?",
    author: "Phạm Văn M",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "1 tuần trước",
    category: "question",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Nhập môn lập trình",
    courseSlug: "intro-to-programming",
    tags: ["C++", "Con trỏ", "Lập trình"],
    replies: 8,
    views: 150,
    likes: 12,
  },
  {
    id: "8",
    title: "Sự khác nhau giữa new/delete và malloc/free trong C++",
    excerpt:
      "Mình muốn tìm hiểu sâu hơn về sự khác nhau giữa new/delete và malloc/free trong C++. Mình đã đọc một số tài liệu nhưng vẫn chưa hiểu rõ. Ai có thể giải thích chi tiết không?",
    author: "Hoàng Thị N",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "2 tuần trước",
    category: "question",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Lập trình hướng đối tượng",
    courseSlug: "oop",
    tags: ["C++", "Memory Management", "OOP"],
    replies: 5,
    views: 120,
    likes: 8,
  },
  {
    id: "9",
    title: "Tổng hợp các lỗi thường gặp khi làm việc với con trỏ",
    excerpt:
      "Mình vừa tổng hợp một số lỗi thường gặp khi làm việc với con trỏ trong C++ như memory leak, dangling pointer, null pointer dereference... Hy vọng sẽ giúp ích cho các bạn đang học lập trình.",
    author: "Trần Văn P",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "3 tuần trước",
    category: "resource",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Lập trình hướng đối tượng",
    courseSlug: "oop",
    tags: ["C++", "Con trỏ", "Debug"],
    replies: 15,
    views: 280,
    likes: 35,
  },
  {
    id: "10",
    title: "Smart pointer trong C++ hiện đại",
    excerpt:
      "Mình muốn chia sẻ về cách sử dụng smart pointer trong C++ hiện đại như unique_ptr, shared_ptr và weak_ptr. Đây là một cách hiệu quả để quản lý bộ nhớ và tránh memory leak.",
    author: "Nguyễn Thị Q",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "1 tháng trước",
    category: "resource",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Lập trình hướng đối tượng",
    courseSlug: "oop",
    tags: ["C++", "Smart Pointer", "Modern C++"],
    replies: 10,
    views: 200,
    likes: 28,
  },
]
