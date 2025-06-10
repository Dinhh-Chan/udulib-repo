"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Upload, Users, Search, Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getPublicDocuments, Document } from "@/lib/api/documents"
import { getMajors } from "@/lib/api/major"
import { Major } from "@/types/major"
import { DocumentThumbnail } from "@/components/ui/document-thumbnail"
import { MajorImage } from "@/components/ui/major-image"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([])
  const [popularDepartments, setPopularDepartments] = useState<Major[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentsResponse, majorsResponse] = await Promise.all([
          getPublicDocuments(1, 4),
          getMajors(1, 4)
        ])
        setRecentDocuments(documentsResponse.documents || [])
        setPopularDepartments(majorsResponse)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
                <Link href="/documents">Tìm kiếm tài liệu</Link>
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
                <Link href="/forum">Tham gia ngay</Link>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg h-80">
                  {/* Thumbnail skeleton */}
                  <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
                    {/* Badge skeletons */}
                    <div className="absolute top-3 left-3">
                      <div className="h-5 bg-white/50 rounded-full w-20"></div>
                    </div>
                    <div className="absolute top-3 right-3 space-y-1">
                      <div className="h-5 bg-blue-500/50 rounded-full w-12"></div>
                      <div className="h-5 bg-green-500/50 rounded-full w-16"></div>
                    </div>
                  </div>
                  
                  {/* Content skeleton */}
                  <div className="p-4 h-40 space-y-2">
                    <div className="h-5 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    
                    {/* Footer skeleton */}
                    <div className="flex justify-between items-center pt-2 border-t border-muted/50 mt-auto">
                      <div className="flex gap-2">
                        <div className="h-3 bg-muted rounded w-8"></div>
                        <div className="h-3 bg-muted rounded w-8"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentDocuments.map((doc) => (
                <Link key={doc.document_id} href={`/documents/${doc.document_id}`}>
                  <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-80">
                    {/* Thumbnail Section - Thu nhỏ lại */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <DocumentThumbnail
                        documentId={doc.document_id}
                        title={doc.title}
                        fileType={doc.file_type}
                        size="large"
                        className="w-full h-full !w-full !h-full"
                      />
                      
                                              {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badges ở góc trên */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
                          {doc.file_type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
                          {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      
                      {/* Subject badge ở góc trái */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 dark:bg-gray-900/90 dark:text-white backdrop-blur-sm">
                          {doc.subject?.subject_name}
                        </span>
                      </div>
                    </div>
                    
                                                                {/* Content Section - Mở rộng thêm */}
                    <div className="p-4 h-40 flex flex-col">
                          {/* Title */}
                          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
                            {doc.title}
                          </h3>
                          
                          {/* Description - có thể hiển thị nhiều hơn */}
                          <p className="text-sm text-muted-foreground line-clamp-4 mb-3 flex-1 overflow-hidden" 
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 4,
                               WebkitBoxOrient: 'vertical',
                               textOverflow: 'ellipsis'
                             }}>
                            {doc.description}
                          </p>
                          
                          {/* Stats footer - luôn ở dưới cùng */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{doc.view_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                <span>{doc.download_count}</span>
                              </div>
                            </div>
                            
                            {/* Simple arrow */}
                            <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                    

                  </Card>
                </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDepartments.map((dept) => (
              <Card key={dept.major_id} className="overflow-hidden">
                <Link href={`/departments/${dept.major_id}`}>
                  <MajorImage 
                    majorId={dept.major_id}
                    majorName={dept.major_name}
                    className="h-40"
                  />
                  <CardHeader>
                    <CardTitle>{dept.major_name}</CardTitle>
                    <CardDescription>{dept.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      Mã ngành: {dept.major_code}
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
          )}
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
