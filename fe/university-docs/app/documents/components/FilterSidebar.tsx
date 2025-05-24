"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { useState } from "react"

interface FilterSidebarProps {
  onFilter: (filters: {
    search?: string
    major_id?: number
    year_id?: number
    file_type?: string
    subject_id?: number
  }) => void
}

export function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    major_id: undefined as number | undefined,
    year_id: undefined as number | undefined,
    file_type: undefined as string | undefined,
    subject_id: undefined as number | undefined,
  })

  const handleFilterChange = (key: string, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    setFilters({
      major_id: undefined,
      year_id: undefined,
      file_type: undefined,
      subject_id: undefined,
    })
    onFilter({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Ngành học</Label>
        <Select
          value={filters.major_id?.toString()}
          onValueChange={(value) => handleFilterChange("major_id", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn ngành học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Công nghệ thông tin</SelectItem>
            <SelectItem value="2">Điện tử viễn thông</SelectItem>
            <SelectItem value="3">Tài chính - Ngân hàng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Năm học</Label>
        <Select
          value={filters.year_id?.toString()}
          onValueChange={(value) => handleFilterChange("year_id", parseInt(value))}
        >
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label>Loại file</Label>
        <Select
          value={filters.file_type}
          onValueChange={(value) => handleFilterChange("file_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại file" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="application/pdf">PDF</SelectItem>
            <SelectItem value="application/msword">DOC</SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
              DOCX
            </SelectItem>
            <SelectItem value="application/vnd.ms-powerpoint">PPT</SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.presentationml.presentation">
              PPTX
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Môn học</Label>
        <Select
          value={filters.subject_id?.toString()}
          onValueChange={(value) => handleFilterChange("subject_id", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Nhập môn lập trình</SelectItem>
            <SelectItem value="2">Cấu trúc dữ liệu và giải thuật</SelectItem>
            <SelectItem value="3">Cơ sở dữ liệu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={handleReset}>
        Đặt lại bộ lọc
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Card className="w-64 shrink-0">
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 