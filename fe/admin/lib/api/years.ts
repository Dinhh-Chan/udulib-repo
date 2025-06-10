import { Year, YearCreate, YearUpdate } from "@/types/year"
import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"
import { showSuccessToast, showErrorToast } from "@/lib/utils"

// API endpoint
const YEARS_ENDPOINT = "/academic-years/"

// Lấy danh sách năm học
export const getYears = async (page: number = 1, perPage: number = 20): Promise<Year[]> => {
  try {
    console.log(`Đang gọi API: ${YEARS_ENDPOINT} với page=${page}, per_page=${perPage}`);
    const response: AxiosResponse<Year[]> = await apiClient.get(YEARS_ENDPOINT, {
      params: {
        page,
        per_page: perPage
      }
    });
    console.log("API Response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching years:", error);
    throw error;
  }
}

// Lấy thông tin một năm học theo ID
export const getYear = async (yearId: number): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.get(`${YEARS_ENDPOINT}/${yearId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching year with ID ${yearId}:`, error);
    throw error;
  }
}

// Lấy năm học mới nhất
export const getLatestYear = async (): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.get(`${YEARS_ENDPOINT}/latest`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest year:", error);
    throw error;
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
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching years with subjects count:", error);
    throw error;
  }
}

// Lấy số lượng tổng cộng năm học
export const getYearCount = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await apiClient.get(`${YEARS_ENDPOINT}/count`);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching year count:", error);
    return 0; // Return 0 instead of throwing for count operations
  }
}

// Tạo một năm học mới
export const createYear = async (yearData: YearCreate): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.post(YEARS_ENDPOINT, yearData);
    showSuccessToast("Thêm năm học thành công");
    return response.data;
  } catch (error) {
    console.error("Error creating year:", error);
    // Don't show error toast here since axios interceptor will handle it
    // showErrorToast("Không thể thêm năm học");
    throw error;
  }
}

// Cập nhật thông tin năm học
export const updateYear = async (yearId: number, yearData: YearUpdate): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.put(`${YEARS_ENDPOINT}/${yearId}`, yearData);
    showSuccessToast("Cập nhật năm học thành công");
    return response.data;
  } catch (error) {
    console.error(`Error updating year with ID ${yearId}:`, error);
    // Don't show error toast here since axios interceptor will handle it
    // showErrorToast("Không thể cập nhật năm học");
    throw error;
  }
}

// Xóa một năm học
export const deleteYear = async (yearId: number): Promise<boolean> => {
  try {
    await apiClient.delete(`${YEARS_ENDPOINT}/${yearId}`);
    showSuccessToast("Xóa năm học thành công");
    return true;
  } catch (error) {
    console.error(`Error deleting year with ID ${yearId}:`, error);
    // Don't show error toast here since axios interceptor will handle it
    // showErrorToast("Không thể xóa năm học");
    throw error;
  }
}

// Kiểm tra năm học có thể xóa hay không
export const canDeleteYear = async (yearId: number): Promise<boolean> => {
  try {
    const response: AxiosResponse<{ can_delete: boolean }> = await apiClient.get(`${YEARS_ENDPOINT}/${yearId}/can-delete`);
    return response.data.can_delete;
  } catch (error) {
    console.error(`Error checking if year ${yearId} can be deleted:`, error);
    return false;
  }
}

// Tạo đường dẫn cho năm học
export const createYearSlug = async (yearId: number): Promise<boolean> => {
  try {
    await apiClient.post(`${YEARS_ENDPOINT}/${yearId}/slug`, {});
    showSuccessToast("Tạo đường dẫn cho năm học thành công");
    return true;
  } catch (error) {
    console.error(`Error creating slug for year with ID ${yearId}:`, error);
    // Don't show error toast here since axios interceptor will handle it
    // showErrorToast("Không thể tạo đường dẫn cho năm học");
    throw error;
  }
}

// Kích hoạt/vô hiệu hóa năm học
export const toggleYearStatus = async (yearId: number): Promise<Year> => {
  try {
    const response: AxiosResponse<Year> = await apiClient.patch(`${YEARS_ENDPOINT}/${yearId}/toggle-status`);
    showSuccessToast("Thay đổi trạng thái năm học thành công");
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for year ${yearId}:`, error);
    throw error;
  }
}