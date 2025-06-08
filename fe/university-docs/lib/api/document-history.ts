import { getAuthToken } from "./auth"

export interface DocumentHistory {
  history_id: number
  document_id: number
  user_id: number
  action: string
  created_at: string
  updated_at: string
  document?: {
    document_id: number
    title: string
    description: string
    subject: {
      subject_name: string
    }
    created_at: string
  }
}

export interface DocumentHistoryResponse {
  histories: DocumentHistory[]
  total: number
  page: number
  per_page: number
}

export const getDocumentHistory = async (
  userId: number,
  action?: string,
) => {
  const token = getAuthToken()
  if (!token) throw new Error("Không có token xác thực")

  const params = new URLSearchParams({
    user_id: userId.toString(),
  })

  if (action) {
    params.append('action', action)
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/history/?${params.toString()}`
  console.log("Calling API:", url)
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  console.log("API Response status:", response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("API Error response:", errorText)
    throw new Error(`Không thể lấy lịch sử tài liệu: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const getViewedDocuments = async (
  userId: number,
) => {
  return getDocumentHistory(userId, "view")
}

export const getDownloadedDocuments = async (
  userId: number,
) => {
  return getDocumentHistory(userId, "download")
} 