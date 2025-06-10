import { useState, useEffect } from "react"
import { 
  getPublicDocumentThumbnail, 
} from "@/lib/api/documents"

interface UseDocumentThumbnailProps {
  documentId: number
  isPublic?: boolean
}

interface ThumbnailData {
  thumbnailUrl: string | null
  isLoading: boolean
  error: string | null
}

export function useDocumentThumbnail({ 
  documentId, 
  isPublic = true 
}: UseDocumentThumbnailProps): ThumbnailData {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setThumbnailUrl(getPublicDocumentThumbnail(documentId))
      } catch (err) {
        console.error("Error loading document thumbnail:", err)
        setError(err instanceof Error ? err.message : "Lỗi khi tải thumbnail")
      } finally {
        setIsLoading(false)
      }
    }

    loadThumbnail()
  }, [documentId, isPublic])

  return {
    thumbnailUrl,
    isLoading,
    error
  }
} 