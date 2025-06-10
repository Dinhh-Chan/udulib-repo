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
import { useToast } from "@/components/ui/use-toast"
import { Year, YearUpdate } from "@/types/year"
import { updateYear } from "@/lib/api/years"

interface EditYearDialogProps {
  year: Year | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditYearDialog({ year, open, onOpenChange, onSuccess }: EditYearDialogProps) {
  const [yearName, setYearName] = useState("")
  const [yearOrder, setYearOrder] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (year) {
      setYearName(year.year_name)
      setYearOrder(year.year_order)
    }
  }, [year])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!year) return
    
    if (!yearName.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tên năm học"
      })
      return
    }

    const yearData: YearUpdate = {
      year_name: yearName.trim(),
      year_order: yearOrder
    }

    setIsLoading(true)
    try {
      const result = await updateYear(year.year_id, yearData)
      if (result) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật năm học thành công"
        })
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error("Error updating year:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật năm học. Vui lòng thử lại sau."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa năm học</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin năm học trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year-name-edit" className="text-right">
                Tên năm học
              </Label>
              <Input
                id="year-name-edit"
                className="col-span-3"
                value={yearName}
                onChange={(e) => setYearName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year-order-edit" className="text-right">
                Thứ tự
              </Label>
              <Input
                id="year-order-edit"
                type="number"
                min="1"
                className="col-span-3"
                value={yearOrder}
                onChange={(e) => setYearOrder(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 