"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra authentication và role admin
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để truy cập trang này")
      router.push("/login")
      return
    }

    if (!isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này")
      router.push("/")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return <>{children}</>
} 