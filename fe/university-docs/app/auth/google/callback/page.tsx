"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import type { User } from "@/types/user"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const access_token = searchParams.get("access_token")
        const username = searchParams.get("username")
        const email = searchParams.get("email")
        
        if (!access_token || !username || !email) {
          toast.error("Thiếu thông tin đăng nhập")
          router.push("/login")
          return
        }

        // Tạo đối tượng user từ thông tin nhận được
        const user: User = {
          user_id: 0, // Sẽ được cập nhật sau khi lấy thông tin chi tiết từ API
          username,
          email,
          full_name: username,
          role: undefined as any, // Cho phép bỏ trống
          status: undefined as any, // Cho phép bỏ trống
          university_id: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }

        // Lưu thông tin đăng nhập
        login(user, access_token)
        
        // Xóa các tham số trên URL
        window.history.replaceState({}, document.title, window.location.pathname)
        
        toast.success("Đăng nhập thành công")
        router.push("/")
      } catch (error) {
        console.error("Google callback error:", error)
        toast.error("Đăng nhập thất bại, vui lòng thử lại")
        router.push("/login")
      }
    }

    handleGoogleCallback()
  }, [searchParams, router, login])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
} 