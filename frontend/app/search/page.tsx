"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, SearchIcon, FileText, Download, Calendar, User, Filter } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Document[]>(documents)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Tìm kiếm tài liệu</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Tìm kiếm tài liệu</h1>
          <p className="text-muted-foreground">Tìm kiếm tài liệu học tập theo từ khóa, ngành học, môn học</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Bộ lọc cho màn hình lớn */}
          <div className="hidden md:block w-64 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Ngành học</h3>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center space-x-2">
                        <Checkbox id={`dept-${dept.id}`} />
                        <Label htmlFor={`dept-${dept.id}`} className="text-sm font-normal">
                          {dept.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Năm học</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((year) => (
                      <div key={year} className="flex items-center space-x-2">
                        <Checkbox id={`year-${year}`} />
                        <Label htmlFor={`year-${year}`} className="text-sm font-normal">
                          Năm {year}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Loại tài liệu</h3>
                  <div className="space-y-2">
                    {["Bài giảng", "Bài tập", "Đề thi", "Tài liệu tham khảo"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} />
                        <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Định dạng file</h3>
                  <div className="space-y-2">
                    {["PDF", "DOCX", "PPTX", "JPG/PNG", "ZIP"].map((format) => (
                      <div key={format} className="flex items-center space-x-2">
                        <Checkbox id={`format-${format}`} />
                        <Label htmlFor={`format-${format}`} className="text-sm font-normal">
                          {format}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Đánh giá</h3>
                    <span className="text-sm text-muted-foreground">≥ 4.0</span>
                  </div>
                  <Slider defaultValue={[4]} max={5} step={0.5} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Thẻ tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Lý thuyết", "Thực hành", "Thi cuối kỳ", "Thi giữa kỳ", "Đồ án", "Tham khảo"].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Áp dụng bộ lọc</Button>
              </CardContent>
            </Card>
          </div>

          {/* Bộ lọc cho màn hình nhỏ */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                <SheetDescription>Lọc tài liệu theo các tiêu chí</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Ngành học</h3>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-dept-${dept.id}`} />
                        <Label htmlFor={`mobile-dept-${dept.id}`} className="text-sm font-normal">
                          {dept.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Năm học</h3>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((year) => (
                      <div key={year} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-year-${year}`} />
                        <Label htmlFor={`mobile-year-${year}`} className="text-sm font-normal">
                          Năm {year}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Loại tài liệu</h3>
                  <div className="space-y-2">
                    {["Bài giảng", "Bài tập", "Đề thi", "Tài liệu tham khảo"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`mobile-type-${type}`} />
                        <Label htmlFor={`mobile-type-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                  Áp dụng bộ lọc
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <div className="flex flex-col gap-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm tài liệu..." className="pl-9" />
              </div>

              <div className="flex items-center justify-between">
                <Tabs defaultValue="relevance" className="w-full max-w-[400px]">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="relevance">Liên quan</TabsTrigger>
                    <TabsTrigger value="newest">Mới nhất</TabsTrigger>
                    <TabsTrigger value="popular">Phổ biến</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Liên quan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Liên quan</SelectItem>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="popular">Phổ biến nhất</SelectItem>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {searchResults.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            <Link href={`/documents/${doc.id}`} className="hover:underline">
                              {doc.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>{doc.description}</CardDescription>
                        </div>
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                          {doc.type === "lecture"
                            ? "Bài giảng"
                            : doc.type === "exercise"
                              ? "Bài tập"
                              : doc.type === "exam"
                                ? "Đề thi"
                                : "Tài liệu"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{doc.fileType}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{doc.fileSize}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{doc.uploadDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{doc.uploader}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {doc.tags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/documents/${doc.id}`}>Xem chi tiết</Link>
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center mt-4">
                <Button variant="outline" className="mx-2">
                  Trang trước
                </Button>
                <div className="flex items-center">
                  <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                    1
                  </Button>
                  <Button variant="default" className="h-8 w-8 p-0 mx-1">
                    2
                  </Button>
                  <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                    3
                  </Button>
                  <span className="mx-1">...</span>
                  <Button variant="outline" className="h-8 w-8 p-0 mx-1">
                    10
                  </Button>
                </div>
                <Button variant="outline" className="mx-2">
                  Trang sau
                </Button>
              </div>
            </div>
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
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
  },
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
  },
  {
    id: "4",
    name: "Quản trị kinh doanh",
    slug: "business",
  },
  {
    id: "5",
    name: "Kinh tế",
    slug: "economics",
  },
]

interface Document {
  id: string
  title: string
  description: string
  courseSlug: string
  type: "lecture" | "exercise" | "exam" | "reference"
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
    tags: ["Lý thuyết", "Tham khảo"],
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
    tags: ["Thực hành", "Bài tập"],
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
    tags: ["Thi giữa kỳ", "Đề thi"],
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
    tags: ["Thực hành", "Bài tập", "Nâng cao"],
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
    tags: ["Lý thuyết", "Slide"],
  },
]
