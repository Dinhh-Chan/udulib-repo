import { toast } from "sonner"
import { apiClient } from "./client"

export interface Tag {
  tag_id: number
  tag_name: string
  created_at: string
}

export async function getTags(): Promise<Tag[]> {
  try {
    return await apiClient.get<Tag[]>("/tags")
  } catch (error) {
    console.error("Error fetching tags:", error)
    toast.error("Không thể tải danh sách tags")
    return []
  }
}

export async function createTag(tagName: string): Promise<Tag | null> {
  try {
    const response = await apiClient.post<Tag>("/tags", { tag_name: tagName })
    toast.success("Tạo tag thành công")
    return response
  } catch (error) {
    console.error("Error creating tag:", error)
    toast.error("Không thể tạo tag mới")
    return null
  }
}

export async function addDocumentTags(documentId: number, tagNames: string[]): Promise<boolean> {
  try {
    await apiClient.post(`/documents/${documentId}/tags`, { tag_names: tagNames })
    toast.success("Thêm tags thành công")
    return true
  } catch (error) {
    console.error("Error adding document tags:", error)
    toast.error("Không thể thêm tags cho tài liệu")
    return false
  }
} 