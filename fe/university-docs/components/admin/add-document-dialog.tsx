"use client"

import { useState } from "react"
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

interface AddDocumentDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AddDocumentDialog({ children, onSuccess }: AddDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<{ subject_id: number; subject_name: string }[]>([])

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`)
      if (!response.ok) {
        throw new Error("Không thể tải danh sách môn học")
      }
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Không thể tải danh sách môn học")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const file = formData.get("file") as File
      
      // Tạo FormData mới để gửi file
      const submitData = new FormData()
      submitData.append("title", formData.get("title") as string)
      submitData.append("description", formData.get("description") as string)
      submitData.append("subject_id", formData.get("subject_id") as string)
      submitData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        throw new Error("Không thể thêm tài liệu")
      }

      toast.success("Thêm tài liệu thành công")
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding document:", error)
      toast.error("Không thể thêm tài liệu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => fetchSubjects()}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu mới</DialogTitle>
          <DialogDescription>
            Điền thông tin tài liệu mới vào form bên dưới. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tên tài liệu
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_id" className="text-right">
                Môn học
              </Label>
              <Select name="subject_id" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                      {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                className="col-span-3"
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 