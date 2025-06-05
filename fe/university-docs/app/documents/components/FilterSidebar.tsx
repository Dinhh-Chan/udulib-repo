"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { getYears } from "@/lib/api/years"
import { getSubjects } from "@/lib/api/subject"
import { Year } from "@/types/year"
import { Subject } from "@/types/subject"

interface FilterSidebarProps {
  onFilter: (filters: {
    search?: string
    year_id?: number
    file_type?: string
    subject_id?: number
  }) => void
}

export function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [years, setYears] = useState<Year[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // State để lưu filters hiện tại đã apply
  const [appliedFilters, setAppliedFilters] = useState({
    year_id: undefined as number | undefined,
    file_type: undefined as string | undefined,
    subject_id: undefined as number | undefined,
  })
  
  // State để lưu filters tạm chưa apply
  const [tempFilters, setTempFilters] = useState({
    year_id: undefined as number | undefined,
    file_type: undefined as string | undefined,
    subject_id: undefined as number | undefined,
  })

  // Load years on component mount
  useEffect(() => {
    const loadYears = async () => {
      try {
        const yearsData = await getYears()
        setYears(yearsData)
      } catch (error) {
        console.error("Error loading years:", error)
      }
    }
    loadYears()
  }, [])

  // Load subjects when year changes
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await getSubjects()
        setSubjects(subjectsData)
      } catch (error) {
        console.error("Error loading subjects:", error)
      }
    }
    loadSubjects()
  }, [tempFilters.year_id])

  const handleYearChange = (yearId: number, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      year_id: checked ? yearId : undefined,
      subject_id: undefined // Reset subject when year changes
    }))
  }

  const handleSubjectChange = (subjectId: number, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      subject_id: checked ? subjectId : undefined
    }))
  }

  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      file_type: checked ? fileType : undefined
    }))
  }

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters)
    onFilter({
      year_id: tempFilters.year_id,
      file_type: tempFilters.file_type,
      subject_id: tempFilters.subject_id
    })
    setIsFilterOpen(false) // Đóng mobile sheet sau khi apply
  }

  const handleReset = () => {
    const resetFilters = {
      year_id: undefined,
      file_type: undefined,
      subject_id: undefined,
    }
    setTempFilters(resetFilters)
    setAppliedFilters(resetFilters)
    onFilter({})
  }

  const fileTypes = [
    { value: "PDF", label: "PDF" },
    { value: "DOC", label: "DOC/DOCX" },
    { value: "XLS", label: "XLS/XLSX" },
    { value: "PPT", label: "PPT/PPTX" },
    { value: "TXT", label: "TXT" },
    { value: "IMAGE", label: "Hình ảnh (JPG/PNG/GIF)" },
    { value: "OTHER", label: "Khác" }
  ]

  // Filter subjects based on selected year
  const filteredSubjects = tempFilters.year_id 
    ? subjects.filter(subject => subject.year_id === tempFilters.year_id)
    : subjects

  const FilterContent = () => (
    <div className="space-y-5">
      {/* Năm học */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Năm học</h3>
        <div className="space-y-2">
          {years.map((year) => (
            <div key={year.year_id} className="flex items-center space-x-2">
              <Checkbox 
                id={`year-${year.year_id}`}
                checked={tempFilters.year_id === year.year_id}
                onCheckedChange={(checked) => handleYearChange(year.year_id, checked as boolean)}
              />
              <Label htmlFor={`year-${year.year_id}`} className="text-sm font-normal">
                {year.year_name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Môn học */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Môn học</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => (
              <div key={subject.subject_id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`subject-${subject.subject_id}`}
                  checked={tempFilters.subject_id === subject.subject_id}
                  onCheckedChange={(checked) => handleSubjectChange(subject.subject_id, checked as boolean)}
                />
                <Label htmlFor={`subject-${subject.subject_id}`} className="text-sm font-normal">
                  {subject.subject_name}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {tempFilters.year_id ? "Không có môn học nào" : "Chọn năm học để xem môn học"}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Định dạng file */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Định dạng file</h3>
        <div className="space-y-2">
          {fileTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`format-${type.value}`}
                checked={tempFilters.file_type === type.value}
                onCheckedChange={(checked) => handleFileTypeChange(type.value, checked as boolean)}
              />
              <Label htmlFor={`format-${type.value}`} className="text-sm font-normal">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleApplyFilters}>
          Áp dụng bộ lọc
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Đặt lại
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Card className="w-64 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Bộ lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Bộ lọc tài liệu</SheetTitle>
              <SheetDescription>Lọc tài liệu theo các tiêu chí</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 