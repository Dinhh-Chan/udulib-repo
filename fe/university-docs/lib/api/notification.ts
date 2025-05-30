import { getAuthToken } from "./auth";

export interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const token = getAuthToken();
  if (!token) return [];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/?is_read=false`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${notificationId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_read: true }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/mark-all-read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }
}; 