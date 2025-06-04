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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createForumPost } from "@/lib/api/forum"
import { Plus } from "lucide-react"

interface AddPostDialogProps {
  forumId: number
  onSuccess?: () => void
}

export function AddPostDialog({ forumId, onSuccess }: AddPostDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết")
      return
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết")
      return
    }

    try {
      setIsLoading(true)
      await createForumPost({ forum_id: forumId, title, content })
      toast.success("Đã thêm bài viết mới")
      setOpen(false)
      onSuccess?.()
      // Reset form
      setTitle("")
      setContent("")
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Không thể tạo bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bài viết
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm bài viết mới</DialogTitle>
            <DialogDescription>
              Tạo một bài viết mới trong diễn đàn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Tiêu đề</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content">Nội dung</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết"
                className="min-h-[200px]"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 