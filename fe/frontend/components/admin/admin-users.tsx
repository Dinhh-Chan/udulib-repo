"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Eye, Edit, Trash2, Lock, Unlock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dữ liệu mẫu cho người dùng
const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "student",
    status: "active",
    registrationDate: "2023-01-15",
    lastLogin: "2023-05-10",
    documentCount: 12,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "student",
    status: "active",
    registrationDate: "2023-02-20",
    lastLogin: "2023-05-09",
    documentCount: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "teacher",
    status: "active",
    registrationDate: "2023-01-10",
    lastLogin: "2023-05-08",
    documentCount: 25,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "student",
    status: "inactive",
    registrationDate: "2023-03-05",
    lastLogin: "2023-04-15",
    documentCount: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "admin",
    status: "active",
    registrationDate: "2022-12-01",
    lastLogin: "2023-05-10",
    documentCount: 45,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminUsers() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý người dùng</CardTitle>
          <CardDescription>Quản lý tất cả người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm người dùng..." className="pl-10" />
            </div>

            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="teacher">Giảng viên</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm người dùng
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Đăng nhập gần nhất</TableHead>
                  <TableHead>Tài liệu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "student" && <Badge variant="outline">Sinh viên</Badge>}
                      {user.role === "teacher" && <Badge variant="outline">Giảng viên</Badge>}
                      {user.role === "admin" && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Admin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status === "active" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          Không hoạt động
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>{user.documentCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button variant="ghost" size="icon" className="text-yellow-600">
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-green-600">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
