"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MajorCreate } from "@/types/major"
import { createMajor } from "@/lib/api/major"
import { toast } from "sonner"

interface AddMajorDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AddMajorDialog({ children, onSuccess }: AddMajorDialogProps) {
  const [open, setOpen] = useState(false)
  const [majorName, setMajorName] = useState("")
  const [majorCode, setMajorCode] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const majorCreate: MajorCreate = {
        major_name: majorName,
        major_code: majorCode,
        description: description || undefined,
      }
      await createMajor(majorCreate)
      toast.success("Thêm ngành học thành công")
      onSuccess?.()
      setOpen(false)
      setMajorName("")
      setMajorCode("")
      setDescription("")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể thêm ngành học")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm ngành học mới</DialogTitle>
            <DialogDescription>Nhập thông tin ngành học mới vào form bên dưới.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang thêm..." : "Thêm ngành học"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
