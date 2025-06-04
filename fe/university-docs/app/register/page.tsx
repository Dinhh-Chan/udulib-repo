"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Toaster } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    role: "",
    university_id: "",
    phone_number: "",
    terms: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      university_id: ""
    }))
  }

  const getUniversityIdLabel = () => {
    switch (formData.role) {
      case "student":
        return "Mã sinh viên"
      case "lecturer":
        return "Mã giảng viên"
      default:
        return "Mã sinh viên, mã giảng viên"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    if (!formData.terms) {
      toast.error("Vui lòng đồng ý với điều khoản sử dụng")
      return
    }

    if (!formData.role) {
      toast.error("Vui lòng chọn vai trò")
      return
    }

    if (!['student', 'lecturer', 'admin'].includes(formData.role)) {
      toast.error("Vai trò không hợp lệ")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
          university_id: formData.university_id,
          phone_number: formData.phone_number
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.detail === "Email already registered") {
          toast.error("Email đã được đăng ký")
        } else if (response.status === 422) {
          // Xử lý lỗi validation
          const errorMessage = data.detail?.[0]?.msg || "Dữ liệu không hợp lệ"
          toast.error(errorMessage)
        } else {
          toast.error(data.detail || 'Đăng ký thất bại')
        }
        setIsLoading(false)
        return
      }

      toast.success(data.message || "Đăng ký thành công!", {
        duration: 2000,
        position: "top-center"
      })

      // Thêm độ trễ 2 giây trước khi chuyển trang
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký")
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8 px-4 md:px-6">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
          <CardDescription>Tạo tài khoản để tải lên và quản lý tài liệu học tập</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input 
                id="username" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input 
                id="full_name" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input 
                id="phone_number" 
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select 
                required
                value={formData.role}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò của bạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="lecturer">Giảng viên</SelectItem>
                  <SelectItem value="admin">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university_id">{getUniversityIdLabel()}</Label>
              <Input 
                id="university_id" 
                name="university_id"
                value={formData.university_id}
                onChange={handleChange}
                required 
                placeholder={formData.role === "student" ? "Nhập mã sinh viên" : formData.role === "lecturer" ? "Nhập mã giảng viên" : "Nhập mã"}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                name="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, terms: checked as boolean }))
                }
                required 
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                Tôi đồng ý với{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  chính sách bảo mật
                </Link>
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
            <div className="text-center text-sm">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
