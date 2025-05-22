"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Download, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: number
  title: string
  course: string
  major: string
  uploadedBy: string
  uploadedAt: string
  status: "pending" | "approved" | "rejected"
  views: number
  downloads: number
  fileType: string
}

const documents: Document[] = [
  {
    id: 1,
    title: "Bài giảng Lập trình Python - Tuần 5",
    course: "Lập trình Python",
    major: "Công nghệ thông tin",
    uploadedBy: "Nguyễn Văn A",
    uploadedAt: "15/05/2023",
    status: "pending",
    views: 0,
    downloads: 0,
    fileType: "pdf",
  },
  {
    id: 2,
    title: "Đề thi giữa kỳ - Kinh tế vĩ mô",
    course: "Kinh tế vĩ mô",
    major: "Kinh tế",
    uploadedBy: "Trần Thị B",
    uploadedAt: "14/05/2023",
    status: "pending",
    views: 0,
    downloads: 0,
    fileType: "docx",
  },
  {
    id: 3,
    title: "Slide bài giảng - Cơ sở dữ liệu",
    course: "Cơ sở dữ liệu",
    major: "Công nghệ thông tin",
    uploadedBy: "Lê Văn C",
    uploadedAt: "13/05/2023",
    status: "approved",
    views: 12,
    downloads: 5,
    fileType: "pptx",
  },
  {
    id: 4,
    title: "Bài tập thực hành - Kế toán tài chính",
    course: "Kế toán tài chính",
    major: "Kế toán",
    uploadedBy: "Phạm Thị D",
    uploadedAt: "12/05/2023",
    status: "approved",
    views: 28,
    downloads: 15,
    fileType: "xlsx",
  },
  {
    id: 5,
    title: "Tài liệu tham khảo - Marketing căn bản",
    course: "Marketing căn bản",
    major: "Quản trị kinh doanh",
    uploadedBy: "Hoàng Văn E",
    uploadedAt: "10/05/2023",
    status: "approved",
    views: 45,
    downloads: 22,
    fileType: "pdf",
  },
  {
    id: 6,
    title: "Bài tập lớn - Lập trình Web",
    course: "Lập trình Web",
    major: "Công nghệ thông tin",
    uploadedBy: "Ngô Văn F",
    uploadedAt: "09/05/2023",
    status: "rejected",
    views: 0,
    downloads: 0,
    fileType: "zip",
  },
  {
    id: 7,
    title: "Tài liệu hướng dẫn - Phân tích thiết kế hệ thống",
    course: "Phân tích thiết kế hệ thống",
    major: "Công nghệ thông tin",
    uploadedBy: "Đỗ Thị G",
    uploadedAt: "08/05/2023",
    status: "approved",
    views: 32,
    downloads: 18,
    fileType: "pdf",
  },
  {
    id: 8,
    title: "Đề cương ôn tập - Toán cao cấp",
    course: "Toán cao cấp",
    major: "Toán ứng dụng",
    uploadedBy: "Vũ Văn H",
    uploadedAt: "07/05/2023",
    status: "approved",
    views: 67,
    downloads: 41,
    fileType: "pdf",
  },
]

export function DocumentsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Chờ duyệt
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Đã duyệt
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Từ chối
          </Badge>
        )
      default:
        return null
    }
  }

  const getFileTypeBadge = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            PDF
          </Badge>
        )
      case "docx":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            DOCX
          </Badge>
        )
      case "pptx":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            PPTX
          </Badge>
        )
      case "xlsx":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            XLSX
          </Badge>
        )
      case "zip":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            ZIP
          </Badge>
        )
      default:
        return <Badge variant="outline">{fileType.toUpperCase()}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên tài liệu</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Người tải lên</TableHead>
            <TableHead>Ngày tải lên</TableHead>
            <TableHead>Loại file</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Lượt xem</TableHead>
            <TableHead className="text-center">Lượt tải</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.title}</TableCell>
              <TableCell>{document.course}</TableCell>
              <TableCell>{document.uploadedBy}</TableCell>
              <TableCell>{document.uploadedAt}</TableCell>
              <TableCell>{getFileTypeBadge(document.fileType)}</TableCell>
              <TableCell>{getStatusBadge(document.status)}</TableCell>
              <TableCell className="text-center">{document.views}</TableCell>
              <TableCell className="text-center">{document.downloads}</TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
