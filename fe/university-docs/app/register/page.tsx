"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { AuthContainer } from "@/components/ui/auth-container"
import { motion } from "framer-motion"
import { handleGoogleLogin } from "@/lib/api/auth"
import { FcGoogle } from "react-icons/fc"


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
    
    // Xử lý đặc biệt cho số điện thoại
    if (name === 'phone_number') {
      // Chỉ cho phép nhập số
      const numericValue = value.replace(/[^0-9]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
      return
    }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    // Kiểm tra số điện thoại
    if (formData.phone_number.length < 10 || formData.phone_number.length > 11) {
      toast.error("Số điện thoại phải có 10-11 số")
      return
    }

    if (!formData.phone_number.startsWith('0')) {
      toast.error("Số điện thoại phải bắt đầu bằng số 0")
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

    // Kiểm tra university_id chỉ khi role là student hoặc lecturer
    if (['student', 'lecturer'].includes(formData.role) && !formData.university_id) {
      toast.error(`Vui lòng nhập ${formData.role === 'student' ? 'mã sinh viên' : 'mã giảng viên'}`)
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

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký")
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản để tải lên và quản lý tài liệu học tập"
    >
      <Toaster position="top-center" richColors />
      <form onSubmit={handleSubmit} className="space-y-4">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} />
              Đăng ký bằng Google
            </Button>
          </motion.div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc đăng ký với
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input 
              id="username" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="full_name">Họ và tên</Label>
            <Input 
              id="full_name" 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required 
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="phone_number">Số điện thoại</Label>
            <Input 
              id="phone_number" 
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              maxLength={11}
              required 
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Label htmlFor="password">Mật khẩu</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword"
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
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
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Label htmlFor="university_id">{getUniversityIdLabel()}</Label>
            <Input 
              id="university_id" 
              name="university_id"
              value={formData.university_id}
              onChange={handleChange}
              required={formData.role !== 'admin'}
              placeholder={formData.role === "student" ? "Nhập mã sinh viên" : formData.role === "lecturer" ? "Nhập mã giảng viên" : "Nhập mã (không bắt buộc)"}
            />
          </motion.div>
        </div>

        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </motion.div>

        <motion.div 
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </motion.div>
      </form>
    </AuthContainer>
  )
}
