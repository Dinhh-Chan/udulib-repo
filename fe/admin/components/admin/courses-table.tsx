"use client"

import { useEffect, useState } from "react"
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
import { Subject } from "@/types/subject"
import { getSubjects, deleteSubject } from "@/lib/api/subject"
import { getMajors } from "@/lib/api/major"
import { getYears } from "@/lib/api/years"
import { Major } from "@/types/major"
import { Year } from "@/types/year"
import { toast } from "sonner"
import { EditSubjectDialog } from "@/components/admin/edit-subject-dialog"
import { DeleteSubjectDialog } from "@/components/admin/delete-subject-dialog"

interface CoursesTableProps {
  search?: string
}

export function CoursesTable({ search = "" }: CoursesTableProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [subjectsData, majorsData, yearsData] = await Promise.all([
        getSubjects({ search }),
        getMajors(),
        getYears()
      ])

      // Map subjects với major_name và year_name
      const enrichedSubjects = subjectsData.map(subject => ({
        ...subject,
        major_name: majorsData.find(m => m.major_id === subject.major_id)?.major_name || 'N/A',
        year_name: yearsData.find(y => y.year_id === subject.year_id)?.year_name || 'N/A'
      }))

      setSubjects(enrichedSubjects)
      setMajors(majorsData)
      setYears(yearsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Không thể tải dữ liệu")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa môn học này?")) return

    try {
      await deleteSubject(id)
      toast.success("Xóa môn học thành công")
      fetchData() // Reload all data after deletion
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast.error("Không thể xóa môn học")
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên môn học</TableHead>
            <TableHead>Mã môn</TableHead>
            <TableHead>Ngành học</TableHead>
            <TableHead className="text-center">Năm học</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            subjects.map((subject) => (
              <TableRow key={subject.subject_id}>
                <TableCell className="font-medium">{subject.subject_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subject.subject_code}</Badge>
                </TableCell>
                <TableCell>{subject.major_name}</TableCell>
                <TableCell className="text-center">{subject.year_name}</TableCell>
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
                      <DropdownMenuItem onClick={() => setEditingSubject(subject)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingSubject(subject)}>
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

      {editingSubject && (
        <EditSubjectDialog
          subject={editingSubject}
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          onSuccess={fetchData}
        />
      )}

      {deletingSubject && (
        <DeleteSubjectDialog
          subject={deletingSubject}
          open={!!deletingSubject}
          onOpenChange={(open) => !open && setDeletingSubject(null)}
          onConfirm={() => handleDelete(deletingSubject.subject_id)}
        />
      )}
    </div>
  )
}
