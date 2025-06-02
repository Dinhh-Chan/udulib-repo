import { toast } from "sonner"
import { apiClient } from "./client" // Import API client
import type { User, UserCreate, UserUpdate } from "@/types/user"

export async function getUsers(params?: {
  skip?: number
  limit?: number
  role?: string
  search?: string
}): Promise<User[]> {
  try {
    return await apiClient.get<User[]>("/users", params)
  } catch (error) {
    if (error instanceof Error && error.message !== "Unauthorized") {
      toast.error("Không thể lấy danh sách người dùng")
    }
    return [] // Return empty array on error to prevent UI crashes
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    return await apiClient.get<User>(`/users/${userId}`)
  } catch (error) {
    if (error instanceof Error && error.message !== "Unauthorized") {
      toast.error("Không thể lấy thông tin người dùng")
    }
    return null
  }
}

export async function createUser(userData: UserCreate): Promise<boolean> {
  try {
    await apiClient.post<User>("/users", userData)
    toast.success("Tạo người dùng mới thành công")
    return true
  } catch (error) {
    if (error instanceof Error && error.message !== "Unauthorized" && error.message !== "Forbidden") {
      toast.error(error.message || "Không thể tạo người dùng mới")
    }
    return false
  }
}

export async function updateUser(userId: number, userData: UserUpdate): Promise<boolean> {
  try {
    await apiClient.put<User>(`/users/${userId}`, userData)
    toast.success("Cập nhật thông tin người dùng thành công")
    return true
  } catch (error) {
    if (error instanceof Error && error.message !== "Unauthorized" && error.message !== "Forbidden") {
      toast.error(error.message || "Không thể cập nhật thông tin người dùng")
    }
    return false
  }
}

export async function deleteUser(userId: number): Promise<boolean> {
  try {
    await apiClient.delete(`/users/${userId}`)
    toast.success("Xóa người dùng thành công")
    return true
  } catch (error) {
    if (error instanceof Error && error.message !== "Unauthorized" && error.message !== "Forbidden") {
      toast.error(error.message || "Không thể xóa người dùng")
    }
    return false
  }
}