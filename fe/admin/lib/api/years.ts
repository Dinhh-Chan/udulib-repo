import { Year, YearCreate, YearUpdate } from "@/types/year"
import { apiClient } from "./client"
import { toast } from "sonner"

export async function getYears(): Promise<Year[]> {
  try {
    const response = await apiClient.get<Year[]>("/academic-years")
    return response.map((year: any) => ({
      ...year,
      year_order: year.year_order || 1,
      created_at: year.created_at || new Date().toISOString(),
      updated_at: year.updated_at || null
    }))
  } catch (error) {
    console.error("Error fetching years:", error)
    toast.error("Không thể lấy danh sách năm học")
    return []
  }
}

export async function getYear(id: number): Promise<Year | null> {
  try {
    const response = await apiClient.get<Year>(`/academic-years/${id}`)
    return {
      ...response,
      year_order: response.year_order || 1,
      created_at: response.created_at || new Date().toISOString(),
      updated_at: response.updated_at || null
    }
  } catch (error) {
    console.error("Error fetching year:", error)
    toast.error("Không thể lấy thông tin năm học")
    return null
  }
}

export async function createYear(data: YearCreate): Promise<Year | null> {
  try {
    const response = await apiClient.post<Year>("/academic-years", {
      ...data,
      year_order: data.year_order || 1
    })
    toast.success("Thêm năm học thành công")
    return response
  } catch (error) {
    console.error("Error creating year:", error)
    toast.error("Không thể thêm năm học")
    return null
  }
}

export async function updateYear(id: number, data: YearUpdate): Promise<Year | null> {
  try {
    const response = await apiClient.put<Year>(`/academic-years/${id}`, {
      ...data,
      year_order: data.year_order || 1
    })
    toast.success("Cập nhật năm học thành công")
    return response
  } catch (error) {
    console.error("Error updating year:", error)
    toast.error("Không thể cập nhật năm học")
    return null
  }
}

export async function deleteYear(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/academic-years/${id}`)
    toast.success("Xóa năm học thành công")
    return true
  } catch (error) {
    console.error("Error deleting year:", error)
    toast.error("Không thể xóa năm học")
    return false
  }
} 