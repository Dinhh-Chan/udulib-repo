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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddCourseDialogProps {
  children: React.ReactNode
}

export function AddCourseDialog({ children }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [major, setMajor] = useState("")
  const [year, setYear] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý thêm môn học
    console.log("Thêm môn học:", { name, code, major, year })
    setOpen(false)
    setName("")
    setCode("")
    setMajor("")
    setYear("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm môn học mới</DialogTitle>
            <DialogDescription>Nhập thông tin môn học mới vào form bên dưới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên môn học</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên môn học"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Mã môn học</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã môn học"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major">Ngành học</Label>
              <Select value={major} onValueChange={setMajor} required>
                <SelectTrigger id="major">
                  <SelectValue placeholder="Chọn ngành học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cntt">Công nghệ thông tin</SelectItem>
                  <SelectItem value="ktpm">Kỹ thuật phần mềm</SelectItem>
                  <SelectItem value="khmt">Khoa học máy tính</SelectItem>
                  <SelectItem value="httt">Hệ thống thông tin</SelectItem>
                  <SelectItem value="ktmt">Kỹ thuật máy tính</SelectItem>
                  <SelectItem value="qtkd">Quản trị kinh doanh</SelectItem>
                  <SelectItem value="tcnh">Tài chính - Ngân hàng</SelectItem>
                  <SelectItem value="kt">Kế toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Năm học</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Năm 1</SelectItem>
                  <SelectItem value="2">Năm 2</SelectItem>
                  <SelectItem value="3">Năm 3</SelectItem>
                  <SelectItem value="4">Năm 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Thêm môn học</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
