"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { EditSubjectDialog } from "@/components/admin/edit-subject-dialog"
import { DeleteSubjectDialog } from "@/components/admin/delete-subject-dialog"
import { Subject } from "@/types/subject"
import { getSubjects, deleteSubject } from "@/lib/api/subject"
import { toast } from "sonner"

export function SubjectsTable() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects()
      setSubjects(data)
    } catch (error) {
      toast.error("Không thể tải danh sách môn học")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleDelete = async (subject: Subject) => {
    try {
      await deleteSubject(subject.subject_id)
      toast.success("Xóa môn học thành công")
      fetchSubjects()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể xóa môn học")
      }
      console.error(error)
    }
  }

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subject_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Tìm kiếm môn học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium">
          <div>Tên môn học</div>
          <div>Mã môn</div>
          <div>Ngành học</div>
          <div className="text-center">Năm học</div>
          <div className="text-right">Thao tác</div>
        </div>
        <div className="divide-y">
          {filteredSubjects.map((subject) => (
            <div key={subject.subject_id} className="grid grid-cols-5 gap-4 p-4">
              <div>{subject.subject_name}</div>
              <div>
                <Badge variant="outline">{subject.subject_code}</Badge>
              </div>
              <div>{subject.major_name}</div>
              <div className="text-center">{subject.year_name}</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingSubject(subject)}>
                  Sửa
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeletingSubject(subject)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingSubject && (
        <EditSubjectDialog
          subject={editingSubject}
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          onSuccess={fetchSubjects}
        />
      )}

      {deletingSubject && (
        <DeleteSubjectDialog
          subject={deletingSubject}
          open={!!deletingSubject}
          onOpenChange={(open) => !open && setDeletingSubject(null)}
          onConfirm={() => handleDelete(deletingSubject)}
        />
      )}
    </div>
  )
} 