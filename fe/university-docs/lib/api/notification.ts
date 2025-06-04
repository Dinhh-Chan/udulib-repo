import { getAuthToken } from "./auth";

interface User {
  created_at: string;
  updated_at: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  university_id: string;
  user_id: number;
  status: string;
  google_id: string | null;
  last_login: string;
}

export interface Notification {
  title: string;
  content: string;
  type: string;
  reference_id: number;
  notification_id: number;
  user_id: number;
  is_read: boolean;
  created_at: string;
  user: User;
}

export const getAllNotifications = async (): Promise<Notification[]> => {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return [];
      }
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/?is_read=false`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return [];
      }
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      throw new Error("Failed to mark notifications as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_read: true }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
      throw new Error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}; 