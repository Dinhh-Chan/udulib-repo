import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Book, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Dữ liệu mẫu cho ngành học
const departments = [
  {
    id: 1,
    name: "Công nghệ thông tin",
    description: "Chương trình đào tạo về lập trình, phát triển phần mềm, mạng máy tính và an ninh mạng.",
    documentCount: 245,
    courseCount: 32,
  },
  {
    id: 2,
    name: "Tài chính - Ngân hàng",
    description: "Chương trình đào tạo về quản lý tài chính, ngân hàng, đầu tư và thị trường chứng khoán.",
    documentCount: 187,
    courseCount: 28,
  },
  {
    id: 3,
    name: "Kế toán",
    description: "Chương trình đào tạo về kế toán doanh nghiệp, kiểm toán và quản lý tài chính.",
    documentCount: 156,
    courseCount: 24,
  },
  {
    id: 4,
    name: "Marketing",
    description:
      "Chương trình đào tạo về chiến lược marketing, quảng cáo, nghiên cứu thị trường và hành vi người tiêu dùng.",
    documentCount: 132,
    courseCount: 22,
  },
  {
    id: 5,
    name: "Quản trị kinh doanh",
    description: "Chương trình đào tạo về quản lý doanh nghiệp, chiến lược kinh doanh và phát triển tổ chức.",
    documentCount: 198,
    courseCount: 30,
  },
  {
    id: 6,
    name: "Ngôn ngữ Anh",
    description: "Chương trình đào tạo về ngôn ngữ, văn hóa và giao tiếp tiếng Anh.",
    documentCount: 124,
    courseCount: 26,
  },
  {
    id: 7,
    name: "Luật",
    description: "Chương trình đào tạo về luật dân sự, luật hình sự, luật thương mại và luật quốc tế.",
    documentCount: 145,
    courseCount: 28,
  },
  {
    id: 8,
    name: "Kỹ thuật điện - điện tử",
    description: "Chương trình đào tạo về kỹ thuật điện, điện tử, tự động hóa và hệ thống điều khiển.",
    documentCount: 167,
    courseCount: 30,
  },
  {
    id: 9,
    name: "Y khoa",
    description: "Chương trình đào tạo về y học, chăm sóc sức khỏe và y tế công cộng.",
    documentCount: 210,
    courseCount: 36,
  },
  {
    id: 10,
    name: "Kiến trúc",
    description: "Chương trình đào tạo về thiết kế kiến trúc, quy hoạch đô thị và bảo tồn di sản.",
    documentCount: 134,
    courseCount: 26,
  },
  {
    id: 11,
    name: "Báo chí - Truyền thông",
    description: "Chương trình đào tạo về báo chí, truyền thông đại chúng và quan hệ công chúng.",
    documentCount: 123,
    courseCount: 24,
  },
  {
    id: 12,
    name: "Du lịch - Khách sạn",
    description: "Chương trình đào tạo về quản lý du lịch, khách sạn và dịch vụ lữ hành.",
    documentCount: 112,
    courseCount: 22,
  },
]

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Danh sách ngành học</h1>
          <p className="text-muted-foreground">Khám phá các ngành học và tài liệu học tập liên quan</p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm ngành học..." className="pl-10 w-full md:w-[300px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Link href={`/departments/${department.id}`} key={department.id}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{department.name}</CardTitle>
                <CardDescription className="line-clamp-2">{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{department.documentCount} tài liệu</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{department.courseCount} môn học</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">Xem chi tiết</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
