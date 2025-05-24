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
import { Major, MajorUpdate } from "@/types/major"
import { updateMajor } from "@/lib/api/major"
import { toast } from "sonner"

interface EditMajorDialogProps {
  major: Major
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditMajorDialog({ major, open, onOpenChange, onSuccess }: EditMajorDialogProps) {
  const [majorName, setMajorName] = useState(major.major_name)
  const [majorCode, setMajorCode] = useState(major.major_code)
  const [description, setDescription] = useState(major.description || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setMajorName(major.major_name)
      setMajorCode(major.major_code)
      setDescription(major.description || "")
    }
  }, [open, major])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const majorUpdate: MajorUpdate = {
        major_name: majorName,
        major_code: majorCode,
        description: description || undefined,
      }
      await updateMajor(major.major_id, majorUpdate)
      toast.success("Cập nhật ngành học thành công")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể cập nhật ngành học")
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
            <DialogTitle>Chỉnh sửa ngành học</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin ngành học.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="major_name">Tên ngành học</Label>
              <Input
                id="major_name"
                value={majorName}
                onChange={(e) => setMajorName(e.target.value)}
                placeholder="Nhập tên ngành học"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major_code">Mã ngành</Label>
              <Input
                id="major_code"
                value={majorCode}
                onChange={(e) => setMajorCode(e.target.value)}
                placeholder="Nhập mã ngành"
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
                placeholder="Nhập mô tả ngành học"
                disabled={isLoading}
              />
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
