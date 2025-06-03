import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

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
  const response: AxiosResponse<Notification[]> = await apiClient.get("/notifications", { params })
  return response.data
}

export async function createNotification(data: NotificationCreate): Promise<Notification> {
  const response: AxiosResponse<Notification> = await apiClient.post("/notifications", data)
  return response.data
}

export async function createNotificationForUser(data: NotificationCreate & { target_user_id: number }): Promise<Notification> {
  const { target_user_id, ...notificationData } = data
  const response: AxiosResponse<Notification> = await apiClient.post(`/notifications/admin?target_user_id=${target_user_id}`, notificationData)
  return response.data
}

export async function createNotificationForAllUsers(data: NotificationCreate): Promise<{ status: string; message: string }> {
  const response: AxiosResponse<{ status: string; message: string }> = await apiClient.post("/notifications/broadcast", data)
  return response.data
}

export async function updateNotification(id: number, data: NotificationUpdate): Promise<Notification> {
  const response: AxiosResponse<Notification> = await apiClient.put(`/notifications/${id}`, data)
  return response.data
}

export async function deleteNotification(id: number): Promise<void> {
  await apiClient.delete(`/notifications/${id}`)
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.post("/notifications/mark-all-read", {})
} 