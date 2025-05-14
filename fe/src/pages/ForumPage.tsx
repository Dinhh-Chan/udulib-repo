
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { ChevronRight, Search, MessageSquare, Eye, ThumbsUp, Clock, User, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export default function ForumPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Diễn đàn thảo luận</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Diễn đàn thảo luận</h1>
              <p className="text-muted-foreground">Thảo luận, hỏi đáp và chia sẻ kinh nghiệm học tập</p>
            </div>
            <Button asChild>
              <Link href="/forum/new">
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài viết mới
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/forum">Tất cả bài viết</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/forum?category=questions">Câu hỏi</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/forum?category=discussions">Thảo luận</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/forum?category=resources">Tài nguyên</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/forum?category=announcements">Thông báo</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ngành học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {departments.map((dept) => (
                  <Button key={dept.id} variant="ghost" className="w-full justify-start" asChild>
                    <Link href={`/forum?department=${dept.slug}`}>{dept.name}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Thẻ phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Lập trình", "Đề thi", "Bài tập", "Tài liệu", "Kinh nghiệm", "Thực tập", "Đồ án", "Hỏi đáp"].map(
                    (tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                        {tag}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm bài viết..." className="pl-9" />
              </div>

              <Tabs defaultValue="latest" className="w-full">
                <TabsList className="w-full max-w-[400px] grid grid-cols-3">
                  <TabsTrigger value="latest">Mới nhất</TabsTrigger>
                  <TabsTrigger value="popular">Phổ biến</TabsTrigger>
                  <TabsTrigger value="unanswered">Chưa trả lời</TabsTrigger>
                </TabsList>
                <TabsContent value="latest" className="mt-6">
                  <div className="flex flex-col gap-4">
                    {forumPosts.map((post) => (
                      <ForumPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="popular" className="mt-6">
                  <div className="flex flex-col gap-4">
                    {forumPosts
                      .sort((a, b) => b.views - a.views)
                      .map((post) => (
                        <ForumPostCard key={post.id} post={post} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="unanswered" className="mt-6">
                  <div className="flex flex-col gap-4">
                    {forumPosts
                      .filter((post) => post.replies === 0)
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

// Sample data
const departments = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    slug: "it",
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
  },
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
  },
  {
    id: "4",
    name: "Quản trị kinh doanh",
    slug: "business",
  },
  {
    id: "5",
    name: "Kinh tế",
    slug: "economics",
  },
]

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

const forumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Cách giải bài tập về con trỏ trong C++?",
    excerpt:
      "Mình đang gặp khó khăn với bài tập về con trỏ trong C++. Cụ thể là bài tập yêu cầu tạo một mảng động và thực hiện các thao tác trên mảng đó. Mình không hiểu tại sao khi giải phóng bộ nhớ lại gặp lỗi...",
    author: "Nguyễn Văn X",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "2 giờ trước",
    category: "question",
    department: "Công nghệ thông tin",
    departmentSlug: "it",
    course: "Nhập môn lập trình",
    courseSlug: "intro-to-programming",
    tags: ["C++", "Con trỏ", "Bài tập"],
    replies: 3,
    views: 45,
    likes: 5,
  },
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
    id: "4",
    title: "Thông báo lịch thi cuối kỳ môn Kinh tế vĩ mô",
    excerpt:
      "Thông báo đến các bạn sinh viên về lịch thi cuối kỳ môn Kinh tế vĩ mô. Kỳ thi sẽ diễn ra vào ngày 15/06/2023, từ 8h00 đến 9h30 tại phòng A101. Sinh viên cần mang theo thẻ sinh viên và các vật dụng cần thiết...",
    author: "Admin",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "1 tuần trước",
    category: "announcement",
    department: "Kinh tế",
    departmentSlug: "economics",
    course: "Kinh tế vĩ mô",
    courseSlug: "macroeconomics",
    tags: ["Thông báo", "Lịch thi"],
    replies: 5,
    views: 450,
    likes: 0,
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
    id: "6",
    title: "Cần giúp đỡ về bài tập kế toán tài chính",
    excerpt:
      "Mình đang gặp khó khăn với bài tập về kế toán tài chính, cụ thể là phần tính toán khấu hao tài sản cố định. Mình không hiểu cách áp dụng các phương pháp khấu hao khác nhau. Ai có kinh nghiệm giúp mình với...",
    author: "Hoàng Văn T",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    date: "2 tuần trước",
    category: "question",
    department: "Kế toán",
    departmentSlug: "accounting",
    course: "Kế toán tài chính",
    courseSlug: "financial-accounting",
    tags: ["Kế toán", "Bài tập", "Khấu hao"],
    replies: 0,
    views: 25,
    likes: 0,
  },
]
