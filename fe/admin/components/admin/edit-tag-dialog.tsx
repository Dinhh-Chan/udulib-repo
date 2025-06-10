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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { getTag, updateTag, type Tag } from "@/lib/api/tag"

interface EditTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tagId: number
  onSuccess?: () => void
}

export function EditTagDialog({ open, onOpenChange, tagId, onSuccess }: EditTagDialogProps) {
  const [tagName, setTagName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (open && tagId) {
      fetchTagDetails()
    }
  }, [open, tagId])

  const fetchTagDetails = async () => {
    try {
      setIsFetching(true)
      const tag = await getTag(tagId)
      setTagName(tag.tag_name)
    } catch (error) {
      console.error("Error fetching tag details:", error)
      showErrorToast("Không thể tải thông tin tag")
      onOpenChange(false)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) {
      showErrorToast("Vui lòng nhập tên tag")
      return
    }

    try {
      setIsLoading(true)
      await updateTag(tagId, { tag_name: tagName })
      showSuccessToast("Cập nhật tag thành công")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error updating tag:", error)
      showErrorToast("Không thể cập nhật tag")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tag</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin tag. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  )
} 