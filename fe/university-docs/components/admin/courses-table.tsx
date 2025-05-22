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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: number
  name: string
  code: string
  major: string
  year: number
  documents: number
}

const courses: Course[] = [
  {
    id: 1,
    name: "Lập trình Python",
    code: "ITEC1001",
    major: "Công nghệ thông tin",
    year: 1,
    documents: 45,
  },
  {
    id: 2,
    name: "Cơ sở dữ liệu",
    code: "ITEC2001",
    major: "Công nghệ thông tin",
    year: 2,
    documents: 38,
  },
  {
    id: 3,
    name: "Hướng đối tượng",
    code: "ITEC2002",
    major: "Công nghệ thông tin",
    year: 2,
    documents: 42,
  },
  {
    id: 4,
    name: "Mạng máy tính",
    code: "ITEC3001",
    major: "Công nghệ thông tin",
    year: 3,
    documents: 36,
  },
  {
    id: 5,
    name: "Trí tuệ nhân tạo",
    code: "ITEC4001",
    major: "Công nghệ thông tin",
    year: 4,
    documents: 29,
  },
  {
    id: 6,
    name: "Kinh tế vĩ mô",
    code: "ECON1001",
    major: "Kinh tế",
    year: 1,
    documents: 32,
  },
  {
    id: 7,
    name: "Kế toán tài chính",
    code: "ACCT2001",
    major: "Kế toán",
    year: 2,
    documents: 27,
  },
  {
    id: 8,
    name: "Marketing căn bản",
    code: "MKTG1001",
    major: "Quản trị kinh doanh",
    year: 1,
    documents: 31,
  },
]

export function CoursesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên môn học</TableHead>
            <TableHead>Mã môn</TableHead>
            <TableHead>Ngành học</TableHead>
            <TableHead className="text-center">Năm học</TableHead>
            <TableHead className="text-center">Số tài liệu</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{course.code}</Badge>
              </TableCell>
              <TableCell>{course.major}</TableCell>
              <TableCell className="text-center">{course.year}</TableCell>
              <TableCell className="text-center">{course.documents}</TableCell>
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
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
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
