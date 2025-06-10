import { Year, YearCreate, YearUpdate } from "@/types/year"
import { apiClient } from "./client"
import { AxiosResponse } from "axios"
import { showSuccessToast, showErrorToast } from "@/lib/utils"

interface ApiResponse<T> {
  data: T
  message?: string
  status?: number
}

// API endpoint
const YEARS_ENDPOINT = "/academic-years"

// Lấy danh sách năm học
export const getYears = async (page: number = 1, perPage: number = 20): Promise<Year[]> => {
  try {
    const response: AxiosResponse<Year[]> = await apiClient.get(YEARS_ENDPOINT, {
      params: {
        page,
        per_page: perPage
      }
    })
    return response.data || []
  } catch (error) {
    console.error("Error fetching years:", error)
    throw error
  }
}

// Lấy thông tin một năm học theo ID
export const getYear = async (yearId: number): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.get(`${YEARS_ENDPOINT}/${yearId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching year with ID ${yearId}:`, error)
    throw error
  }
}

// Lấy năm học mới nhất
export const getLatestYear = async (): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.get(`${YEARS_ENDPOINT}/latest`)
    return response.data
  } catch (error) {
    console.error("Error fetching latest year:", error)
    throw error
  }
}

// Lấy danh sách năm học kèm số lượng môn học
export const getYearsWithSubjectsCount = async (page: number = 1, perPage: number = 20): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await apiClient.get(`${YEARS_ENDPOINT}/with-subjects-count`, {
      params: {
        page,
        per_page: perPage
      }
    })
    return response.data || []
  } catch (error) {
    console.error("Error fetching years with subjects count:", error)
    throw error
  }
}

// Tạo một năm học mới
export const createYear = async (yearData: YearCreate): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.post(YEARS_ENDPOINT, yearData)
    showSuccessToast("Thêm năm học thành công")
    return response.data
  } catch (error) {
    console.error("Error creating year:", error)
    showErrorToast("Không thể thêm năm học")
    throw error
  }
}

// Cập nhật thông tin năm học
export const updateYear = async (yearId: number, yearData: YearUpdate): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.put(`${YEARS_ENDPOINT}/${yearId}`, yearData)
    showSuccessToast("Cập nhật năm học thành công")
    return response.data
  } catch (error) {
    console.error(`Error updating year with ID ${yearId}:`, error)
    showErrorToast("Không thể cập nhật năm học")
    throw error
  }
}

// Xóa một năm học
export const deleteYear = async (yearId: number): Promise<boolean> => {
  try {
    await apiClient.delete(`${YEARS_ENDPOINT}/${yearId}`)
    showSuccessToast("Xóa năm học thành công")
    return true
  } catch (error) {
    console.error(`Error deleting year with ID ${yearId}:`, error)
    showErrorToast("Không thể xóa năm học")
    throw error
  }
}

// Tạo đường dẫn cho năm học - Giả định rằng API này sẽ được thêm vào backend sau này
export const createYearSlug = async (yearId: number): Promise<boolean> => {
  try {
    await apiClient.post(`${YEARS_ENDPOINT}/${yearId}/slug`, {})
    showSuccessToast("Tạo đường dẫn cho năm học thành công")
    return true
  } catch (error) {
    console.error(`Error creating slug for year with ID ${yearId}:`, error)
    showErrorToast("Không thể tạo đường dẫn cho năm học")
    throw error
  }
} 