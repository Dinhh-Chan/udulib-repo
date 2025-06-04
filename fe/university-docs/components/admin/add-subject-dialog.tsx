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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createSubject } from "@/lib/api/subject"
import { getMajors } from "@/lib/api/major"
import { getYears } from "@/lib/api/years"
import { Major } from "@/types/major"
import { Year } from "@/types/year"
import { toast } from "sonner"

interface AddSubjectDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AddSubjectDialog({ children, onSuccess }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [majors, setMajors] = useState<Major[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [formData, setFormData] = useState({
    subject_name: "",
    subject_code: "",
    description: "",
    major_id: "",
    year_id: "",
  })

  const fetchData = async () => {
    try {
      const [majorsData, yearsData] = await Promise.all([
        getMajors(),
        getYears(),
      ])
      setMajors(majorsData)
      setYears(yearsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Không thể tải dữ liệu")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      fetchData()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createSubject({
        subject_name: formData.subject_name,
        subject_code: formData.subject_code,
        description: formData.description,
        major_id: parseInt(formData.major_id),
        year_id: parseInt(formData.year_id),
      })

      toast.success("Thêm môn học thành công")
      setOpen(false)
      onSuccess?.()
      setFormData({
        subject_name: "",
        subject_code: "",
        description: "",
        major_id: "",
        year_id: "",
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Không thể thêm môn học")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm môn học mới</DialogTitle>
          <DialogDescription>
            Điền thông tin môn học mới vào form bên dưới.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_name" className="text-right">
                Tên môn học
              </Label>
              <Input
                id="subject_name"
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData({ ...formData, subject_name: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_code" className="text-right">
                Mã môn học
              </Label>
              <Input
                id="subject_code"
                value={formData.subject_code}
                onChange={(e) =>
                  setFormData({ ...formData, subject_code: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="major" className="text-right">
                Ngành học
              </Label>
              <Select
                value={formData.major_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, major_id: value })
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn ngành học" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.major_id} value={major.major_id.toString()}>
                      {major.major_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Năm học
              </Label>
              <Select
                value={formData.year_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, year_id: value })
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.year_id} value={year.year_id.toString()}>
                      {year.year_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang thêm..." : "Thêm môn học"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 