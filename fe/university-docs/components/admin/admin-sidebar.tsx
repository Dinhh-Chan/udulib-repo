"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
  MessageCircle,
  BarChart,
} from "lucide-react"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobiles"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Bảng điều khiển",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Ngành học",
    href: "/admin/majors",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "Môn học",
    href: "/admin/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Tài liệu",
    href: "/admin/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Bình luận",
    href: "/admin/comments",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Diễn đàn",
    href: "/admin/forum",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    title: "Thống kê",
    href: "/admin/statistics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebar = (
    <div
      className={cn(
        "w-64 h-screen flex flex-col bg-white border-r transition-transform duration-300 ease-in-out",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && "fixed inset-y-0 left-0 z-50",
        !isMobile && "sticky top-0"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>Quản lý Tài liệu</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={isMobile ? () => setIsOpen(false) : undefined}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  pathname === item.href && "bg-muted font-medium",
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">admin@example.edu.vn</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {sidebar}
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed left-4 top-3 z-40" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {isMobile && isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />}
    </>
  )
}
