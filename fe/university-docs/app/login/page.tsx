"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { FcGoogle } from "react-icons/fc"
import { AuthContainer } from "@/components/ui/auth-container"
import { motion } from "framer-motion"
import { handleGoogleLogin } from "@/lib/api/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Tên đăng nhập hoặc mật khẩu không đúng", {
            duration: 3000,
            position: "top-center"
          })
        } else {
          toast.error(data.detail || "Đăng nhập thất bại", {
            duration: 3000,
            position: "top-center"
          })
        }
        setIsLoading(false)
        return
      }

      login(data.user, data.access_token)
      
      toast.success("Đăng nhập thành công", {
        duration: 3000,
        position: "top-center"
      })
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
        duration: 3000,
        position: "top-center"
      })
      setIsLoading(false)
    }
  }

  return (
    <AuthContainer
      title="Đăng nhập"
      subtitle="Đăng nhập để tải lên và quản lý tài liệu học tập"
      className="max-w-md"
    >
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
            Đăng nhập bằng Google
          </Button>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

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
            type="text" 
            placeholder="Nhập tên đăng nhập" 
            required 
            value={formData.username}
            onChange={handleInputChange}
          />
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required 
            value={formData.password}
            onChange={handleInputChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </motion.div>

        <motion.div 
          className="text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </motion.div>
      </form>
    </AuthContainer>
  )
}
