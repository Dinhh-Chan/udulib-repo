"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Upload, FileText, AlertCircle, Check, ChevronsUpDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { uploadDocument } from "@/lib/api/documents"
import { getSubjects } from "@/lib/api/subject"
import { Subject } from "@/types/subject"
import Loading from "@/app/loading"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function UploadPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    type: ""
  })

  // Kiểm tra đăng nhập và lấy danh sách môn học
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast.error("Vui lòng đăng nhập để tải lên tài liệu")
        router.push("/login")
        return
      }

      try {
        const subjectsData = await getSubjects()
        setSubjects(subjectsData)
      } catch (error) {
        console.error("Error loading subjects:", error)
        toast.error("Không thể tải danh sách môn học")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

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
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("subject_id", formData.subject_id)
      formDataToSend.append("file", file)
      
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

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Tải lên tài liệu</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Tải lên tài liệu</h1>
          <p className="text-muted-foreground">Chia sẻ tài liệu học tập với cộng đồng sinh viên và giảng viên</p>
        </div>

        {uploadSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Tải lên thành công!</CardTitle>
              <CardDescription>Tài liệu của bạn đã được tải lên thành công và đang chờ kiểm duyệt.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Tải lên hoàn tất</AlertTitle>
                <AlertDescription>
                  Tài liệu của bạn sẽ được hiển thị sau khi được kiểm duyệt. Cảm ơn bạn đã đóng góp!
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/">Về trang chủ</Link>
              </Button>
              <Button asChild>
                <Link href="/upload">Tải lên tài liệu khác</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin tài liệu</CardTitle>
                <CardDescription>Vui lòng điền đầy đủ thông tin về tài liệu bạn muốn tải lên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject_id">Môn học <span className="text-red-500">*</span></Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
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
                        <CommandGroup className="max-h-[400px] overflow-y-auto">
                          {subjects.map((subject) => (
                            <CommandItem
                              key={subject.subject_id}
                              value={subject.subject_id.toString()}
                              onSelect={(currentValue) => {
                                handleSelectChange("subject_id", currentValue)
                                setOpen(false)
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Tệp tài liệu <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                          Chọn tệp khác
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="font-medium mb-1">Kéo và thả tệp vào đây hoặc</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Hỗ trợ PDF, DOCX, PPTX, JPG, PNG (tối đa 20MB)
                        </p>
                        <Button type="button" variant="outline" asChild>
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
                  <AlertDescription>
                    Bằng việc tải lên tài liệu, bạn xác nhận rằng bạn có quyền chia sẻ tài liệu này và đồng ý với{" "}
                    <Link href="/terms" className="underline">
                      điều khoản sử dụng
                    </Link>{" "}
                    của chúng tôi.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={!file || isUploading} className="w-full">
                  {isUploading ? "Đang tải lên..." : "Tải lên tài liệu"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </div>
  )
}
