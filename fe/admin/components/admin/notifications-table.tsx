"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Bell, Check, Trash2, Search } from "lucide-react"
import { showSuccessToast, showErrorToast, cn } from "@/lib/utils"
import {
  getNotifications,
  updateNotification,
  deleteNotification,
  markAllAsRead,
  type Notification
} from "@/lib/api/notification"
import { useAuth } from "@/contexts/auth-context"

interface NotificationsTableProps {
  page?: number
  per_page?: number
  onReload?: () => void
}

export function NotificationsTable({ page = 1, per_page = 20, onReload }: NotificationsTableProps) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return ""
    }
  }

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "warning":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([])
      setFilteredNotifications([])
      return
    }
    
    try {
      setIsLoading(true)
      const data = await getNotifications({ page, per_page })
      const notificationsArray = Array.isArray(data) ? data : []
      setNotifications(notificationsArray)
      setFilteredNotifications(notificationsArray)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      showErrorToast("Không thể tải danh sách thông báo")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page, per_page, isAuthenticated, user?.user_id])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotifications(notifications)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = notifications.filter(
        notification => 
          notification.title.toLowerCase().includes(query) || 
          notification.content.toLowerCase().includes(query)
      )
      setFilteredNotifications(filtered)
    }
  }, [searchQuery, notifications])

  const handleMarkAsRead = async (id: number) => {
    try {
      await updateNotification(id, { is_read: true })
      showSuccessToast("Đã đánh dấu là đã đọc")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      showErrorToast("Không thể đánh dấu thông báo")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id)
      showSuccessToast("Đã xóa thông báo")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error deleting notification:", error)
      showErrorToast("Không thể xóa thông báo")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      showSuccessToast("Đã đánh dấu tất cả là đã đọc")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      showErrorToast("Không thể đánh dấu tất cả thông báo")
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Đánh dấu tất cả là đã đọc
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {searchQuery ? "Không tìm thấy thông báo phù hợp" : "Không có thông báo nào"}
                </TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notification) => (
                <TableRow 
                  key={notification.notification_id} 
                  className={cn(
                    notification.is_read ? "" : "bg-blue-50",
                    getNotificationTypeColor(notification.type)
                  )}
                >
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>{notification.content}</TableCell>
                  <TableCell>
                    <Badge className={cn(getNotificationTypeBadge(notification.type))}>
                      {notification.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.is_read ? "secondary" : "default"}>
                      {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.is_read && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(notification.notification_id)}>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Đánh dấu đã đọc</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(notification.notification_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 