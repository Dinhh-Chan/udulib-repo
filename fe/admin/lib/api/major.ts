import { Major, MajorCreate, MajorUpdate } from "@/types/major"
import { apiClient } from "./client"
import { toast } from "sonner"

export async function getMajors(): Promise<Major[]> {
  try {
    return await apiClient.get<Major[]>("/majors")
  } catch (error) {
    console.error("Error fetching majors:", error)
    toast.error("Không thể lấy danh sách ngành học")
    return []
  }
}
export async function getMajorCount(): Promise<number> {
  try {
    const response = await apiClient.get<{ count: number }>("/majors/count-major")
    return response.count
  } catch (error) {
    console.error("Error fetching major count:", error)
    toast.error("Không thể lấy số lượng ngành học")
    return 0
  }
}

export async function getMajor(id: number): Promise<Major | null> {
  try {
    return await apiClient.get<Major>(`/majors/${id}`)
  } catch (error) {
    console.error("Error fetching major:", error)
    toast.error("Không thể lấy thông tin ngành học")
    return null
  }
}

export async function createMajor(major: MajorCreate): Promise<Major | null> {
  try {
    const response = await apiClient.post<Major>("/majors/", major)
    toast.success("Tạo ngành học mới thành công")
    return response
  } catch (error) {
    console.error("Error creating major:", error)
    toast.error("Không thể tạo ngành học mới")
    return null
  }
}

export async function updateMajor(id: number, major: MajorUpdate): Promise<Major | null> {
  try {
    const response = await apiClient.put<Major>(`/majors/${id}`, major)
    toast.success("Cập nhật ngành học thành công")
    return response
  } catch (error) {
    console.error("Error updating major:", error)
    toast.error("Không thể cập nhật ngành học")
    return null
  }
}

export async function deleteMajor(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/majors/${id}`)
    toast.success("Xóa ngành học thành công")
    return true
  } catch (error) {
    console.error("Error deleting major:", error)
    toast.error("Không thể xóa ngành học")
    return false
  }
} 