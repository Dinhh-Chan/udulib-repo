"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import type { User } from "@/types/user"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const user_id = searchParams.get("user_id")
        const access_token = searchParams.get("access_token")
        const username = searchParams.get("username")
        const email = searchParams.get("email")
        const role = searchParams.get("role")
        const full_name = searchParams.get("full_name")
        const university_id = searchParams.get("university_id")
        const status = searchParams.get("status")
        const created_at = searchParams.get("created_at")
  

        if (!access_token || !username || !email) {
          toast.error("Thiếu thông tin đăng nhập")
          router.replace("/login")
          return
        }

        // Tạo đối tượng user từ thông tin nhận được
        const user: User = {
          user_id: user_id ? parseInt(user_id) : 0, 
          username: username || "",
          email: email || "",
          full_name: full_name || "",
          role: role as any, 
          status: status as any, 
          university_id: university_id || "",
          created_at: new Date().toISOString(),
        }

        // Lưu thông tin đăng nhập
        login(user, access_token)
        toast.success("Đăng nhập thành công")
      } catch (error) {
        console.error("Google callback error:", error)
        toast.error("Đăng nhập thất bại, vui lòng thử lại")
        router.replace("/login")
      } finally {
        setIsProcessing(false)
      }
    }

    if (isProcessing) {
      handleGoogleCallback()
    }
  }, [searchParams, router, login, isProcessing])

  if (!isProcessing) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Đang xử lý đăng nhập...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
} 