"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      content: "Tài liệu của bạn đã được duyệt",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: "2",
      content: "Có bình luận mới về tài liệu của bạn",
      time: "Hôm qua",
      read: false,
    },
    {
      id: "3",
      content: "Bài viết của bạn trên diễn đàn đã nhận được câu trả lời mới",
      time: "2 ngày trước",
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Thông báo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? "bg-primary/5" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="text-sm">{notification.content}</div>
                <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">Không có thông báo mới</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link href="/profile?tab=notifications">Xem tất cả thông báo</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
