"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createForumPost } from "@/lib/api/forum"
import { toast } from "sonner"
import type { Forum } from "@/types/forum"

interface NewPostModalProps {
  forum: Forum
  onPostCreated: () => void
}

export function NewPostModal({ forum, onPostCreated }: NewPostModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết")
      return
    }
    
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết")
      return
    }

    try {
      setIsSubmitting(true)
      await createForumPost({
        forum_id: forum.forum_id,
        title: formData.title.trim(),
        content: formData.content.trim()
      })
      
      toast.success("Đăng bài viết thành công!")
      setFormData({ title: "", content: "" })
      setIsOpen(false)
      onPostCreated()
    } catch (error: any) {
      console.error("Error creating post:", error)
      toast.error(error.message || "Không thể đăng bài viết")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false)
      setFormData({ title: "", content: "" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài viết mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Đăng bài viết trong diễn đàn {forum.subject_name}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề bài viết *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Nhập tiêu đề bài viết..."
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung bài viết *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Viết nội dung bài viết của bạn..."
              rows={8}
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <p className="text-sm text-muted-foreground">
              Chia sẻ câu hỏi, thảo luận hoặc kiến thức của bạn về môn học này.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng..." : "Đăng bài viết"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 