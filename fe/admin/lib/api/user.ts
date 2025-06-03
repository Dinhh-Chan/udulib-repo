import { apiClient } from "./client"
import { AxiosResponse } from "axios"

export interface User {
  user_id: number
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
}

export const getUserProfile = async (userId: string): Promise<User> => {
  const token = localStorage.getItem("access_token")
  
  if (!token) {
    throw new Error("Không tìm thấy token xác thực")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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

export interface GetUsersParams {
  page?: number
  per_page?: number
  role?: string
  search?: string
}

export async function getUsers(params?: GetUsersParams): Promise<User[]> {
  const response: AxiosResponse<User[]> = await apiClient.get("/users", { params })
  return response.data
} 