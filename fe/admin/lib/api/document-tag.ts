import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

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

/**
 * Thêm nhiều tag cho một tài liệu
 * @param documentId ID của tài liệu
 * @param tags Danh sách tên tag muốn thêm
 */
export async function addDocumentTags(documentId: number, tags: string[]): Promise<DocumentTagList> {
  const response: AxiosResponse<DocumentTagList> = await apiClient.post(`/documents/${documentId}/tags`, tags)
  return response.data
}

/**
 * Xóa một tag khỏi tài liệu
 * @param documentId ID của tài liệu
 * @param tagName Tên tag muốn xóa
 */
export async function removeDocumentTag(documentId: number, tagName: string): Promise<{ message: string }> {
  const response: AxiosResponse<{ message: string }> = await apiClient.delete(`/documents/${documentId}/tags/${tagName}`)
  return response.data
}

/**
 * Lấy danh sách các tài liệu theo tag
 * @param tagName Tên tag cần tìm
 * @param params Tham số phân trang và sắp xếp
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
  // Status chỉ chấp nhận giá trị 'approved', 'pending', 'rejected'
  // Nếu muốn lấy tất cả, không truyền tham số status
  const queryParams: any = {
    page: params?.page || 1,
    per_page: params?.per_page || 20,
    sort_by: params?.sort_by || "created_at",
    sort_desc: params?.sort_desc !== undefined ? params.sort_desc : true
  };
  
  // Chỉ thêm status nếu nó là một trong các giá trị hợp lệ
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
 * @param tags Danh sách các tag cần tìm
 * @param params Tham số phân trang và sắp xếp
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
  // Chuyển mảng tags thành tham số query
  const queryParams: any = {
    page: params?.page || 1,
    per_page: params?.per_page || 20,
    sort_by: params?.sort_by || "created_at",
    sort_desc: params?.sort_desc !== undefined ? params.sort_desc : true
  };
  
  // Chỉ thêm status nếu nó là một trong các giá trị hợp lệ
  if (params?.status && ['approved', 'pending', 'rejected'].includes(params.status)) {
    queryParams.status = params.status;
  }
  
  // Thêm mỗi tag như một tham số riêng biệt
  tags.forEach((tag, index) => {
    queryParams[`tags[${index}]`] = tag;
  });
  
  const response: AxiosResponse<DocumentListResponse> = await apiClient.get('/documents/by-tags', { params: queryParams })
  return response.data
} 