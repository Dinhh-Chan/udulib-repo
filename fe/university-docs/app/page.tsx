"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Upload, Users, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getPublicDocuments, Document } from "@/lib/api/documents"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        const response = await getPublicDocuments(1, 4)
        setRecentDocuments(response.documents || [])
      } catch (error) {
        console.error("Error fetching recent documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentDocuments()
  }, [])

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
            Hệ Thống Quản Lý Tài Liệu Học Tập
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Truy cập, chia sẻ và quản lý tài liệu học tập cho tất cả các ngành học một cách dễ dàng
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/departments">Khám phá tài liệu</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Đăng nhập để tải lên</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Tài liệu theo ngành</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tài liệu được phân loại theo ngành học, năm học và môn học giúp dễ dàng tìm kiếm
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/departments">Xem các ngành học</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Chia sẻ tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Đăng nhập và chia sẻ tài liệu học tập với cộng đồng sinh viên và giảng viên
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/upload">Tải lên tài liệu</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Tìm kiếm nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tìm kiếm tài liệu theo từ khóa, tên môn học hoặc tên tài liệu một cách nhanh chóng
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/search">Tìm kiếm tài liệu</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cộng đồng học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kết nối với cộng đồng sinh viên và giảng viên thông qua việc chia sẻ tài liệu
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/register">Tham gia ngay</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Recent Documents Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Tài liệu mới nhất</h2>
            <Button variant="outline" asChild>
              <Link href="/documents">Xem tất cả</Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="h-9 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentDocuments.map((doc) => (
                <Card key={doc.document_id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <span>{doc.subject?.subject_name}</span>
                      <span>•</span>
                      <span>{doc.file_type}</span>
                    </div>
                    <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{doc.file_type}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/documents/${doc.document_id}`}>Xem tài liệu</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Departments Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Ngành học phổ biến</h2>
            <Button variant="outline" asChild>
              <Link href="/departments">Xem tất cả</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDepartments.map((dept) => (
              <Card key={dept.id} className="overflow-hidden">
                <Link href={`/departments/${dept.slug}`}>
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <dept.icon className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <CardHeader>
                    <CardTitle>{dept.name}</CardTitle>
                    <CardDescription>{dept.description}</CardDescription>
                  </CardHeader>
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
      </section>

    {!isAuthenticated && (
      <section className="w-full py-12 md:py-24 bg-primary/5">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Bắt đầu chia sẻ tài liệu ngay hôm nay</h2>
          <p className="max-w-[600px] text-muted-foreground">
            Đăng ký tài khoản để tải lên và quản lý tài liệu học tập của bạn. Góp phần xây dựng thư viện tài liệu phong
            phú cho cộng đồng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/register">Đăng ký ngay</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/guide">Xem hướng dẫn</Link>
            </Button>
          </div>
        </div>
        </section>
      )}
    </div>
  )
}

// Sample data
const popularDepartments = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    slug: "it",
    description: "Ngành học về khoa học máy tính, phát triển phần mềm và hệ thống thông tin",
    courseCount: 42,
    documentCount: 358,
    icon: BookOpen,
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
    description: "Ngành học về quản lý tài chính, ngân hàng và đầu tư",
    courseCount: 36,
    documentCount: 287,
    icon: BookOpen,
  },
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
    description: "Ngành học về kế toán, kiểm toán và quản lý tài chính doanh nghiệp",
    courseCount: 30,
    documentCount: 245,
    icon: BookOpen,
  },
]
