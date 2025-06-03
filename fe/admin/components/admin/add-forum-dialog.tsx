"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createForum } from "@/lib/api/forum"
import { getSubjects } from "@/lib/api/subject"

interface Subject {
  subject_id: number
  subject_name: string
}

export interface AddForumDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  subjectId?: number
}

export function AddForumDialog({ open, onOpenChange, onSuccess, subjectId }: AddForumDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true)
      const response = await getSubjects()
      setSubjects(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Không thể tải danh sách môn học")
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchSubjects()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const subject_id = Number(formData.get("subject_id"))
      const description = formData.get("description") as string

      if (!subject_id) {
        toast.error("Vui lòng chọn môn học")
        setIsLoading(false)
        return
      }

      await createForum({
        subject_id,
        description
      })

      toast.success("Tạo diễn đàn thành công")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating forum:", error)
      toast.error("Không thể tạo diễn đàn mới")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Thêm diễn đàn mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo diễn đàn mới cho môn học. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_id" className="text-right">
                Môn học
              </Label>
              <div className="col-span-3">
                <Select name="subject_id" required defaultValue={subjectId?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSubjects ? "Đang tải..." : "Chọn môn học"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSubjects ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="ml-2">Đang tải danh sách môn học...</span>
                      </div>
                    ) : subjects.length === 0 ? (
                      <SelectItem value="empty" disabled>Không có môn học nào</SelectItem>
                    ) : (
                      subjects.map((subject) => (
                        <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                          {subject.subject_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Nhập mô tả cho diễn đàn"
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo diễn đàn"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 