import { Subject, SubjectCreate, SubjectUpdate } from "@/types/subject"
import { apiClient } from "./client"
import { toast } from "sonner"

export async function getSubjects(): Promise<Subject[]> {
  try {
    return await apiClient.get<Subject[]>("/subjects")
  } catch (error) {
    console.error("Error fetching subjects:", error)
    toast.error("Không thể lấy danh sách môn học")
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