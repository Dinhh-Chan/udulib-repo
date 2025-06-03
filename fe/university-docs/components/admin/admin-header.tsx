"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { AdminSidebar } from "./admin-sidebar"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet>
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
            <AdminSidebar />
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
  )
}
