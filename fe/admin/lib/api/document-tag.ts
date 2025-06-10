import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"
import { toast } from "sonner"

export interface DocumentTagList {
  tags: string[]
}

export interface DocumentListResponse {
  documents: any[]
  total: number
  page: number
  per_page: number
  total_pages?: number
}

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
    const response: AxiosResponse<{ documents: Document[] }> = await apiClient.get("/documents")
    return response.data.documents
  } catch (error) {
    console.error("Error fetching documents:", error)
    toast.error("Không thể tải danh sách tài liệu")
    return []
  }
}

export async function getDocument(id: number) {
  try {
    const response: AxiosResponse<Document> = await apiClient.get(`/documents/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching document:", error)
    toast.error("Không thể tải thông tin tài liệu")
    return null
  }
}

export async function createDocument(formData: FormData) {
  try {
    const response: AxiosResponse<Document> = await apiClient.post("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    toast.success("Tạo tài liệu thành công")
    return response.data
  } catch (error) {
    console.error("Error creating document:", error)
    toast.error("Không thể tạo tài liệu mới")
    return null
  }
}

export async function updateDocument(id: number, data: Partial<Document>) {
  try {
    const response: AxiosResponse<Document> = await apiClient.put(`/documents/${id}`, data)
    toast.success("Cập nhật tài liệu thành công")
    return response.data
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
    const response: AxiosResponse<number> = await apiClient.get("/documents/count-document")
    return response.data
  } catch (error) {
    console.error("Error fetching document count:", error)
    toast.error("Không thể lấy số lượng tài liệu")
    return 0
  }
}

/**
 * Thêm nhiều tag cho một tài liệu
 */
export async function addDocumentTags(documentId: number, tags: string[]): Promise<DocumentTagList> {
  const response: AxiosResponse<DocumentTagList> = await apiClient.post(`/documents/${documentId}/tags`, tags)
  return response.data
}

/**
 * Xóa một tag khỏi tài liệu
 */
export async function removeDocumentTag(documentId: number, tagName: string): Promise<{ message: string }> {
  const response: AxiosResponse<{ message: string }> = await apiClient.delete(`/documents/${documentId}/tags/${tagName}`)
  return response.data
}

/**
 * Lấy danh sách các tài liệu theo tag
 */
export async function getDocumentsByTag(
  tagName: string, 
  params?: { 
    page?: number; 
    per_page?: number;
    status?: string;
    sort_by?: string;
    sort_desc?: boolean;
  }
): Promise<DocumentListResponse> {
  const queryParams: any = {
    page: params?.page || 1,
    per_page: params?.per_page || 20,
    sort_by: params?.sort_by || "created_at",
    sort_desc: params?.sort_desc !== undefined ? params.sort_desc : true
  };
  
  if (params?.status && ['approved', 'pending', 'rejected'].includes(params.status)) {
    queryParams.status = params.status;
  }
  
  const response: AxiosResponse<DocumentListResponse> = await apiClient.get(`/documents/by-tag/${encodeURIComponent(tagName)}`, { 
    params: queryParams
  })
  return response.data
}

/**
 * Lấy danh sách các tài liệu theo nhiều tag
 */
export async function getDocumentsByMultipleTags(
  tags: string[], 
  params?: { 
    page?: number; 
    per_page?: number;
    status?: string;
    sort_by?: string;
    sort_desc?: boolean;
  }
): Promise<DocumentListResponse> {
  const queryParams: any = {
    page: params?.page || 1,
    per_page: params?.per_page || 20,
    sort_by: params?.sort_by || "created_at",
    sort_desc: params?.sort_desc !== undefined ? params.sort_desc : true
  };
  
  if (params?.status && ['approved', 'pending', 'rejected'].includes(params.status)) {
    queryParams.status = params.status;
  }
  
  tags.forEach((tag, index) => {
    queryParams[`tags[${index}]`] = tag;
  });
  
  const response: AxiosResponse<DocumentListResponse> = await apiClient.get('/documents/by-tags', { params: queryParams })
  return response.data
}