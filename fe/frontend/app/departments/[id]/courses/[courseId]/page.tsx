import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, Download, Calendar, ArrowLeft, Search, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dữ liệu mẫu cho môn học và tài liệu
const course = {
  id: 9,
  name: "Phát triển ứng dụng web",
  description: "Phát triển ứng dụng web với HTML, CSS, JavaScript và các framework.",
  department: {
    id: 1,
    name: "Công nghệ thông tin",
  },
  year: {
    id: 3,
    name: "Năm 3",
  },
  documentCount: 32,
}

// Dữ liệu mẫu cho tài liệu
const documents = [
  {
    id: 1,
    title: "Giáo trình HTML, CSS cơ bản",
    description: "Tài liệu hướng dẫn HTML, CSS từ cơ bản đến nâng cao cho sinh viên.",
    tags: ["Giáo trình", "Lý thuyết"],
    uploadDate: "2023-05-10",
    views: 1245,
    downloads: 567,
    fileType: "PDF",
    uploader: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Bài tập JavaScript",
    description: "Tập hợp các bài tập và đáp án cho phần JavaScript.",
    tags: ["Bài tập", "Thực hành"],
    uploadDate: "2023-05-09",
    views: 876,
    downloads: 432,
    fileType: "DOCX",
    uploader: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Slide bài giảng ReactJS",
    description: "Slide bài giảng về ReactJS bao gồm lý thuyết và ví dụ thực hành.",
    tags: ["Slide", "Lý thuyết"],
    uploadDate: "2023-05-08",
    views: 987,
    downloads: 543,
    fileType: "PPTX",
    uploader: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Đề thi giữa kỳ",
    description: "Đề thi giữa kỳ môn Phát triển ứng dụng web kèm đáp án chi tiết.",
    tags: ["Đề thi", "Đáp án"],
    uploadDate: "2023-05-07",
    views: 765,
    downloads: 321,
    fileType: "PDF",
    uploader: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    title: "Hướng dẫn sử dụng Node.js và Express",
    description: "Tài liệu hướng dẫn sử dụng Node.js và Express để xây dựng backend cho ứng dụng web.",
    tags: ["Hướng dẫn", "Thực hành"],
    uploadDate: "2023-05-06",
    views: 654,
    downloads: 298,
    fileType: "PDF",
    uploader: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 6,
    title: "Bài tập lớn cuối kỳ",
    description: "Yêu cầu và hướng dẫn thực hiện bài tập lớn cuối kỳ.",
    tags: ["Bài tập", "Đồ án"],
    uploadDate: "2023-05-05",
    views: 543,
    downloads: 276,
    fileType: "DOCX",
    uploader: {
      name: "Nguyễn Thị F",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function CourseDetailPage({
  params,
}: {
  params: { id: string; courseId: string }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/departments/${params.id}`}
          className="flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại {course.department.name}
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.department.name}</Badge>
              <Badge variant="outline">{course.year.name}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <p className="text-muted-foreground max-w-2xl">{course.description}</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button asChild>
              <Link href={`/upload?department=${params.id}&course=${params.courseId}`}>
                <FileText className="h-4 w-4 mr-2" />
                Tải lên tài liệu
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Tìm kiếm tài liệu..." className="pl-10" />
          </div>

          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại tài liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="pptx">PPTX</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="downloads">Lượt tải nhiều nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="lecture">Bài giảng</TabsTrigger>
          <TabsTrigger value="exercise">Bài tập</TabsTrigger>
          <TabsTrigger value="exam">Đề thi</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((document) => (
              <Link href={`/documents/${document.id}`} key={document.id}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{document.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{document.description}</CardDescription>
                      </div>
                      <Badge>{document.fileType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{document.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{document.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={document.uploader.avatar || "/placeholder.svg"}
                          alt={document.uploader.name}
                        />
                        <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{document.uploader.name}</span>
                    </div>
                    <Badge variant="outline">Xem chi tiết</Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lecture">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents
              .filter(
                (doc) =>
                  doc.tags.includes("Lý thuyết") || doc.tags.includes("Slide") || doc.tags.includes("Giáo trình"),
              )
              .map((document) => (
                <Link href={`/documents/${document.id}`} key={document.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1">{document.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{document.description}</CardDescription>
                        </div>
                        <Badge>{document.fileType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{document.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{document.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={document.uploader.avatar || "/placeholder.svg"}
                            alt={document.uploader.name}
                          />
                          <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{document.uploader.name}</span>
                      </div>
                      <Badge variant="outline">Xem chi tiết</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="exercise">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents
              .filter(
                (doc) => doc.tags.includes("Bài tập") || doc.tags.includes("Thực hành") || doc.tags.includes("Đồ án"),
              )
              .map((document) => (
                <Link href={`/documents/${document.id}`} key={document.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1">{document.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{document.description}</CardDescription>
                        </div>
                        <Badge>{document.fileType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{document.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{document.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={document.uploader.avatar || "/placeholder.svg"}
                            alt={document.uploader.name}
                          />
                          <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{document.uploader.name}</span>
                      </div>
                      <Badge variant="outline">Xem chi tiết</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="exam">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents
              .filter((doc) => doc.tags.includes("Đề thi") || doc.tags.includes("Đáp án"))
              .map((document) => (
                <Link href={`/documents/${document.id}`} key={document.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1">{document.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{document.description}</CardDescription>
                        </div>
                        <Badge>{document.fileType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{document.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{document.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={document.uploader.avatar || "/placeholder.svg"}
                            alt={document.uploader.name}
                          />
                          <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{document.uploader.name}</span>
                      </div>
                      <Badge variant="outline">Xem chi tiết</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
