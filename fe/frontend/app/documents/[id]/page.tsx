import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, Download, Calendar, ArrowLeft, ThumbsUp, Share2, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import DocumentViewer from "@/components/document-viewer"
import DocumentComments from "@/components/document-comments"

// Dữ liệu mẫu cho tài liệu
const document = {
  id: 1,
  title: "Giáo trình HTML, CSS cơ bản",
  description: "Tài liệu hướng dẫn HTML, CSS từ cơ bản đến nâng cao cho sinh viên.",
  content: "Nội dung tài liệu sẽ được hiển thị ở đây...",
  tags: ["Giáo trình", "Lý thuyết", "Web"],
  uploadDate: "2023-05-10",
  views: 1245,
  downloads: 567,
  likes: 89,
  fileType: "PDF",
  fileSize: "2.5 MB",
  fileUrl: "/files/sample.pdf",
  department: {
    id: 1,
    name: "Công nghệ thông tin",
  },
  course: {
    id: 9,
    name: "Phát triển ứng dụng web",
  },
  year: {
    id: 3,
    name: "Năm 3",
  },
  uploader: {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Giảng viên",
  },
}

// Dữ liệu mẫu cho tài liệu liên quan
const relatedDocuments = [
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
]

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/departments/${document.department.id}/courses/${document.course.id}`}
          className="flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại {document.course.name}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột bên trái - Thông tin tài liệu */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline">{document.department.name}</Badge>
                <Badge variant="outline">{document.course.name}</Badge>
                <Badge variant="outline">{document.year.name}</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-2">{document.title}</h1>

              <p className="text-muted-foreground mb-4">{document.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{document.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{document.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{document.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(document.uploadDate).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống ({document.fileType}, {document.fileSize})
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thích
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <Avatar>
                  <AvatarImage src={document.uploader.avatar || "/placeholder.svg"} alt={document.uploader.name} />
                  <AvatarFallback>{document.uploader.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{document.uploader.name}</div>
                  <div className="text-sm text-muted-foreground">{document.uploader.role}</div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="preview">
              <TabsList className="mb-6">
                <TabsTrigger value="preview">Xem trước</TabsTrigger>
                <TabsTrigger value="comments">Bình luận</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <div className="border rounded-lg overflow-hidden">
                  <DocumentViewer fileType={document.fileType} fileUrl={document.fileUrl} />
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <Card>
                  <CardHeader>
                    <CardTitle>Bình luận</CardTitle>
                    <CardDescription>Chia sẻ ý kiến của bạn về tài liệu này</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Textarea placeholder="Viết bình luận của bạn..." />
                      <div className="flex justify-end mt-2">
                        <Button>Gửi bình luận</Button>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <DocumentComments />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Cột bên phải - Tài liệu liên quan */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tài liệu liên quan</h2>
              <div className="space-y-4">
                {relatedDocuments.map((doc) => (
                  <Link href={`/documents/${doc.id}`} key={doc.id}>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                          <Badge>{doc.fileType}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <CardDescription className="line-clamp-2">{doc.description}</CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={doc.uploader.avatar || "/placeholder.svg"} alt={doc.uploader.name} />
                            <AvatarFallback>{doc.uploader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{doc.uploader.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{doc.views}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
