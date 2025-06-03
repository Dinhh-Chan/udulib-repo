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
import { MoreHorizontal, CheckCircle, XCircle, Flag, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: number
  content: string
  documentTitle: string
  user: {
    name: string
    avatar: string
  }
  createdAt: string
  status: "pending" | "approved" | "flagged"
}

const comments: Comment[] = [
  {
    id: 1,
    content: "Tài liệu rất hữu ích, cảm ơn bạn đã chia sẻ!",
    documentTitle: "Bài giảng Lập trình Python - Tuần 5",
    user: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "15/05/2023 10:30",
    status: "pending",
  },
  {
    id: 2,
    content: "Có một số lỗi chính tả trong tài liệu, nhưng nhìn chung nội dung rất tốt.",
    documentTitle: "Đề thi giữa kỳ - Kinh tế vĩ mô",
    user: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "14/05/2023 15:45",
    status: "approved",
  },
  {
    id: 3,
    content: "Tài liệu này không liên quan đến môn học, vui lòng kiểm tra lại.",
    documentTitle: "Slide bài giảng - Cơ sở dữ liệu",
    user: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "13/05/2023 09:15",
    status: "flagged",
  },
  {
    id: 4,
    content: "Bài tập này quá khó, có ai giải được không?",
    documentTitle: "Bài tập thực hành - Kế toán tài chính",
    user: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "12/05/2023 14:20",
    status: "approved",
  },
  {
    id: 5,
    content: "Tài liệu này đã cũ, cần cập nhật theo chương trình mới.",
    documentTitle: "Tài liệu tham khảo - Marketing căn bản",
    user: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "11/05/2023 11:10",
    status: "pending",
  },
  {
    id: 6,
    content: "Đây là nội dung spam, không liên quan gì đến tài liệu học tập.",
    documentTitle: "Bài tập lớn - Lập trình Web",
    user: {
      name: "Ngô Văn F",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "10/05/2023 16:30",
    status: "flagged",
  },
]

export function CommentsTable() {
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
      case "flagged":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Đánh dấu
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Tài liệu</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{comment.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={comment.content}>
                  {comment.content}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={comment.documentTitle}>
                  {comment.documentTitle}
                </div>
              </TableCell>
              <TableCell>{comment.createdAt}</TableCell>
              <TableCell>{getStatusBadge(comment.status)}</TableCell>
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
                    {comment.status === "pending" && (
                      <>
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
                    {comment.status !== "flagged" && (
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Đánh dấu</span>
                      </DropdownMenuItem>
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
