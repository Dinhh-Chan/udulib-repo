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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateForum, type Forum } from "@/lib/api/forum"
import { type Subject } from "@/types/subject"

interface ForumWithSubject extends Forum {
  subjectData?: Subject
}

export interface EditForumDialogProps {
  forum: ForumWithSubject
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditForumDialog({ forum, open, onOpenChange, onSuccess }: EditForumDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState(forum.description || "")

  useEffect(() => {
    if (open && forum) {
      setDescription(forum.description || "")
    }
  }, [open, forum])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Updating forum with ID:", forum.forum_id)
      console.log("Description data:", { description })
      await updateForum(forum.forum_id, { description })
      toast.success("Cập nhật diễn đàn thành công")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error updating forum:", error)
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        toast.error(`Không thể cập nhật diễn đàn: ${error.message}`)
      } else {
        toast.error("Không thể cập nhật diễn đàn: Lỗi không xác định")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa diễn đàn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin diễn đàn. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Môn học
              </Label>
              <div className="col-span-3">
                <div className="p-2 bg-muted rounded-md">
                  {forum.subjectData?.subject_name || "Không có thông tin môn học"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả cho diễn đàn"
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 