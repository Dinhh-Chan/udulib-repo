import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, BookOpen } from "lucide-react"

export default function DepartmentPage({ params }: { params: { slug: string } }) {
  // Trong thực tế, bạn sẽ lấy dữ liệu từ API dựa trên params.slug
  const department = departments.find((d) => d.slug === params.slug) || departments[0]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/departments" className="hover:underline">
              Ngành học
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{department.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
          <p className="text-muted-foreground max-w-3xl">{department.description}</p>
        </div>

        <Tabs defaultValue="year1" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="year1">Năm 1</TabsTrigger>
            <TabsTrigger value="year2">Năm 2</TabsTrigger>
            <TabsTrigger value="year3">Năm 3</TabsTrigger>
            <TabsTrigger value="year4">Năm 4</TabsTrigger>
          </TabsList>
          {["year1", "year2", "year3", "year4"].map((year, yearIndex) => (
            <TabsContent key={year} value={year} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses
                  .filter((course) => course.departmentSlug === department.slug && course.year === yearIndex + 1)
                  .map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{course.documentCount} tài liệu</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/departments/${department.slug}/courses/${course.slug}`}>Xem tài liệu</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              {courses.filter((course) => course.departmentSlug === department.slug && course.year === yearIndex + 1)
                .length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">Chưa có môn học nào</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Hiện chưa có môn học nào được thêm vào năm học này. Vui lòng kiểm tra lại sau.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
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
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
    description: "Ngành học về kế toán, kiểm toán và quản lý tài chính doanh nghiệp",
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
  {
    id: "3",
    name: "Toán rời rạc",
    slug: "discrete-math",
    description: "Các khái niệm toán học cơ bản cho khoa học máy tính",
    departmentSlug: "it",
    year: 1,
    documentCount: 15,
  },
  {
    id: "4",
    name: "Lập trình hướng đối tượng",
    slug: "oop",
    description: "Nguyên lý và kỹ thuật lập trình hướng đối tượng",
    departmentSlug: "it",
    year: 2,
    documentCount: 22,
  },
  {
    id: "5",
    name: "Cơ sở dữ liệu",
    slug: "database",
    description: "Thiết kế và quản lý cơ sở dữ liệu",
    departmentSlug: "it",
    year: 2,
    documentCount: 20,
  },
  {
    id: "6",
    name: "Mạng máy tính",
    slug: "computer-networks",
    description: "Nguyên lý và kiến trúc mạng máy tính",
    departmentSlug: "it",
    year: 2,
    documentCount: 16,
  },
  {
    id: "7",
    name: "Phát triển ứng dụng web",
    slug: "web-development",
    description: "Kỹ thuật phát triển ứng dụng web hiện đại",
    departmentSlug: "it",
    year: 3,
    documentCount: 25,
  },
  {
    id: "8",
    name: "Trí tuệ nhân tạo",
    slug: "artificial-intelligence",
    description: "Giới thiệu về trí tuệ nhân tạo và học máy",
    departmentSlug: "it",
    year: 3,
    documentCount: 19,
  },
  {
    id: "9",
    name: "Bảo mật thông tin",
    slug: "information-security",
    description: "Các nguyên lý và kỹ thuật bảo mật thông tin",
    departmentSlug: "it",
    year: 4,
    documentCount: 17,
  },
  {
    id: "10",
    name: "Đồ án tốt nghiệp",
    slug: "graduation-project",
    description: "Dự án tốt nghiệp cuối khóa",
    departmentSlug: "it",
    year: 4,
    documentCount: 12,
  },
  // Các môn học cho ngành Tài chính
  {
    id: "11",
    name: "Kinh tế vĩ mô",
    slug: "macroeconomics",
    description: "Nguyên lý kinh tế vĩ mô cơ bản",
    departmentSlug: "finance",
    year: 1,
    documentCount: 20,
  },
  {
    id: "12",
    name: "Kinh tế vi mô",
    slug: "microeconomics",
    description: "Nguyên lý kinh tế vi mô cơ bản",
    departmentSlug: "finance",
    year: 1,
    documentCount: 18,
  },
]
