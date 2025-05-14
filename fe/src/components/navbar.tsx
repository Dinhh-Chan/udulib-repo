"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Menu, Search, LogIn, BookOpen, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { cn } from "../lib/utils"
import ThemeToggle from "./theme-toggle"
import LanguageSwitcher from "./language-switcher"
import NotificationDropdown from "./notification-dropdown"

const mainNavItems = [
  { title: "Trang chủ", href: "/" },
  { title: "Ngành học", href: "/departments" },
  { title: "Tài liệu mới", href: "/documents/recent" },
  { title: "Hướng dẫn", href: "/guide" },
]

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link to="/" className="flex items-center gap-2 font-bold">
                  <BookOpen className="h-5 w-5" />
                  <span>EduDocs</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 px-2 pt-8">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md",
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="hidden md:flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5" />
            <span>EduDocs</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <span>Danh mục</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/departments/it">Công nghệ thông tin</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/departments/finance">Tài chính</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/departments/accounting">Kế toán</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/departments">Xem tất cả ngành học</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Link to="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Tìm kiếm</span>
            </Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
          <NotificationDropdown />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Đăng nhập</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="hidden md:inline-flex">
            <Link to="/login">Đăng nhập</Link>
          </Button>
          <Button asChild className="hidden md:inline-flex">
            <Link to="/register">Đăng ký</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
