"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Giả lập trạng thái đăng nhập
const isLoggedIn = false

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Thư viện Tài liệu
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/departments" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Ngành học</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Tài liệu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/documents"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">Tất cả tài liệu</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Khám phá tất cả tài liệu học tập từ các ngành học
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/documents/recent" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Mới nhất</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tài liệu mới được tải lên
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/documents/popular" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Phổ biến</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tài liệu được xem nhiều nhất
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/forum" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Diễn đàn</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>ND</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/my-documents">Tài liệu của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/upload">Tải lên tài liệu</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link href="/departments" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Ngành học
            </Link>
            <Link href="/documents" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Tài liệu
            </Link>
            <Link href="/forum" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Diễn đàn
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Hồ sơ
                </Link>
                <Link href="/my-documents" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Tài liệu của tôi
                </Link>
                <Link href="/upload" className="py-2 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Tải lên tài liệu
                </Link>
                <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
