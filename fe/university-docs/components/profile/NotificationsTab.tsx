import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Notification, getAllNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/api/notification"
import { toast } from "sonner"

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [activeNotificationTab, setActiveNotificationTab] = useState("all")

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true)
    try {
      const data = await getAllNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      toast.error("Không thể tải thông báo")
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.notification_id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      )
      toast.success("Đã đánh dấu thông báo đã đọc")
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast.error("Không thể đánh dấu thông báo đã đọc")
    }
  }

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, is_read: true }))
      )
      toast.success("Đã đánh dấu tất cả thông báo đã đọc")
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc")
    }
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "warning":
        return "bg-amber-100 border-amber-300 text-amber-800"
      case "success":
        return "bg-green-100 border-green-300 text-green-800"
      case "error":
        return "bg-red-100 border-red-300 text-red-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500 text-white"
      case "warning":
        return "bg-amber-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const renderNotifications = (filteredNotifications: Notification[]) => (
    <div className="space-y-3 sm:space-y-4">
      {filteredNotifications.map((notification) => (
        <div
          key={`notification-${notification.notification_id}`}
          className={`p-3 sm:p-4 border rounded-lg ${
            !notification.is_read 
              ? notification.type 
                ? getNotificationTypeColor(notification.type)
                : "bg-primary/5 border-primary/20" 
              : ""
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                notification.is_read ? "bg-muted" : "bg-primary"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  getNotificationTypeBadge(notification.type || "info")
                }`}>
                  {(notification.type || "info").toUpperCase()}
                </span>
                <p className="font-medium text-sm sm:text-base truncate">{notification.title}</p>
              </div>
              <p className={`text-xs sm:text-sm ${notification.is_read ? "text-muted-foreground" : ""}`}>
                {notification.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkNotificationAsRead(notification.notification_id)}
                className="flex-shrink-0 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                <span className="sm:hidden">Đã đọc</span>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Thông báo</CardTitle>
        <CardDescription className="text-sm">Quản lý thông báo của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeNotificationTab} onValueChange={setActiveNotificationTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">Tất cả</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs sm:text-sm">Chưa đọc</TabsTrigger>
            <TabsTrigger value="read" className="text-xs sm:text-sm">Đã đọc</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 sm:mt-6">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length > 0 ? (
              <>
                {renderNotifications(notifications)}
                {notifications.some(n => !n.is_read) && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllNotificationsAsRead}
                      className="text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                      <span className="sm:hidden">Đọc tất cả</span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                Không có thông báo nào
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="mt-4 sm:mt-6">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.filter(n => !n.is_read).length > 0 ? (
              <>
                {renderNotifications(notifications.filter(n => !n.is_read))}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllNotificationsAsRead}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                    <span className="sm:hidden">Đọc tất cả</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                Không có thông báo chưa đọc
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="read" className="mt-4 sm:mt-6">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.filter(n => n.is_read).length > 0 ? (
              renderNotifications(notifications.filter(n => n.is_read))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                Không có thông báo đã đọc
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 