import { toast } from "sonner"
import { getAuthToken } from "./auth"

export interface Subject {
  subject_id: number
  subject_name: string
  subject_code: string
  description: string
  major_id: number
  year_id: number
  created_at: string
  updated_at: string
}

export interface User {
  user_id: number
  username: string
  email: string
  full_name: string
  role: string
  university_id: string
  status: string
  created_at: string
  updated_at: string
  last_login: string
  google_id: string | null
}

export interface Document {
  document_id: number
  title: string
  description: string
  file_path: string
  file_size: number
  file_type: string
  subject_id: number
  user_id: number
  status: string
  created_at: string
  updated_at: string
  view_count: number
  download_count: number
  subject: Subject
  user: User
  tags: any[]
  average_rating: number
}

export interface DocumentListResponse {
  documents: Document[]
  total: number
  page: number
  per_page: number
}

export interface DocumentUpdateData {
  title?: string
  description?: string
  status?: "approved" | "pending" | "rejected"
  tags?: string[]
}

export const getUserDocuments = async (userId: number, page: number = 1, perPage: number = 5) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/?user_id=${userId}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách tài liệu")
  }

  return response.json()
}

export const getDocumentDetail = async (documentId: number) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Không thể lấy thông tin tài liệu")
  }

  return response.json()
}

export const updateDocument = async (documentId: number, data: DocumentUpdateData) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error("Không thể cập nhật tài liệu")
    }

    return response.json()
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

export async function getDocuments() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/`)
    if (!response.ok) {
      throw new Error("Không thể tải danh sách tài liệu")
    }
    const data = await response.json()
    return data.documents
  } catch (error) {
    console.error("Error fetching documents:", error)
    toast.error("Không thể tải danh sách tài liệu")
    return []
  }
}

export async function getDocument(id: number) {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error("Không thể tải thông tin tài liệu")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching document:", error)
    toast.error("Không thể tải thông tin tài liệu")
    return null
  }
}

export async function createDocument(formData: FormData) {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Không thể tạo tài liệu mới")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating document:", error)
    throw error
  }
}

export async function deleteDocument(id: number) {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Không thể xóa tài liệu")
    }

    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface DocumentUploadData {
  title: string
  description: string
  subject_id: number
  tags?: string[]
  file: File
}

export const uploadDocument = async (data: DocumentUploadData) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error("Unauthorized")
  }

  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("subject_id", data.subject_id.toString())
  formData.append("file", data.file)

  if (data.tags) {
    formData.append("tags", JSON.stringify(data.tags))
  }

  const response = await fetch(`${API_URL}/documents/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload document")
  }

  return response.json()
}

export const getPublicDocuments = async (page: number = 1, perPage: number = 4) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/public?page=${page}&per_page=${perPage}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách tài liệu");
  }

  return response.json();
};

export const getDocumentDownloadUrl = async (documentId: number) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/download-url`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Không thể lấy link tải xuống")
    }

    const data = await response.json()
    return data.download_url
  } catch (error) {
    console.error("Error getting download URL:", error)
    throw error
  }
}

export const getDocumentPreviewUrl = async (documentId: number) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/preview-url`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      // Nếu không có API preview riêng, có thể sử dụng download URL
      return null
    }

    const data = await response.json()
    return data.preview_url
  } catch (error) {
    console.error("Error getting preview URL:", error)
    return null
  }
}

// Kiểm tra tài liệu có hỗ trợ preview không
export const checkDocumentPreviewSupport = async (documentId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/is-supported`
    )

    if (!response.ok) {
      return { is_supported: false, file_category: 'unsupported' }
    }

    return response.json()
  } catch (error) {
    console.error("Error checking document preview support:", error)
    return { is_supported: false, file_category: 'unsupported' }
  }
}

// Lấy preview cho tài liệu công khai (không cần đăng nhập)
export const getPublicDocumentPreviewUrl = (documentId: number, size: string = "medium") => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/preview?size=${size}`
}

// Lấy full preview cho tài liệu (cần đăng nhập)
export const getDocumentFullPreviewUrl = (documentId: number) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/full-preview`
}

// Download tài liệu công khai (cần đăng nhập ở frontend)
export const downloadPublicDocument = async (documentId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/download`
    )

    if (!response.ok) {
      throw new Error("Không thể tải xuống tài liệu")
    }

    // Trả về URL để download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    return url
  } catch (error) {
    console.error("Error downloading document:", error)
    throw error
  }
}

// Kiểm tra người dùng đã đăng nhập chưa
export const isUserAuthenticated = () => {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("access_token")
}

// Lấy thông tin user hiện tại
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  try {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

// Lấy thumbnail của tài liệu công khai (không cần đăng nhập)
export const getPublicDocumentThumbnail = (documentId: number) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/thumbnail`
}

// Lấy preview của tài liệu công khai với kích thước tùy chọn
export const getPublicDocumentPreview = (documentId: number, size: string = "medium") => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/preview?size=${size}`
}

// Lấy full preview của tài liệu công khai
export const getPublicDocumentFullPreview = (documentId: number) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/public/${documentId}/full-preview`
}

// Lấy thumbnail cho tài liệu riêng tư (cần đăng nhập)
export const getDocumentThumbnail = (documentId: number) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")
  
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/thumbnail`
}

// Lấy preview cho tài liệu riêng tư (cần đăng nhập)
export const getDocumentPreview = (documentId: number, size: string = "medium") => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")
  
  return `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/preview?size=${size}`
} 