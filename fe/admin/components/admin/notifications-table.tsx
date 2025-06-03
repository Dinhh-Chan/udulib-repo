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
import { toast } from "sonner"
import {
  getNotifications,
  updateNotification,
  deleteNotification,
  markAllAsRead,
  type Notification
} from "@/lib/api/notification"

interface NotificationsTableProps {
  page?: number
  per_page?: number
  onReload?: () => void
}

export function NotificationsTable({ page = 1, per_page = 20, onReload }: NotificationsTableProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await getNotifications({ page, per_page })
      const notificationsArray = Array.isArray(data) ? data : []
      setNotifications(notificationsArray)
      setFilteredNotifications(notificationsArray)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Không thể tải danh sách thông báo")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [page, per_page])

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
      toast.success("Đã đánh dấu là đã đọc")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Không thể đánh dấu thông báo")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id)
      toast.success("Đã xóa thông báo")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Không thể xóa thông báo")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success("Đã đánh dấu tất cả là đã đọc")
      fetchNotifications()
      onReload?.()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Không thể đánh dấu tất cả thông báo")
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
                <TableRow key={notification.notification_id} className={notification.is_read ? "" : "bg-blue-50"}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>{notification.content}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {notification.type}
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