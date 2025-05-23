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
import { MoreHorizontal, Lock, Unlock, UserCog, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
  status: "active" | "locked"
  documents: number
  registeredAt: string
  lastLogin: string
  avatar: string
}

const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.edu.vn",
    role: "user",
    status: "active",
    documents: 12,
    registeredAt: "01/01/2023",
    lastLogin: "15/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.edu.vn",
    role: "user",
    status: "active",
    documents: 8,
    registeredAt: "15/01/2023",
    lastLogin: "14/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.edu.vn",
    role: "user",
    status: "locked",
    documents: 5,
    registeredAt: "01/02/2023",
    lastLogin: "10/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.edu.vn",
    role: "user",
    status: "active",
    documents: 15,
    registeredAt: "15/02/2023",
    lastLogin: "15/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.edu.vn",
    role: "admin",
    status: "active",
    documents: 7,
    registeredAt: "01/03/2023",
    lastLogin: "15/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 6,
    name: "Ngô Văn F",
    email: "ngovane@example.edu.vn",
    role: "user",
    status: "active",
    documents: 3,
    registeredAt: "15/03/2023",
    lastLogin: "13/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 7,
    name: "Đỗ Thị G",
    email: "dothig@example.edu.vn",
    role: "user",
    status: "active",
    documents: 9,
    registeredAt: "01/04/2023",
    lastLogin: "14/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 8,
    name: "Vũ Văn H",
    email: "vuvanh@example.edu.vn",
    role: "user",
    status: "active",
    documents: 6,
    registeredAt: "15/04/2023",
    lastLogin: "12/05/2023",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function UsersTable() {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Admin</Badge>
      case "user":
        return <Badge variant="outline">Người dùng</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Hoạt động
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Đã khóa
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
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Tài liệu</TableHead>
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead>Đăng nhập gần nhất</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-center">{user.documents}</TableCell>
              <TableCell>{user.registeredAt}</TableCell>
              <TableCell>{user.lastLogin}</TableCell>
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
                    {user.status === "active" ? (
                      <DropdownMenuItem>
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Khóa tài khoản</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Unlock className="mr-2 h-4 w-4" />
                        <span>Mở khóa tài khoản</span>
                      </DropdownMenuItem>
                    )}
                    {user.role === "user" ? (
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Cấp quyền admin</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Hủy quyền admin</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      <span>Xóa tài khoản</span>
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
