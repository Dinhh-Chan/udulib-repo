"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, MessageSquare, GraduationCap, FileText, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Tổng quan",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/documents",
      label: "Tài liệu",
      icon: <FileText className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/documents",
    },
    {
      href: "/admin/courses",
      label: "Môn học",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/courses",
    },
    {
      href: "/admin/majors",
      label: "Ngành học",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/majors",
    },
    {
      href: "/admin/comments",
      label: "Bình luận",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/comments",
    },
    {
      href: "/admin/forum",
      label: "Diễn đàn",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/forum",
    },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: <Users className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: <Settings className="h-4 w-4 mr-2" />,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Quản trị
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent" : "transparent"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
