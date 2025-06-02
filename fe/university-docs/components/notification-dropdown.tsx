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
import { Notification, getUnreadNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/api/notification"
import { useAuth } from "@/contexts/auth-context"

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false);

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
      // Cập nhật thông báo mỗi 30 giây
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  useEffect(() => { setMounted(true); }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications([])
      router.push("/profile?tab=notifications")
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await markNotificationAsRead(notification.notification_id)
      // Cập nhật state ngay lập tức để UI phản hồi nhanh
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.notification_id !== notification.notification_id)
      )
      router.push("/profile?tab=notifications")
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  if (!mounted) return null;

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
              Đánh dấu đã đọc
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
                key={`notification-${notification.notification_id}`}
                className="p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => router.push("/profile?tab=notifications")}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
