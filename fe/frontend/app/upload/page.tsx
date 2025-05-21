"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileText } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

// Dữ liệu mẫu cho ngành học và môn học
const departments = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    courses: [
      { id: "1", name: "Nhập môn lập trình" },
      { id: "2", name: "Toán rời rạc" },
      { id: "5", name: "Cấu trúc dữ liệu và giải thuật" },
      { id: "9", name: "Phát triển ứng dụng web" },
    ],
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    courses: [
      { id: "20", name: "Kinh tế vĩ mô" },
      { id: "21", name: "Tài chính doanh nghiệp" },
    ],
  },
]

// Dữ liệu mẫu cho năm học
const years = [
  { id: "1", name: "Năm 1" },
  { id: "2", name: "Năm 2" },
  { id: "3", name: "Năm 3" },
  { id: "4", name: "Năm 4" },
]

export default function UploadPage() {
  const searchParams = useSearchParams()
  const departmentId = searchParams.get("department")
  const courseId = searchParams.get("course")

  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentId || "")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>(courseId || "")
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý tải lên tài liệu
    console.log({
      title,
      description,
      department: selectedDepartment,
      year: selectedYear,
      course: selectedCourse,
      tags,
      file,
    })

    // Trong thực tế, bạn sẽ gửi dữ liệu này đến server
    alert("Tài liệu đã được tải lên thành công!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Tải lên tài liệu</h1>
        <p className="text-muted-foreground mb-8">Chia sẻ tài liệu học tập với cộng đồng sinh viên và giảng viên</p>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài liệu</CardTitle>
              <CardDescription>Vui lòng điền đầy đủ thông tin để tài liệu dễ dàng được tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề tài liệu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề tài liệu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả tài liệu <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn gọn về nội dung tài liệu"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">
                    Ngành học <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment} required>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Chọn ngành học" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">
                    Năm học <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear} required>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Chọn năm học" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">
                  Môn học <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                  required
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder={selectedDepartment ? "Chọn môn học" : "Vui lòng chọn ngành học trước"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDepartment &&
                      departments
                        .find((d) => d.id === selectedDepartment)
                        ?.courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Thẻ tag</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Thêm thẻ tag (ví dụ: Bài tập, Đề thi, Slide...)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Thêm
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="rounded-full hover:bg-muted p-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Xóa tag</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">
                  Tài liệu <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                        Chọn tài liệu khác
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground mb-2">
                        Kéo và thả tài liệu vào đây hoặc nhấp để chọn tài liệu
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Hỗ trợ các định dạng: PDF, DOCX, PPTX, XLSX (Tối đa 50MB)
                      </p>
                      <Button type="button" variant="outline">
                        Chọn tài liệu
                      </Button>
                      <Input
                        id="file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.pptx,.xlsx"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit">Tải lên</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
