import { Subject, SubjectCreate, SubjectUpdate } from "@/types/subject"
import { getAuthToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getSubjects(): Promise<Subject[]> {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/subjects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy danh sách môn học")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching subjects:", error)
    throw error
  }
}

export async function getSubject(id: number): Promise<Subject> {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể lấy thông tin môn học")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching subject:", error)
    throw error
  }
}

export async function createSubject(data: SubjectCreate): Promise<Subject> {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/subjects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể thêm môn học")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating subject:", error)
    throw error
  }
}

export async function updateSubject(id: number, data: SubjectUpdate): Promise<Subject> {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể cập nhật môn học")
    }

    return response.json()
  } catch (error) {
    console.error("Error updating subject:", error)
    throw error
  }
}

export async function deleteSubject(id: number): Promise<void> {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/subjects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Không thể xóa môn học")
    }
  } catch (error) {
    console.error("Error deleting subject:", error)
    throw error
  }
} 