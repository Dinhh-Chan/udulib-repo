import { toast } from "sonner"

export interface Tag {
  tag_id: number
  tag_name: string
  created_at: string
}

export async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`)
    if (!response.ok) {
      console.error("Error fetching tags:", response.status, response.statusText)
      throw new Error(`Không thể tải danh sách tags: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in getTags:", error)
    throw error
  }
}

export async function createTag(tagName: string): Promise<Tag | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag_name: tagName }),
    })

    if (!response.ok) {
      console.error("Error creating tag:", response.status, response.statusText)
      throw new Error(`Không thể tạo tag: ${response.statusText}`)
    }

    const data = await response.json()
    toast.success("Tạo tag thành công")
    return data
  } catch (error) {
    console.error("Error in createTag:", error)
    toast.error("Không thể tạo tag mới")
    throw error
  }
}

export async function addDocumentTags(documentId: number, tagNames: string[]): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag_names: tagNames }),
    })

    if (!response.ok) {
      console.error("Error adding document tags:", response.status, response.statusText)
      throw new Error(`Không thể thêm tags cho tài liệu: ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error in addDocumentTags:", error)
    throw error
  }
} 