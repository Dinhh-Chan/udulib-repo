import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, Download, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dữ liệu mẫu cho tài liệu mới nhất
const recentDocuments = [
  {
    id: 1,
    title: "Giáo trình Lập trình Python cơ bản",
    description: "Tài liệu hướng dẫn lập trình Python từ cơ bản đến nâng cao cho sinh viên năm nhất.",
    department: "Công nghệ thông tin",
    course: "Lập trình Python",
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
    title: "Bài tập Kinh tế vĩ mô",
    description: "Tập hợp các bài tập và đáp án cho môn Kinh tế vĩ mô.",
    department: "Kinh tế",
    course: "Kinh tế vĩ mô",
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
    title: "Slide bài giảng Cơ sở dữ liệu",
    description: "Slide bài giảng môn Cơ sở dữ liệu bao gồm lý thuyết và ví dụ thực hành.",
    department: "Công nghệ thông tin",
    course: "Cơ sở dữ liệu",
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
    title: "Đề thi cuối kỳ Marketing căn bản",
    description: "Đề thi cuối kỳ môn Marketing căn bản kèm đáp án chi tiết.",
    department: "Marketing",
    course: "Marketing căn bản",
    uploadDate: "2023-05-07",
    views: 765,
    downloads: 321,
    fileType: "PDF",
    uploader: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function RecentDocuments() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recentDocuments.map((document) => (
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
                <div className="text-sm">
                  <span className="font-medium">{document.department}</span> &bull; <span>{document.course}</span>
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
                  <AvatarImage src={document.uploader.avatar || "/placeholder.svg"} alt={document.uploader.name} />
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
  )
}
