"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, AlertCircle, Check, ChevronsUpDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { uploadDocument } from "@/lib/api/documents"
import { getSubjects } from "@/lib/api/subject"
import { Subject } from "@/types/subject"
<<<<<<< HEAD
import { cn } from "@/lib/api/utils"
=======
import { cn } from "@/lib/utils"
>>>>>>> 3c35902094cc5ae9d14dcaca99c44a5ed2a2d9ed
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const { isAuthenticated } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    type: ""
  })

  // Load subjects khi modal mở và user đã authenticated
  useEffect(() => {
    const loadSubjects = async () => {
      if (open && isAuthenticated) {
        try {
          setIsLoadingSubjects(true)
          const subjectsData = await getSubjects()
          setSubjects(subjectsData)
        } catch (error) {
          console.error("Error loading subjects:", error)
          toast.error("Không thể tải danh sách môn học")
        } finally {
          setIsLoadingSubjects(false)
        }
      }
    }
    loadSubjects()
  }, [open, isAuthenticated])

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      setFile(null)
      setUploadSuccess(false)
      setFormData({
        title: "",
        description: "",
        subject_id: "",
        type: ""
      })
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tải lên tài liệu")
      return
    }

    if (!file) {
      toast.error("Vui lòng chọn tệp tài liệu")
      return
    }

    if (!formData.subject_id) {
      toast.error("Vui lòng chọn môn học")
      return
    }

    try {
      setIsUploading(true)
      
      await uploadDocument({
        title: formData.title,
        description: formData.description,
        subject_id: parseInt(formData.subject_id),
        file: file
      })
      
      setUploadSuccess(true)
      toast.success("Tải lên tài liệu thành công!")
    } catch (error) {
      console.error(error)
      toast.error("Có lỗi xảy ra khi tải lên tài liệu")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset sau một chút để tránh hiệu ứng visual khi đóng
    setTimeout(() => {
      setUploadSuccess(false)
      setFile(null)
      setFormData({
        title: "",
        description: "",
        subject_id: "",
        type: ""
      })
    }, 300)
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng nhập để tải lên tài liệu</DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập để có thể tải lên tài liệu
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild onClick={handleClose}>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button variant="outline" asChild onClick={handleClose}>
              <Link href="/register">Đăng ký</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
          <DialogDescription>
            Chia sẻ tài liệu học tập với cộng đồng sinh viên và giảng viên
          </DialogDescription>
        </DialogHeader>

        {uploadSuccess ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Tải lên hoàn tất</AlertTitle>
              <AlertDescription>
                Tài liệu của bạn sẽ được hiển thị sau khi được kiểm duyệt. Cảm ơn bạn đã đóng góp!
              </AlertDescription>
            </Alert>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                Đóng
              </Button>
              <Button onClick={() => setUploadSuccess(false)}>
                Tải lên tài liệu khác
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề tài liệu <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề tài liệu" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn gọn về nội dung tài liệu"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject_id">Môn học <span className="text-red-500">*</span></Label>
              {isLoadingSubjects ? (
                <div className="h-10 bg-muted animate-pulse rounded-md" />
              ) : (
                <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={subjectOpen}
                      className="w-full justify-between"
                    >
                      {formData.subject_id
                        ? subjects.find(subject => subject.subject_id === parseInt(formData.subject_id))?.subject_name
                        : "Chọn môn học..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {subjects.map((subject) => (
                          <CommandItem
                            key={subject.subject_id}
                            value={subject.subject_id.toString()}
                            onSelect={(currentValue) => {
                              handleSelectChange("subject_id", currentValue)
                              setSubjectOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.subject_id === subject.subject_id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {subject.subject_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Tệp tài liệu <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                      Chọn tệp khác
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-medium mb-1 text-sm">Kéo và thả tệp vào đây hoặc</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Hỗ trợ PDF, DOCX, PPTX, JPG, PNG (tối đa 20MB)
                    </p>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        Chọn tệp
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                          required
                        />
                      </Label>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription className="text-sm">
                Bằng việc tải lên tài liệu, bạn xác nhận rằng bạn có quyền chia sẻ tài liệu này và đồng ý với{" "}
                <Link href="/terms" className="underline">
                  điều khoản sử dụng
                </Link>{" "}
                của chúng tôi.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={!file || isUploading}>
                {isUploading ? "Đang tải lên..." : "Tải lên tài liệu"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 