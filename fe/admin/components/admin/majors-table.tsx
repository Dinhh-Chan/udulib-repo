"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EditMajorDialog } from "@/components/admin/edit-major-dialog"
import { DeleteMajorDialog } from "@/components/admin/delete-major-dialog"
import { Major } from "@/types/major"
import { getMajors, deleteMajor } from "@/lib/api/major"
import { toast } from "sonner"

export function MajorsTable() {
  const [majors, setMajors] = useState<Major[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingMajor, setEditingMajor] = useState<Major | null>(null)
  const [deletingMajor, setDeletingMajor] = useState<Major | null>(null)

  const fetchMajors = async () => {
    try {
      const data = await getMajors()
      setMajors(data)
    } catch (error) {
      toast.error("Không thể tải danh sách ngành học")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMajors()
  }, [])

  const handleDelete = async (major: Major) => {
    try {
      await deleteMajor(major.major_id)
      toast.success("Xóa ngành học thành công")
      fetchMajors()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể xóa ngành học")
      }
      console.error(error)
    }
  }

  const filteredMajors = majors.filter(
    (major) =>
      major.major_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.major_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm kiếm ngành học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên ngành học</TableHead>
              <TableHead>Mã ngành</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMajors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredMajors.map((major) => (
                <TableRow key={major.major_id}>
                  <TableCell className="font-medium">{major.major_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{major.major_code}</Badge>
                  </TableCell>
                  <TableCell>{major.description || "-"}</TableCell>
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
                        <DropdownMenuItem onClick={() => setEditingMajor(major)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletingMajor(major)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingMajor && (
        <EditMajorDialog
          major={editingMajor}
          open={!!editingMajor}
          onOpenChange={(open) => !open && setEditingMajor(null)}
          onSuccess={fetchMajors}
        />
      )}

      {deletingMajor && (
        <DeleteMajorDialog
          major={deletingMajor}
          open={!!deletingMajor}
          onOpenChange={(open) => !open && setDeletingMajor(null)}
          onConfirm={() => handleDelete(deletingMajor)}
        />
      )}
    </div>
  )
}
