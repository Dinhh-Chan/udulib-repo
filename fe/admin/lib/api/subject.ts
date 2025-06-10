import { Subject, SubjectCreate, SubjectUpdate } from "@/types/subject"
import { apiClient } from "./client"
import { apiClientAxios } from "./client"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { getMajor } from "./major"

interface GetSubjectsParams {
  search?: string
  major_id?: number
  year_id?: number
  page?: number
  per_page?: number
}

export async function getSubjects(params: GetSubjectsParams = {}): Promise<Subject[]> {
  try {
    console.log("Gọi API lấy danh sách môn học")
    const response: AxiosResponse<Subject[]> = await apiClientAxios.get("/subjects", { params })
    console.log("Kết quả API subjects:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching subjects:", error)
    toast.error("Không thể tải danh sách môn học")
    return []
  }
}

export async function getSubject(id: number): Promise<Subject | null> {
  try {
    return await apiClient.get<Subject>(`/subjects/${id}`)
  } catch (error) {
    console.error("Error fetching subject:", error)
    toast.error("Không thể lấy thông tin môn học")
    return null
  }
}

export async function createSubject(data: SubjectCreate): Promise<Subject | null> {
  try {
    const response = await apiClient.post<Subject>("/subjects", data)
    toast.success("Thêm môn học thành công")
    return response
  } catch (error) {
    console.error("Error creating subject:", error)
    toast.error("Không thể thêm môn học")
    return null
  }
}

export async function updateSubject(id: number, data: SubjectUpdate): Promise<Subject | null> {
  try {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, data)
    toast.success("Cập nhật môn học thành công")
    return response
  } catch (error) {
    console.error("Error updating subject:", error)
    toast.error("Không thể cập nhật môn học")
    return null
  }
}

export async function deleteSubject(id: number): Promise<boolean> {
  try {
    await apiClient.delete(`/subjects/${id}`)
    toast.success("Xóa môn học thành công")
    return true
  } catch (error) {
    console.error("Error deleting subject:", error)
    toast.error("Không thể xóa môn học")
    return false
  }
}

export async function getSubjectCount(): Promise<number> {
  try {
    const response = await apiClient.get<{ count: number }>("/subjects/count-subject")
    return response.count
  } catch (error) {
    console.error("Error fetching subject count:", error)
    toast.error("Không thể lấy số lượng môn học")
    return 0
  }
}

// Lấy danh sách môn học theo năm học
export const getSubjectsByYear = async (yearId: number, page: number = 1, perPage: number = 100): Promise<Subject[]> => {
  try {
    console.log(`Gọi API lấy môn học theo năm học ${yearId}, page=${page}, per_page=${perPage}`);
    const response = await apiClientAxios.get(`/subjects/academic-year/${yearId}`, {
      params: {
        page,
        per_page: perPage
      }
    });
    console.log("Dữ liệu môn học nhận được:", response.data);
    return response.data || [];
  } catch (error: any) {
    console.error(`Error fetching subjects for year ${yearId}:`, error);
    // Ghi lại chi tiết lỗi
    if (error.response) {
      console.error("Response error:", error.response.status, error.response.data);
    }
    throw error;
  }
}

// Lấy danh sách môn học theo năm học kèm thông tin chi tiết về ngành học
export const getEnhancedSubjectsByYear = async (yearId: number, page: number = 1, perPage: number = 100): Promise<Subject[]> => {
  try {
    console.log(`Gọi API lấy môn học theo năm học ${yearId} với thông tin ngành học`);
    
    // Lấy danh sách môn học theo năm học
    const subjects = await getSubjectsByYear(yearId, page, perPage);
    
    // Lấy thông tin chi tiết ngành học và gán vào môn học
    const enhancedSubjects = await Promise.all(
      subjects.map(async (subject) => {
        try {
          // Nếu đã có major_name thì không cần lấy thêm thông tin
          if (subject.major_name) {
            return subject;
          }
          
          // Lấy thông tin ngành học từ major_id
          const major = await getMajor(subject.major_id);
          
          // Trả về môn học với thông tin ngành học đã được bổ sung
          return {
            ...subject,
            major_name: major.major_name
          };
        } catch (error) {
          console.error(`Không thể lấy thông tin ngành học cho môn học ${subject.subject_id}:`, error);
          return {
            ...subject,
            major_name: "Không xác định"
          };
        }
      })
    );
    
    console.log("Dữ liệu môn học đã bổ sung thông tin ngành học:", enhancedSubjects);
    return enhancedSubjects;
  } catch (error: any) {
    console.error(`Error fetching enhanced subjects for year ${yearId}:`, error);
    throw error;
  }
}