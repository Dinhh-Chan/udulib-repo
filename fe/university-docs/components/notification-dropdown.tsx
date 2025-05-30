"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Notification, getUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api/notification"
import { useAuth } from "@/contexts/auth-context"

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const fetchNotifications = async () => {
    try {
      const data = await getUnreadNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      // Poll for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await markNotificationAsRead(notification.id)
      setNotifications(notifications.filter(n => n.id !== notification.id))
      router.push(`/profile?tab=notifications`)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications([])
      router.push(`/profile?tab=notifications`)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  if (!isAuthenticated) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          <span className="sr-only">Thông báo</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <h4 className="font-medium">Thông báo</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Không có thông báo mới
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {notification.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => router.push("/profile?tab=notifications")}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
