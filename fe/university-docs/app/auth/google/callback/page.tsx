"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code")
        
        if (!code) {
          toast.error("Không tìm thấy mã xác thực từ Google")
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || "Đăng nhập thất bại")
        }

        // Lưu thông tin đăng nhập
        login(data.user, data.access_token)
        
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