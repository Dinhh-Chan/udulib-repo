"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Subject, SubjectUpdate } from "@/types/subject"
import { updateSubject } from "@/lib/api/subject"
import { toast } from "sonner"

interface EditSubjectDialogProps {
  subject: Subject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditSubjectDialog({ subject, open, onOpenChange, onSuccess }: EditSubjectDialogProps) {
  const [subjectName, setSubjectName] = useState(subject.subject_name)
  const [subjectCode, setSubjectCode] = useState(subject.subject_code)
  const [description, setDescription] = useState(subject.description || "")
  const [majorId, setMajorId] = useState(subject.major_id.toString())
  const [yearId, setYearId] = useState(subject.year_id.toString())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setSubjectName(subject.subject_name)
      setSubjectCode(subject.subject_code)
      setDescription(subject.description || "")
      setMajorId(subject.major_id.toString())
      setYearId(subject.year_id.toString())
    }
  }, [open, subject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const subjectUpdate: SubjectUpdate = {
        subject_name: subjectName,
        subject_code: subjectCode,
        description: description || undefined,
        major_id: parseInt(majorId),
        year_id: parseInt(yearId),
      }
      await updateSubject(subject.subject_id, subjectUpdate)
      toast.success("Cập nhật môn học thành công")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể cập nhật môn học")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa môn học</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin môn học.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject_name">Tên môn học</Label>
              <Input
                id="subject_name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Nhập tên môn học"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject_code">Mã môn học</Label>
              <Input
                id="subject_code"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="Nhập mã môn học"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả môn học"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major_id">Ngành học</Label>
              <Select value={majorId} onValueChange={setMajorId} required>
                <SelectTrigger id="major_id">
                  <SelectValue placeholder="Chọn ngành học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Công nghệ thông tin</SelectItem>
                  <SelectItem value="2">Kỹ thuật phần mềm</SelectItem>
                  <SelectItem value="3">Khoa học máy tính</SelectItem>
                  <SelectItem value="4">Hệ thống thông tin</SelectItem>
                  <SelectItem value="5">Kỹ thuật máy tính</SelectItem>
                  <SelectItem value="6">Quản trị kinh doanh</SelectItem>
                  <SelectItem value="7">Tài chính - Ngân hàng</SelectItem>
                  <SelectItem value="8">Kế toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year_id">Năm học</Label>
              <Select value={yearId} onValueChange={setYearId} required>
                <SelectTrigger id="year_id">
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Năm 1</SelectItem>
                  <SelectItem value="2">Năm 2</SelectItem>
                  <SelectItem value="3">Năm 3</SelectItem>
                  <SelectItem value="4">Năm 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 