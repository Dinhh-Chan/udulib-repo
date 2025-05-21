import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Book, FileText, Search, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Dữ liệu mẫu cho ngành học
const department = {
  id: 1,
  name: "Công nghệ thông tin",
  description: "Chương trình đào tạo về lập trình, phát triển phần mềm, mạng máy tính và an ninh mạng.",
  documentCount: 245,
  courseCount: 32,
  years: [
    {
      id: 1,
      name: "Năm 1",
      courses: [
        {
          id: 1,
          name: "Nhập môn lập trình",
          description: "Giới thiệu về lập trình, thuật toán và cấu trúc dữ liệu cơ bản.",
          documentCount: 24,
        },
        {
          id: 2,
          name: "Toán rời rạc",
          description: "Các khái niệm toán học cơ bản cho khoa học máy tính.",
          documentCount: 18,
        },
        {
          id: 3,
          name: "Kiến trúc máy tính",
          description: "Cấu trúc và nguyên lý hoạt động của máy tính.",
          documentCount: 15,
        },
        {
          id: 4,
          name: "Lập trình Python",
          description: "Ngôn ngữ lập trình Python và ứng dụng.",
          documentCount: 22,
        },
      ],
    },
    {
      id: 2,
      name: "Năm 2",
      courses: [
        {
          id: 5,
          name: "Cấu trúc dữ liệu và giải thuật",
          description: "Các cấu trúc dữ liệu và giải thuật nâng cao.",
          documentCount: 28,
        },
        {
          id: 6,
          name: "Cơ sở dữ liệu",
          description: "Thiết kế và quản lý cơ sở dữ liệu.",
          documentCount: 26,
        },
        {
          id: 7,
          name: "Lập trình hướng đối tượng",
          description: "Phương pháp lập trình hướng đối tượng với Java.",
          documentCount: 30,
        },
        {
          id: 8,
          name: "Mạng máy tính",
          description: "Nguyên lý và ứng dụng của mạng máy tính.",
          documentCount: 20,
        },
      ],
    },
    {
      id: 3,
      name: "Năm 3",
      courses: [
        {
          id: 9,
          name: "Phát triển ứng dụng web",
          description: "Phát triển ứng dụng web với HTML, CSS, JavaScript và các framework.",
          documentCount: 32,
        },
        {
          id: 10,
          name: "Trí tuệ nhân tạo",
          description: "Các thuật toán và ứng dụng của trí tuệ nhân tạo.",
          documentCount: 24,
        },
        {
          id: 11,
          name: "Phát triển ứng dụng di động",
          description: "Phát triển ứng dụng cho các thiết bị di động.",
          documentCount: 28,
        },
        {
          id: 12,
          name: "An ninh mạng",
          description: "Các nguyên tắc và kỹ thuật bảo mật thông tin.",
          documentCount: 22,
        },
      ],
    },
    {
      id: 4,
      name: "Năm 4",
      courses: [
        {
          id: 13,
          name: "Điện toán đám mây",
          description: "Kiến trúc và dịch vụ điện toán đám mây.",
          documentCount: 18,
        },
        {
          id: 14,
          name: "Học máy",
          description: "Các thuật toán và ứng dụng của học máy.",
          documentCount: 26,
        },
        {
          id: 15,
          name: "Phát triển phần mềm",
          description: "Quy trình và phương pháp phát triển phần mềm.",
          documentCount: 20,
        },
        {
          id: 16,
          name: "Khóa luận tốt nghiệp",
          description: "Hướng dẫn và yêu cầu cho khóa luận tốt nghiệp.",
          documentCount: 15,
        },
      ],
    },
  ],
}

export default function DepartmentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/departments" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách ngành học
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{department.name}</h1>
            <p className="text-muted-foreground max-w-2xl">{department.description}</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-1">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{department.documentCount} tài liệu</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">{department.courseCount} môn học</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Tìm kiếm môn học..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="1">
        <TabsList className="mb-6">
          {department.years.map((year) => (
            <TabsTrigger key={year.id} value={year.id.toString()}>
              {year.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {department.years.map((year) => (
          <TabsContent key={year.id} value={year.id.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {year.courses.map((course) => (
                <Link href={`/departments/${department.id}/courses/${course.id}`} key={course.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{course.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.documentCount} tài liệu</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="outline">Xem tài liệu</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
