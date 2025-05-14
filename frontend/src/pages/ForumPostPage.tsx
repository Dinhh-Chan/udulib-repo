
"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Separator } from "../../components/ui/separator"
import {
  ChevronRight,
  MessageSquare,
  Eye,
  ThumbsUp,
  Clock,
  User,
  Share2,
  Flag,
  ReplyIcon,
  Check,
  AlertTriangle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"

export default function ForumPostPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên id
  const post = forumPosts.find((p) => p.id === id) || forumPosts[0]

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
            <span>Bài viết</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant={post.category === "question" ? "default" : "outline"}>
              {post.category === "question"
                ? "Câu hỏi"
                : post.category === "discussion"
                  ? "Thảo luận"
                  : post.category === "resource"
                    ? "Tài nguyên"
                    : "Thông báo"}
            </Badge>
            <Link href={`/departments/${post.departmentSlug}`} className="text-sm text-muted-foreground hover:underline">
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

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{post.author}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Thành viên</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    {post.content ||
                      "Mình đang gặp khó khăn với bài tập về con trỏ trong C++. Cụ thể là bài tập yêu cầu tạo một mảng động và thực hiện các thao tác trên mảng đó."}
                  </p>
                  <p>{post.content2 || "Đoạn code của mình như sau:"}</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`int* arr = new int[5];
for (int i = 0; i < 5; i++) {
    arr[i] = i * 2;
}

// Thực hiện một số thao tác
// ...

delete[] arr;
// Tại sao sau khi delete, nếu tôi truy cập arr[0] lại gặp lỗi?`}
                    </code>
                  </pre>
                  <p>
                    {post.content3 ||
                      "Mình không hiểu tại sao khi giải phóng bộ nhớ bằng delete[] arr rồi, nếu tiếp tục truy cập arr[0] thì lại gặp lỗi? Làm thế nào để tránh lỗi này?"}
                  </p>
                  <p>{post.content4 || "Cảm ơn mọi người đã đọc và giúp đỡ!"}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Hữu ích ({post.likes})
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
              </CardFooter>
            </Card>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Trả lời ({post.replies})</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Sắp xếp theo:</span>
                  <Button variant="ghost" size="sm" className="h-8">
                    Mới nhất
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    Hữu ích nhất
                  </Button>
                </div>
              </div>

              {post.replies > 0 ? (
                <div className="flex flex-col gap-4">
                  {replies.map((reply) => (
                    <Card key={reply.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.author} />
                            <AvatarFallback>{reply.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{reply.author}</div>
                                {reply.isVerified && (
                                  <Badge variant="outline" className="text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    Giảng viên
                                  </Badge>
                                )}
                                {reply.isBestAnswer && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    <Check className="h-3 w-3 mr-1" />
                                    Câu trả lời hay nhất
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{reply.date}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">{reply.role}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{reply.content}</p>
                          {reply.code && (
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                              <code>{reply.code}</code>
                            </pre>
                          )}
                          {reply.content2 && <p>{reply.content2}</p>}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-6">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Hữu ích ({reply.likes})
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
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Chưa có câu trả lời</AlertTitle>
                  <AlertDescription>Hãy là người đầu tiên trả lời câu hỏi này!</AlertDescription>
                </Alert>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Trả lời bài viết</h3>
                <Card>
                  <CardContent className="pt-6">
                    <Textarea placeholder="Viết câu trả lời của bạn..." className="min-h-[150px]" />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <div className="text-sm text-muted-foreground">Hỗ trợ định dạng Markdown và code blocks</div>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Gửi trả lời
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Thống kê bài viết</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>Lượt xem</span>
                    </div>
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Trả lời</span>
                    </div>
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span>Đánh giá hữu ích</span>
                    </div>
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Đăng lúc</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Về tác giả</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-muted-foreground">Thành viên</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Bài viết</span>
                    <span>15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trả lời</span>
                    <span>42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ngày tham gia</span>
                    <span>01/01/2023</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Xem hồ sơ
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Bài viết liên quan</h3>
                <div className="space-y-3">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="flex flex-col gap-1">
                      <Link
                        href={`/forum/${relatedPost.id}`}
                        className="text-sm font-medium hover:underline line-clamp-2"
                      >
                        {relatedPost.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{relatedPost.author}</span>
                        <span>•</span>
                        <MessageSquare className="h-3 w-3" />
                        <span>{relatedPost.replies}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
interface ForumPost {
  id: string
  title: string
  excerpt: string
  content?: string
  content2?: string
  content3?: string
  content4?: string
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
]

interface Reply {
  id: string
  author: string
  authorAvatar?: string
  role: string
  date: string
  content: string
  code?: string
  content2?: string
  likes: number
  isVerified?: boolean
  isBestAnswer?: boolean
}

const replies: Reply[] = [
  {
    id: "1",
    author: "Trần Thị Y",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    role: "Sinh viên năm 3",
    date: "1 giờ trước",
    content:
      "Lỗi này xảy ra vì sau khi bạn gọi delete[] arr, bộ nhớ đã được giải phóng và con trỏ arr trở thành con trỏ treo (dangling pointer). Việc truy cập vào bộ nhớ đã giải phóng là không xác định và có thể gây ra lỗi.",
    content2:
      "Để tránh lỗi này, sau khi gọi delete[] arr, bạn nên gán arr = nullptr để đánh dấu rằng con trỏ không còn trỏ đến bộ nhớ hợp lệ nữa.",
    code: "int* arr = new int[5];\n// Sử dụng mảng\n// ...\ndelete[] arr;\narr = nullptr; // Gán nullptr sau khi giải phóng bộ nhớ",
    likes: 3,
    isVerified: false,
  },
  {
    id: "2",
    author: "Lê Văn Z",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    role: "Sinh viên năm 4",
    date: "45 phút trước",
    content:
      "Ngoài việc gán nullptr như bạn Trần Thị Y đã nói, tôi muốn bổ sung thêm rằng đây là một trong những lỗi phổ biến khi làm việc với con trỏ trong C++. Đây gọi là lỗi truy cập bộ nhớ đã giải phóng (use-after-free).",
    content2:
      "Trong các dự án lớn, bạn nên sử dụng các lớp quản lý bộ nhớ tự động như std::vector, std::unique_ptr hoặc std::shared_ptr để tránh các lỗi liên quan đến quản lý bộ nhớ thủ công.",
    code: "// Thay vì sử dụng mảng động thủ công\n// int* arr = neww int[5];\n\n// Sử dụng std::vector\nstd::vector<int> arr(5);\nfor (int i = 0; i < 5; i++) {\n    arr[i] = i * 2;\n}\n// Không cần phải lo lắng về việc giải phóng bộ nhớ",
    likes: 7,
    isVerified: false,
  },
  {
    id: "3",
    author: "TS. Nguyễn Văn A",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    role: "Giảng viên",
    date: "30 phút trước",
    content: "Cả hai bạn trên đều đưa ra những ý kiến rất hay. Tôi xin tổng hợp lại vấn đề và giải pháp:",
    content2:
      "1. Sau khi gọi delete[] arr, bộ nhớ được cấp phát bởi new[] đã được giải phóng, nhưng con trỏ arr vẫn giữ địa chỉ cũ. Truy cập vào địa chỉ này là không xác định (undefined behavior).\n\n2. Luôn gán nullptr cho con trỏ sau khi giải phóng bộ nhớ.\n\n3. Trong C++ hiện đại, hãy ưu tiên sử dụng các container của thư viện chuẩn (std::vector, std::array) hoặc smart pointer (std::unique_ptr, std::shared_ptr) thay vì quản lý bộ nhớ thủ công.\n\n4. Nếu bạn đang học về con trỏ, hãy nhớ rằng đây là kiến thức nền tảng quan trọng, nhưng trong thực tế lập trình, chúng ta thường tránh sử dụng new/delete trực tiếp.",
    likes: 12,
    isVerified: true,
    isBestAnswer: true,
  },
]

const relatedPosts = [
  {
    id: "7",
    title: "Làm thế nào để hiểu rõ về con trỏ trong C++?",
    author: "Phạm Văn M",
    replies: 8,
  },
  {
    id: "8",
    title: "Sự khác nhau giữa new/delete và malloc/free trong C++",
    author: "Hoàng Thị N",
    replies: 5,
  },
  {
    id: "9",
    title: "Tổng hợp các lỗi thường gặp khi làm việc với con trỏ",
    author: "Trần Văn P",
    replies: 15,
  },
  {
    id: "10",
    title: "Smart pointer trong C++ hiện đại",
    author: "Nguyễn Thị Q",
    replies: 10,
  },
]
