"use client"

import { useState } from "react"
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
import { EditMajorDialog } from "@/components/admin/edit-major-dialog"
import { DeleteMajorDialog } from "@/components/admin/delete-major-dialog"

interface Major {
  id: number
  name: string
  code: string
  courses: number
  documents: number
}

const majors: Major[] = [
  {
    id: 1,
    name: "Công nghệ thông tin",
    code: "CNTT",
    courses: 24,
    documents: 356,
  },
  {
    id: 2,
    name: "Kỹ thuật phần mềm",
    code: "KTPM",
    courses: 18,
    documents: 245,
  },
  {
    id: 3,
    name: "Khoa học máy tính",
    code: "KHMT",
    courses: 22,
    documents: 312,
  },
  {
    id: 4,
    name: "Hệ thống thông tin",
    code: "HTTT",
    courses: 16,
    documents: 198,
  },
  {
    id: 5,
    name: "Kỹ thuật máy tính",
    code: "KTMT",
    courses: 20,
    documents: 267,
  },
  {
    id: 6,
    name: "Quản trị kinh doanh",
    code: "QTKD",
    courses: 15,
    documents: 178,
  },
  {
    id: 7,
    name: "Tài chính - Ngân hàng",
    code: "TCNH",
    courses: 17,
    documents: 203,
  },
  {
    id: 8,
    name: "Kế toán",
    code: "KT",
    courses: 14,
    documents: 167,
  },
]

export function MajorsTable() {
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleEdit = (major: Major) => {
    setSelectedMajor(major)
    setIsEditOpen(true)
  }

  const handleDelete = (major: Major) => {
    setSelectedMajor(major)
    setIsDeleteOpen(true)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên ngành</TableHead>
              <TableHead>Mã ngành</TableHead>
              <TableHead className="text-center">Số môn học</TableHead>
              <TableHead className="text-center">Số tài liệu</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {majors.map((major) => (
              <TableRow key={major.id}>
                <TableCell className="font-medium">{major.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{major.code}</Badge>
                </TableCell>
                <TableCell className="text-center">{major.courses}</TableCell>
                <TableCell className="text-center">{major.documents}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(major)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(major)}>
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

      {selectedMajor && (
        <>
          <EditMajorDialog major={selectedMajor} open={isEditOpen} onOpenChange={setIsEditOpen} />
          <DeleteMajorDialog major={selectedMajor} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
        </>
      )}
    </div>
  )
}
