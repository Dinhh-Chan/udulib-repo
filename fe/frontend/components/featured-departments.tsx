import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Book, FileText } from "lucide-react"

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
]

export default function FeaturedDepartments() {
  return (
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
  )
}
