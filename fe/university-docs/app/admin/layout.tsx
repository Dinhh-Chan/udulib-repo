"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, LayoutDashboard, BookOpen, MessageSquare, GraduationCap, FileText, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
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
    <div className={cn("pb-12", className)}>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
                  <Sidebar />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link href="/admin" className="flex items-center space-x-2">
                  <span className="font-bold">Admin Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
              <Sidebar />
            </ScrollArea>
          </aside>
          <main className="flex w-full flex-col overflow-hidden p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  )
}
