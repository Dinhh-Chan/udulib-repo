import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Download, CheckCircle, XCircle } from "lucide-react"

const recentDocuments = [
  {
    id: 1,
    title: "Bài giảng Lập trình Python - Tuần 5",
    course: "Lập trình Python",
    major: "Công nghệ thông tin",
    uploadedBy: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.edu.vn",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    uploadedAt: "15 phút trước",
    status: "pending",
    views: 0,
    downloads: 0,
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ - Kinh tế vĩ mô",
    course: "Kinh tế vĩ mô",
    major: "Kinh tế",
    uploadedBy: {
      name: "Trần Thị B",
      email: "tranthib@example.edu.vn",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    uploadedAt: "1 giờ trước",
    status: "pending",
    views: 0,
    downloads: 0,
  },
  {
    id: 3,
    title: "Slide bài giảng - Cơ sở dữ liệu",
    course: "Cơ sở dữ liệu",
    major: "Công nghệ thông tin",
    uploadedBy: {
      name: "Lê Văn C",
      email: "levanc@example.edu.vn",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    uploadedAt: "3 giờ trước",
    status: "approved",
    views: 12,
    downloads: 5,
  },
  {
    id: 4,
    title: "Bài tập thực hành - Kế toán tài chính",
    course: "Kế toán tài chính",
    major: "Kế toán",
    uploadedBy: {
      name: "Phạm Thị D",
      email: "phamthid@example.edu.vn",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    uploadedAt: "5 giờ trước",
    status: "approved",
    views: 28,
    downloads: 15,
  },
  {
    id: 5,
    title: "Tài liệu tham khảo - Marketing căn bản",
    course: "Marketing căn bản",
    major: "Quản trị kinh doanh",
    uploadedBy: {
      name: "Hoàng Văn E",
      email: "hoangvane@example.edu.vn",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    uploadedAt: "1 ngày trước",
    status: "approved",
    views: 45,
    downloads: 22,
  },
]

export function RecentDocuments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu gần đây</CardTitle>
        <CardDescription>Danh sách các tài liệu mới được tải lên gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentDocuments.map((document) => (
            <div key={document.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={document.uploadedBy.avatar || "/placeholder.svg"} alt="Avatar" />
                <AvatarFallback>{document.uploadedBy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{document.title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{document.course}</span>
                  <span>•</span>
                  <span>{document.major}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{document.uploadedBy.name}</span>
                  <span>•</span>
                  <span>{document.uploadedAt}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {document.status === "pending" ? (
                  <Badge variant="outline" className="ml-auto">
                    Chờ duyệt
                  </Badge>
                ) : (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{document.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{document.downloads}</span>
                    </div>
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Xem tài liệu</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Tải xuống</span>
                    </DropdownMenuItem>
                    {document.status === "pending" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>Phê duyệt</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Từ chối</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
