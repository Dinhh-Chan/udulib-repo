"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, Search, LogIn, BookOpen, ChevronDown, LogOut, User, Upload } from "lucide-react"
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

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

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
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm tài liệu..."
                  className="w-full pl-8"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild className="md:hidden">
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Link>
            </Button>
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
