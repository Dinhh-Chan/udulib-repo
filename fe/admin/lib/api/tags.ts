import { toast } from "sonner"
import { apiClientAxios as apiClient } from "./client"
import { AxiosResponse } from "axios"

export interface Tag {
  tag_id: number
  tag_name: string
  created_at: string
}

export async function getTags(): Promise<Tag[]> {
  try {
    console.log("Gọi API lấy danh sách tags")
    const response: AxiosResponse<Tag[]> = await apiClient.get("/tags/")
    console.log("Kết quả API tags:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching tags:", error)
    toast.error("Không thể tải danh sách tags")
    return []
  }
}

export async function createTag(tagName: string): Promise<Tag | null> {
  try {
    const response: AxiosResponse<Tag> = await apiClient.post("/tags/", { tag_name: tagName })
    toast.success("Tạo tag thành công")
    return response.data
  } catch (error) {
    console.error("Error creating tag:", error)
    toast.error("Không thể tạo tag mới")
    return null
  }
}

export async function addDocumentTags(documentId: number, tagNames: string[]): Promise<boolean> {
  try {
    const response: AxiosResponse = await apiClient.post(`/documents/${documentId}/tags`, { tag_names: tagNames })
    toast.success("Thêm tags thành công")
    return true
  } catch (error) {
    console.error("Error adding document tags:", error)
    toast.error("Không thể thêm tags cho tài liệu")
    return false
  }
} 