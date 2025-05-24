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
import { MoreHorizontal, Eye, Flag, Trash2, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ForumPost {
  id: number
  title: string
  content: string
  course: string
  user: {
    name: string
    avatar: string
  }
  createdAt: string
  status: "active" | "flagged" | "hidden"
  replies: number
  views: number
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "Hỏi về bài tập Python tuần 5",
    content: "Mình đang gặp vấn đề với bài tập về list comprehension, có ai giúp mình được không?",
    course: "Lập trình Python",
    user: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "15/05/2023 10:30",
    status: "active",
    replies: 3,
    views: 25,
  },
  {
    id: 2,
    title: "Tài liệu tham khảo cho môn Kinh tế vĩ mô",
    content: "Các bạn có thể chia sẻ một số tài liệu tham khảo cho môn Kinh tế vĩ mô không?",
    course: "Kinh tế vĩ mô",
    user: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "14/05/2023 15:45",
    status: "active",
    replies: 5,
    views: 42,
  },
  {
    id: 3,
    title: "Quảng cáo khóa học online",
    content: "Mình có khóa học online về lập trình, các bạn quan tâm có thể liên hệ...",
    course: "Cơ sở dữ liệu",
    user: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "13/05/2023 09:15",
    status: "flagged",
    replies: 0,
    views: 12,
  },
  {
    id: 4,
    title: "Thảo luận về bài tập kế toán tài chính",
    content: "Mình muốn thảo luận về bài tập chương 3 trong sách giáo trình...",
    course: "Kế toán tài chính",
    user: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "12/05/2023 14:20",
    status: "active",
    replies: 7,
    views: 38,
  },
  {
    id: 5,
    title: "Chia sẻ kinh nghiệm thực tập",
    content: "Mình vừa hoàn thành kỳ thực tập tại công ty X, muốn chia sẻ kinh nghiệm với các bạn...",
    course: "Marketing căn bản",
    user: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "11/05/2023 11:10",
    status: "active",
    replies: 12,
    views: 67,
  },
  {
    id: 6,
    title: "Nội dung không phù hợp",
    content: "Nội dung vi phạm quy định diễn đàn...",
    course: "Lập trình Web",
    user: {
      name: "Ngô Văn F",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "10/05/2023 16:30",
    status: "hidden",
    replies: 0,
    views: 5,
  },
]

export function ForumPostsTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Hoạt động
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Đánh dấu
          </Badge>
        )
      case "hidden":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Đã ẩn
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
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Người đăng</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Phản hồi</TableHead>
            <TableHead className="text-center">Lượt xem</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forumPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="font-medium max-w-xs truncate" title={post.title}>
                  {post.title}
                </div>
                <div className="text-sm text-muted-foreground max-w-xs truncate" title={post.content}>
                  {post.content}
                </div>
              </TableCell>
              <TableCell>{post.course}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{post.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{post.createdAt}</TableCell>
              <TableCell>{getStatusBadge(post.status)}</TableCell>
              <TableCell className="text-center">{post.replies}</TableCell>
              <TableCell className="text-center">{post.views}</TableCell>
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
                      <span>Xem bài viết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Xem phản hồi</span>
                    </DropdownMenuItem>
                    {post.status === "active" && (
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Đánh dấu</span>
                      </DropdownMenuItem>
                    )}
                    {post.status !== "hidden" && (
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4 text-red-500" />
                        <span>Ẩn bài viết</span>
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
