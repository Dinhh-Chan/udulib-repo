import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"
import { toast } from "sonner"

export type NotificationType = "info" | "warning" | "success" | "error"

export interface Notification {
  notification_id: number
  user_id: number
  title: string
  content: string
  type: NotificationType
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface NotificationCreate {
  title: string
  content: string
  type: NotificationType
}

export interface NotificationUpdate {
  title?: string
  content?: string
  type?: NotificationType
  is_read?: boolean
}

export interface GetNotificationsParams {
  page?: number
  per_page?: number
  is_read?: boolean
  type?: NotificationType
  sort?: string
}

export async function getNotifications(params?: GetNotificationsParams): Promise<Notification[]> {
  try {
    const response: AxiosResponse<Notification[]> = await apiClient.get("/notifications/", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching notifications:", error)
    toast.error("Không thể tải danh sách thông báo")
    return []
  }
}

export async function createNotification(data: NotificationCreate): Promise<Notification | null> {
  try {
    const response: AxiosResponse<Notification> = await apiClient.post("/notifications/", data)
    toast.success("Tạo thông báo thành công")
    return response.data
  } catch (error) {
    console.error("Error creating notification:", error)
    toast.error("Không thể tạo thông báo mới")
    return null
  }
}

export async function createNotificationForUser(data: NotificationCreate & { target_user_id: number }): Promise<Notification | null> {
  try {
    const { target_user_id, ...notificationData } = data
    const response: AxiosResponse<Notification> = await apiClient.post(`/notifications/admin?target_user_id=${target_user_id}`, notificationData)
    toast.success("Gửi thông báo cho người dùng thành công")
    return response.data
  } catch (error) {
    console.error("Error creating notification for user:", error)
    toast.error("Không thể gửi thông báo cho người dùng")
    return null
  }
}

export async function createNotificationForAllUsers(data: NotificationCreate): Promise<{ status: string; message: string } | null> {
  try {
    const response: AxiosResponse<{ status: string; message: string }> = await apiClient.post("/notifications/broadcast", data)
    toast.success("Gửi thông báo cho tất cả người dùng thành công")
    return response.data
  } catch (error) {
    console.error("Error creating notification for all users:", error)
    toast.error("Không thể gửi thông báo cho tất cả người dùng")
    return null
  }
}

export async function updateNotification(id: number, data: NotificationUpdate): Promise<Notification | null> {
  try {
    const response: AxiosResponse<Notification> = await apiClient.put(`/notifications/${id}`, data)
    toast.success("Cập nhật thông báo thành công")
    return response.data
  } catch (error) {
    console.error("Error updating notification:", error)
    toast.error("Không thể cập nhật thông báo")
    return null
  }
}

export async function deleteNotification(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/notifications/${id}`)
    toast.success("Xóa thông báo thành công")
    return true
  } catch (error) {
    console.error("Error deleting notification:", error)
    toast.error("Không thể xóa thông báo")
    return false
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    await apiClient.post("/notifications/mark-all-read", {})
    toast.success("Đã đánh dấu tất cả thông báo là đã đọc")
    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    toast.error("Không thể đánh dấu tất cả thông báo là đã đọc")
    return false
  }
} 