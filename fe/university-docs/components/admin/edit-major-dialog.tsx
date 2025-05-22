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

interface Major {
  id: number
  name: string
  code: string
  courses: number
  documents: number
}

interface EditMajorDialogProps {
  major: Major
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMajorDialog({ major, open, onOpenChange }: EditMajorDialogProps) {
  const [name, setName] = useState(major.name)
  const [code, setCode] = useState(major.code)

  useEffect(() => {
    if (open) {
      setName(major.name)
      setCode(major.code)
    }
  }, [open, major])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý cập nhật ngành học
    console.log("Cập nhật ngành học:", { id: major.id, name, code })
    onOpenChange(false)
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
              <Label htmlFor="edit-name">Tên ngành học</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên ngành học"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Mã ngành</Label>
              <Input
                id="edit-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã ngành"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
