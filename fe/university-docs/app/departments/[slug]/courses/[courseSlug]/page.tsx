import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, Download, Eye, Calendar, User } from "lucide-react"

export default function CoursePage({
  params,
}: {
  params: { slug: string; courseSlug: string }
}) {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên params.slug và params.courseSlug
  const department = departments.find((d) => d.slug === params.slug) || departments[0]
  const course = courses.find((c) => c.slug === params.courseSlug && c.departmentSlug === params.slug) || courses[0]

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
            <span>{course.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-muted-foreground max-w-3xl">{course.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{course.documentCount} tài liệu</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Năm {course.year}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="lectures">Bài giảng</TabsTrigger>
            <TabsTrigger value="exercises">Bài tập</TabsTrigger>
            <TabsTrigger value="exams">Đề thi</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="flex flex-col gap-4">
              {documents
                .filter((doc) => doc.courseSlug === params.courseSlug)
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="lectures" className="mt-6">
            <div className="flex flex-col gap-4">
              {documents
                .filter((doc) => doc.courseSlug === params.courseSlug && doc.type === "lecture")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="exercises" className="mt-6">
            <div className="flex flex-col gap-4">
              {documents
                .filter((doc) => doc.courseSlug === params.courseSlug && doc.type === "exercise")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="exams" className="mt-6">
            <div className="flex flex-col gap-4">
              {documents
                .filter((doc) => doc.courseSlug === params.courseSlug && doc.type === "exam")
                .map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <CardDescription>{document.description}</CardDescription>
          </div>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
            {document.type === "lecture" ? "Bài giảng" : document.type === "exercise" ? "Bài tập" : "Đề thi"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{document.fileType}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{document.fileSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{document.uploadDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{document.uploader}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/documents/${document.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Link>
        </Button>
        <Button size="sm" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Tải xuống
        </Button>
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
  },
  {
    id: "3",
    title: "Bài tập thực hành số 1",
    description: "Bài tập thực hành lập trình C++ cơ bản",
    courseSlug: "intro-to-programming",
    type: "exercise",
    fileType: "DOCX",
    fileSize: "2.3 MB",
    uploadDate: "25/04/2023",
    uploader: "ThS. Trần Thị B",
  },
  {
    id: "4",
    title: "Đề thi giữa kỳ năm 2022",
    description: "Đề thi giữa kỳ môn Nhập môn lập trình năm 2022",
    courseSlug: "intro-to-programming",
    type: "exam",
    fileType: "PDF",
    fileSize: "1.8 MB",
    uploadDate: "30/04/2023",
    uploader: "Admin",
  },
  {
    id: "5",
    title: "Bài tập thực hành số 2",
    description: "Bài tập thực hành lập trình C++ nâng cao",
    courseSlug: "intro-to-programming",
    type: "exercise",
    fileType: "DOCX",
    fileSize: "3.1 MB",
    uploadDate: "05/05/2023",
    uploader: "ThS. Trần Thị B",
  },
  {
    id: "6",
    title: "Slide bài giảng tuần 6-10",
    description: "Slide bài giảng từ tuần 6 đến tuần 10 môn Nhập môn lập trình",
    courseSlug: "intro-to-programming",
    type: "lecture",
    fileType: "PPTX",
    fileSize: "6.7 MB",
    uploadDate: "10/05/2023",
    uploader: "TS. Nguyễn Văn A",
  },
]
