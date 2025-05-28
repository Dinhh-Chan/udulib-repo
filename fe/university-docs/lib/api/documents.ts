import { toast } from "sonner"
import { getAuthToken } from "./auth"

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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`)
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
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Không thể tạo tài liệu mới")
    }

    const data = await response.json()
    toast.success("Tạo tài liệu thành công")
    return data
  } catch (error) {
    console.error("Error creating document:", error)
    toast.error("Không thể tạo tài liệu mới")
    return null
  }
}

export async function updateDocument(id: number, data: Partial<Document>) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Không thể cập nhật tài liệu")
    }

    const responseData = await response.json()
    toast.success("Cập nhật tài liệu thành công")
    return responseData
  } catch (error) {
    console.error("Error updating document:", error)
    toast.error("Không thể cập nhật tài liệu")
    return null
  }
}

export async function deleteDocument(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Không thể xóa tài liệu")
    }

    toast.success("Xóa tài liệu thành công")
    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    toast.error("Không thể xóa tài liệu")
    return false
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DocumentUploadData {
  title: string;
  description: string;
  subject_id: number;
  tags?: string[];
  file: File;
}

export const uploadDocument = async (data: DocumentUploadData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("subject_id", data.subject_id.toString());
  formData.append("file", data.file);
  
  if (data.tags) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  const response = await fetch(`${API_URL}/documents/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
}; 