"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Upload, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Giả lập quá trình tải lên
    setTimeout(() => {
      setIsUploading(false)
      setUploadSuccess(true)
    }, 2000)
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
                  <Label htmlFor="title">Tiêu đề tài liệu</Label>
                  <Input id="title" placeholder="Nhập tiêu đề tài liệu" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về nội dung tài liệu"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Ngành học</Label>
                    <Select required>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Chọn ngành học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">Công nghệ thông tin</SelectItem>
                        <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                        <SelectItem value="accounting">Kế toán</SelectItem>
                        <SelectItem value="business">Quản trị kinh doanh</SelectItem>
                        <SelectItem value="economics">Kinh tế</SelectItem>
                        <SelectItem value="law">Luật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Năm học</Label>
                    <Select required>
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

                <div className="space-y-2">
                  <Label htmlFor="course">Môn học</Label>
                  <Select required>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intro-to-programming">Nhập môn lập trình</SelectItem>
                      <SelectItem value="data-structures">Cấu trúc dữ liệu và giải thuật</SelectItem>
                      <SelectItem value="oop">Lập trình hướng đối tượng</SelectItem>
                      <SelectItem value="database">Cơ sở dữ liệu</SelectItem>
                      <SelectItem value="web-development">Phát triển ứng dụng web</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại tài liệu</Label>
                  <Select required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại tài liệu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Bài giảng</SelectItem>
                      <SelectItem value="exercise">Bài tập</SelectItem>
                      <SelectItem value="exam">Đề thi</SelectItem>
                      <SelectItem value="reference">Tài liệu tham khảo</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Tệp tài liệu</Label>
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
