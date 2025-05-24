import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronRight,
  Download,
  FileText,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DocumentPage({ params }: { params: { id: string } }) {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên params.id
  const document = documents.find((doc) => doc.id === params.id) || documents[0]
  const course = courses.find((c) => c.slug === document.courseSlug) || courses[0]
  const department = departments.find((d) => d.slug === course.departmentSlug) || departments[0]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/departments" className="hover:underline">
              Ngành học
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/departments/${department.slug}`} className="hover:underline">
              {department.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/departments/${department.slug}/courses/${course.slug}`} className="hover:underline">
              {course.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Tài liệu</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
          <p className="text-muted-foreground max-w-3xl">{document.description}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.fileType}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{document.fileSize}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.uploadDate}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{document.uploader}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-[500px] mb-4">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Xem trước tài liệu</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Tài liệu này có thể được xem trước trực tiếp trên trình duyệt.
                </p>
                <Button className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống để xem đầy đủ
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thích (24)
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bình luận (8)
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Báo cáo
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Bình luận (8)</h2>
              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{comment.author}</h4>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-auto py-0 px-2">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">{comment.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-auto py-0 px-2">
                              <span className="text-xs">Trả lời</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tải xuống tài liệu</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {document.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="text-sm font-medium">Đánh giá:</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-yellow-400 focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">(4.5/5 từ 28 đánh giá)</div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Đã có 256 lượt tải xuống</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Thông tin môn học</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Môn học</div>
                    <div className="text-sm text-muted-foreground">{course.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Ngành học</div>
                    <div className="text-sm text-muted-foreground">{department.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Năm học</div>
                    <div className="text-sm text-muted-foreground">Năm {course.year}</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/departments/${department.slug}/courses/${course.slug}`}>Xem tất cả tài liệu</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Tài liệu liên quan</h3>
                <div className="space-y-3">
                  {relatedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <Link
                          href={`/documents/${doc.id}`}
                          className="text-sm font-medium hover:underline line-clamp-1"
                        >
                          {doc.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {doc.fileType} • {doc.fileSize}
                        </div>
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
const departments = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    slug: "it",
    description: "Ngành học về khoa học máy tính, phát triển phần mềm và hệ thống thông tin",
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
    description: "Ngành học về quản lý tài chính, ngân hàng và đầu tư",
  },
]

const courses = [
  {
    id: "1",
    name: "Nhập môn lập trình",
    slug: "intro-to-programming",
    description: "Giới thiệu về lập trình cơ bản và thuật toán",
    departmentSlug: "it",
    year: 1,
    documentCount: 24,
  },
  {
    id: "2",
    name: "Cấu trúc dữ liệu và giải thuật",
    slug: "data-structures",
    description: "Học về các cấu trúc dữ liệu và thuật toán cơ bản",
    departmentSlug: "it",
    year: 1,
    documentCount: 18,
  },
]

interface Document {
  id: string
  title: string
  description: string
  courseSlug: string
  type: "lecture" | "exercise" | "exam"
  fileType: string
  fileSize: string
  uploadDate: string
  uploader: string
  tags?: string[]
}

const documents: Document[] = [
  {
    id: "1",
    title: "Giáo trình Nhập môn lập trình",
    description: "Giáo trình chính thức môn Nhập môn lập trình",
    courseSlug: "intro-to-programming",
    type: "lecture",
    fileType: "PDF",
    fileSize: "8.5 MB",
    uploadDate: "15/04/2023",
    uploader: "TS. Nguyễn Văn A",
    tags: ["Lý thuyết", "Tham khảo", "Giáo trình"],
  },
  {
    id: "2",
    title: "Slide bài giảng tuần 1-5",
    description: "Slide bài giảng từ tuần 1 đến tuần 5 môn Nhập môn lập trình",
    courseSlug: "intro-to-programming",
    type: "lecture",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    uploadDate: "20/04/2023",
    uploader: "TS. Nguyễn Văn A",
    tags: ["Lý thuyết", "Slide"],
  },
]

const comments = [
  {
    id: "1",
    author: "Nguyễn Văn X",
    date: "10/05/2023",
    content: "Tài liệu rất hữu ích, cảm ơn bạn đã chia sẻ!",
    likes: 5,
  },
  {
    id: "2",
    author: "Trần Thị Y",
    date: "11/05/2023",
    content: "Mình đang cần tài liệu này cho kỳ thi sắp tới, cảm ơn nhiều.",
    likes: 3,
  },
  {
    id: "3",
    author: "Lê Văn Z",
    date: "12/05/2023",
    content: "Có ai có thêm bài tập thực hành cho phần này không?",
    likes: 2,
  },
]

const relatedDocuments = [
  {
    id: "2",
    title: "Slide bài giảng tuần 1-5",
    fileType: "PPTX",
    fileSize: "5.2 MB",
  },
  {
    id: "3",
    title: "Bài tập thực hành số 1",
    fileType: "DOCX",
    fileSize: "2.3 MB",
  },
  {
    id: "4",
    title: "Đề thi giữa kỳ năm 2022",
    fileType: "PDF",
    fileSize: "1.8 MB",
  },
]
