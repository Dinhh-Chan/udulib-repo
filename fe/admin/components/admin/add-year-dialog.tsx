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
import { useToast } from "@/components/ui/use-toast"
import { YearCreate } from "@/types/year"
import { createYear } from "@/lib/api/years"

interface AddYearDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddYearDialog({ open, onOpenChange, onSuccess }: AddYearDialogProps) {
  const [yearName, setYearName] = useState("")
  const [yearOrder, setYearOrder] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!yearName.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tên năm học"
      })
      return
    }

    const yearData: YearCreate = {
      year_name: yearName.trim(),
      year_order: yearOrder
    }

    setIsLoading(true)
    try {
      const result = await createYear(yearData)
      if (result) {
        toast({
          title: "Thành công",
          description: "Đã thêm năm học mới thành công"
        })
        setYearName("")
        setYearOrder(1)
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error("Error creating year:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm năm học. Vui lòng thử lại sau."
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
            <DialogTitle>Thêm năm học mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để thêm năm học mới vào hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year-name" className="text-right">
                Tên năm học
              </Label>
              <Input
                id="year-name"
                placeholder="VD: Năm học 2023-2024"
                className="col-span-3"
                value={yearName}
                onChange={(e) => setYearName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year-order" className="text-right">
                Thứ tự
              </Label>
              <Input
                id="year-order"
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
              {isLoading ? "Đang xử lý..." : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 