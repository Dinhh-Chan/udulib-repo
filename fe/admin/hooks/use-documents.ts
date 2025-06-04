import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { Document } from "@/app/admin/documents/columns"

interface UseDocumentsOptions {
  page?: number
  search?: string
}

interface DocumentsResponse {
  documents: Document[]
  total: number
  page: number
  per_page: number
}

export function useDocuments({ page = 1, search = "" }: UseDocumentsOptions = {}) {
  return useQuery<DocumentsResponse, Error>({
    queryKey: ["documents", page, search],
    queryFn: async () => {
      const response = await apiClient.get<DocumentsResponse>("/documents", {
        params: {
          page,
          search,
        },
      })
      return response
    },
  })
} 