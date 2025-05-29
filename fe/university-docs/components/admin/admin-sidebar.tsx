"use client"

import { cn } from "@/lib/utils"
import {
  BookOpen,
  ChevronLeft,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Tổng quan",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/documents",
      label: "Tài liệu",
      icon: <FileText className="h-4 w-4" />,
      active: pathname === "/admin/documents",
    },
    {
      href: "/admin/courses",
      label: "Môn học",
      icon: <BookOpen className="h-4 w-4" />,
      active: pathname === "/admin/courses",
    },
    {
      href: "/admin/majors",
      label: "Ngành học",
      icon: <GraduationCap className="h-4 w-4" />,
      active: pathname === "/admin/majors",
    },
    {
      href: "/admin/comments",
      label: "Bình luận",
      icon: <MessageSquare className="h-4 w-4" />,
      active: pathname === "/admin/comments",
    },
    {
      href: "/admin/forum",
      label: "Diễn đàn",
      icon: <MessageSquare className="h-4 w-4" />,
      active: pathname === "/admin/forum",
    },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/settings",
      label: "Cài đặt",
      icon: <Settings className="h-4 w-4" />,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <Sidebar className="border-r">
        <SidebarHeader className="flex flex-col gap-0 px-2">
          <div className="flex items-center justify-between py-2">
            <h2
              className={cn(
                "text-lg font-semibold tracking-tight transition-opacity",
                collapsed ? "opacity-0" : "opacity-100",
              )}
            >
              Quản trị
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")} />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild isActive={route.active} tooltip={collapsed ? route.label : undefined}>
                  <Link href={route.href} className="flex items-center gap-3">
                    {route.icon}
                    <span
                      className={cn(
                        "transition-opacity duration-200",
                        collapsed ? "opacity-0 w-0 hidden" : "opacity-100",
                      )}
                    >
                      {route.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
