import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Danh sách ngành học</h1>
          <p className="text-muted-foreground">Khám phá tài liệu học tập theo ngành học và môn học</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm ngành học..." className="pl-9" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="overflow-hidden">
              <Link href={`/departments/${dept.slug}`}>
                <div className="h-40 bg-muted flex items-center justify-center">
                  <dept.icon className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <CardHeader>
                  <CardTitle>{dept.name}</CardTitle>
                  <CardDescription>{dept.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dept.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    {dept.courseCount} môn học • {dept.documentCount} tài liệu
                  </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
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
    tags: ["Lập trình", "Cơ sở dữ liệu", "Mạng máy tính"],
    courseCount: 42,
    documentCount: 358,
    icon: BookOpen,
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
    description: "Ngành học về quản lý tài chính, ngân hàng và đầu tư",
    tags: ["Tài chính", "Ngân hàng", "Đầu tư"],
    courseCount: 36,
    documentCount: 287,
    icon: BookOpen,
  },
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
    description: "Ngành học về kế toán, kiểm toán và quản lý tài chính doanh nghiệp",
    tags: ["Kế toán", "Kiểm toán", "Thuế"],
    courseCount: 30,
    documentCount: 245,
    icon: BookOpen,
  },
  {
    id: "4",
    name: "Quản trị kinh doanh",
    slug: "business",
    description: "Ngành học về quản lý doanh nghiệp, marketing và chiến lược kinh doanh",
    tags: ["Quản trị", "Marketing", "Chiến lược"],
    courseCount: 38,
    documentCount: 312,
    icon: BookOpen,
  },
  {
    id: "5",
    name: "Kinh tế",
    slug: "economics",
    description: "Ngành học về kinh tế học, phân tích kinh tế và chính sách công",
    tags: ["Kinh tế vĩ mô", "Kinh tế vi mô", "Thống kê"],
    courseCount: 32,
    documentCount: 276,
    icon: BookOpen,
  },
  {
    id: "6",
    name: "Luật",
    slug: "law",
    description: "Ngành học về pháp luật, tư pháp và các quy định pháp lý",
    tags: ["Luật dân sự", "Luật hình sự", "Luật thương mại"],
    courseCount: 34,
    documentCount: 298,
    icon: BookOpen,
  },
]
