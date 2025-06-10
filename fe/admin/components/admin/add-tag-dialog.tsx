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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { createTag } from "@/lib/api/tag"

interface AddTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddTagDialog({ open, onOpenChange, onSuccess }: AddTagDialogProps) {
  const [tagName, setTagName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) {
      showErrorToast("Vui lòng nhập tên tag")
      return
    }

    try {
      setIsLoading(true)
      await createTag({ tag_name: tagName })
      showSuccessToast("Thêm tag mới thành công")
      setTagName("")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating tag:", error)
      showErrorToast("Không thể thêm tag mới")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm tag mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin tag mới. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tên tag</Label>
              <Input
                id="tag-name"
                placeholder="Nhập tên tag"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 