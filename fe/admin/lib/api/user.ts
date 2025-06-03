import { apiClientAxios as apiClient } from "./client"
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
  const response: AxiosResponse<User> = await apiClient.get(`/users/${userId}`)
  return response.data
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