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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateForum, type Forum } from "@/lib/api/forum"
import { Pencil } from "lucide-react"

interface EditForumDialogProps {
  forum: Forum
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function EditForumDialog({ forum, onSuccess, trigger }: EditForumDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState(forum.description)

  useEffect(() => {
    setDescription(forum.description)
  }, [forum])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await updateForum(forum.forum_id, { description })
      toast.success("Đã cập nhật diễn đàn")
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error updating forum:", error)
      toast.error("Không thể cập nhật diễn đàn")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa diễn đàn</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin diễn đàn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="description">Mô tả</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả diễn đàn"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 