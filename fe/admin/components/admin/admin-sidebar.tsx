"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Users,
  Settings,
  ChevronLeft,
  Home,
  Bell,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10"
  },
  {
    label: "Tài liệu",
    icon: FileText,
    href: "/admin/documents",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10"
  },
  {
    label: "Môn học",
    icon: BookOpen,
    href: "/admin/courses",
    color: "text-pink-700",
    bgColor: "bg-pink-700/10"
  },
  {
    label: "Ngành học",
    icon: GraduationCap,
    href: "/admin/majors",
    color: "text-orange-700",
    bgColor: "bg-orange-700/10"
  },
  {
    label: "Diễn đàn",
    icon: MessageSquare,
    href: "/admin/forum",
    color: "text-blue-700",
    bgColor: "bg-blue-700/10"
  },
  {
    label: "Người dùng",
    icon: Users,
    href: "/admin/users",
    color: "text-green-700",
    bgColor: "bg-green-700/10"
  },
  {
    label: "Thông báo",
    icon: Bell,
    href: "/admin/notifications",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10"
  },
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-700",
    bgColor: "bg-gray-700/10"
  },
  {
    label: "Quản lý Tag",
    href: "/admin/tags",
    icon: Tag,
    role: ["admin"],
    color: "text-gray-700",
    bgColor: "bg-gray-700/10"
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Quản trị
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 ml-auto"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <div className="px-3 space-y-1">
            {/* Home Link */}
            <Link
              href="/"
              className={cn(
                "flex items-center gap-x-2 text-sidebar-foreground text-sm font-medium p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all mb-4",
                isCollapsed && "justify-center"
              )}
            >
              <Home className="h-4 w-4 text-primary" />
              {!isCollapsed && <span>Trang chủ</span>}
            </Link>

            {/* Routes */}
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-2 text-sidebar-foreground text-sm font-medium p-2 rounded-md transition-all group",
                  pathname === route.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50",
                  isCollapsed && "justify-center"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md transition-colors",
                  pathname === route.href ? route.bgColor : "group-hover:" + route.bgColor
                )}>
                  <route.icon className={cn("h-4 w-4", route.color)} />
                </div>
                {!isCollapsed && (
                  <span className="transition-opacity duration-200">
                    {route.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground",
            isCollapsed && "justify-center"
          )}>
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {!isCollapsed && <span>Hệ thống đang hoạt động</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
