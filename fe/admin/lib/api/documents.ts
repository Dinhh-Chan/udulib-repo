import { apiClient } from "./client"
import { toast } from "sonner"

export interface Document {
  document_id: number
  title: string
  description: string | null
  file_path: string
  file_size: number
  file_type: string
  subject_id: number
  user_id: number
  status: "approved" | "pending" | "rejected"
  view_count: number
  download_count: number
  created_at: string
  updated_at: string | null
  subject: {
    subject_id: number
    subject_name: string
  } | null
  user: {
    user_id: number
    username: string
  } | null
  tags: Array<{
    tag_id: number
    tag_name: string
  }>
  average_rating: number
}

export async function getDocuments() {
  try {
    const response = await apiClient.get<{ documents: Document[] }>("/documents/")
    return response.documents
  } catch (error) {
    console.error("Error fetching documents:", error)
    toast.error("Không thể tải danh sách tài liệu")
    return []
  }
}

export async function getDocument(id: number) {
  try {
    const response = await apiClient.get<Document>(`/documents/${id}`)
    return response
  } catch (error) {
    console.error("Error fetching document:", error)
    toast.error("Không thể tải thông tin tài liệu")
    return null
  }
}

export async function createDocument(formData: FormData) {
  try {
    const response = await apiClient.post<Document>("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    toast.success("Tạo tài liệu thành công")
    return response
  } catch (error) {
    console.error("Error creating document:", error)
    toast.error("Không thể tạo tài liệu mới")
    return null
  }
}

export async function updateDocument(id: number, data: Partial<Document>) {
  try {
    const response = await apiClient.put<Document>(`/documents/${id}`, data)
    toast.success("Cập nhật tài liệu thành công")
    return response
  } catch (error) {
    console.error("Error updating document:", error)
    toast.error("Không thể cập nhật tài liệu")
    return null
  }
}

export async function deleteDocument(id: number) {
  try {
    await apiClient.delete(`/documents/${id}`)
    toast.success("Xóa tài liệu thành công")
    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    toast.error("Không thể xóa tài liệu")
    return false
  }
}

export async function getDocumentCount(): Promise<number> {
  try {
    const response = await apiClient.get<number>("/documents/count-document")
    return response
  } catch (error) {
    console.error("Error fetching document count:", error)
    toast.error("Không thể lấy số lượng tài liệu")
    return 0
  }
}
