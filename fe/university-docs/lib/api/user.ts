import { User } from "@/types/user"
import { getAuthToken } from "./auth"

export const getUserProfile = async (userId: string): Promise<User> => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin người dùng")
  }

  return response.json()
}

export const updateUserProfile = async (userId: number, userData: {
  full_name: string;
  email: string;
  university_id: string;
}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Không thể cập nhật thông tin người dùng")
  }

  return response.json()
}

export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Không thể thay đổi mật khẩu")
  }

  return response.json()
} 