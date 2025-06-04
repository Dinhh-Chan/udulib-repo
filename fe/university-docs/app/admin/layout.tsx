"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Chỉ thực hiện redirect khi đã load xong
    if (isLoading) return

    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      const currentPath = window.location.pathname
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
      toast.error("Vui lòng đăng nhập để truy cập trang này", {
        duration: 3000,
        position: "top-center"
      })
      return
    }

    if (!isAdmin) {
      // Nếu đã đăng nhập nhưng không phải admin, chuyển hướng về trang chủ
      router.push("/")
      toast.error("Bạn không có quyền truy cập trang này", {
        duration: 3000,
        position: "top-center"
      })
      return
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  // Hiển thị loading trong khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  // Nếu không hợp lệ, hiển thị loading trong khi redirect
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}