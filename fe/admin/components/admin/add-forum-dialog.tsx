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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createForum } from "@/lib/api/forum"
import { Plus } from "lucide-react"

interface AddForumDialogProps {
  subjectId: number
  onSuccess?: () => void
}

export function AddForumDialog({ subjectId, onSuccess }: AddForumDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await createForum({ subject_id: subjectId, description })
      toast.success("Đã thêm diễn đàn mới")
      setOpen(false)
      onSuccess?.()
      // Reset form
      setDescription("")
    } catch (error) {
      console.error("Error creating forum:", error)
      toast.error("Không thể tạo diễn đàn")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm diễn đàn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm diễn đàn mới</DialogTitle>
            <DialogDescription>
              Tạo một diễn đàn mới cho môn học này.
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
              {isLoading ? "Đang tạo..." : "Tạo diễn đàn"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 