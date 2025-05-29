"use client"

import { usePathname } from "next/navigation"
import React from "react"

interface MainLayoutProps {
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
}

export default function MainLayout({ 
  children, 
  navbar, 
  footer 
}: MainLayoutProps) {
  const pathname = usePathname()
  
  // Kiểm tra nếu đường dẫn bắt đầu bằng /admin
  const isAdmin = pathname?.startsWith('/admin')
  
  // Nếu là trang admin, không hiển thị navbar và footer
  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {navbar}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px] w-full">
        <main className="flex-1 py-6">
          {children}
        </main>
      </div>
      {footer}
    </div>
  )
} 