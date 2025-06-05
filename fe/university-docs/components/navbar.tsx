"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, Search, LogIn, BookOpen, ChevronDown, LogOut, User, Upload, HelpCircle, MessageCircle, Mail, MessageSquare } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import ThemeToggle from "@/components/theme-toggle"
import NotificationDropdown from "@/components/notification-dropdown"
import { useAuth } from "@/contexts/auth-context"

const mainNavItems = [
  { title: "Trang chủ", href: "/" },
  { title: "Ngành học", href: "/departments" },
  { title: "Tài liệu", href: "/documents" },
  { title: "Thảo luận", href: "/forum" },
]

const supportItems = [
  { title: "Hướng dẫn", href: "/guide", icon: BookOpen },
  { title: "Câu hỏi thường gặp", href: "/faq", icon: HelpCircle },
  { title: "Trung tâm hỗ trợ", href: "/help", icon: MessageCircle },
  { title: "Liên hệ", href: "/contact", icon: Mail },
  { title: "Góp ý", href: "/feedback", icon: MessageSquare },
]

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // hoặc loading skeleton

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="px-7">
                  <Link href="/" className="flex items-center gap-2 font-bold">
                    <BookOpen className="h-5 w-5" />
                    <span>UduLib</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 px-2 pt-8">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">HỖ TRỢ</p>
                    {supportItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md",
                          pathname === item.href && "bg-accent text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </nav>
                {!isAuthenticated && (
                  <div className="mt-4 px-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            <Link href="/" className="hidden md:flex items-center gap-2 font-bold">
              <BookOpen className="h-5 w-5" />
              <span>UduLib</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </Link>
              ))}
              {/* Support Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground p-0 h-auto">
                    Hỗ trợ
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {supportItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                  <Link href="/upload">
                    <Upload className="h-5 w-5" />
            <span className="sr-only">Tải lên tài liệu</span>
                  </Link>
                </Button>
              </>
            ) : null}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Tài khoản</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden md:inline-flex">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
