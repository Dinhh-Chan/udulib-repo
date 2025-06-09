import { useState, useEffect } from "react"
import { 
  getPublicDocumentThumbnail, 
  checkDocumentPreviewSupport, 
  getDocumentThumbnail 
} from "@/lib/api/documents"
import { getAuthToken } from "@/lib/api/auth"

interface UseDocumentThumbnailProps {
  documentId: number
  isPublic?: boolean
}

interface ThumbnailData {
  thumbnailUrl: string | null
  isSupported: boolean
  fileCategory: string
  isLoading: boolean
  error: string | null
}

export function useDocumentThumbnail({ 
  documentId, 
  isPublic = true 
}: UseDocumentThumbnailProps): ThumbnailData {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [fileCategory, setFileCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Kiểm tra xem file có hỗ trợ preview không
        const supportResult = await checkDocumentPreviewSupport(documentId)
        setIsSupported(supportResult.is_supported)
        setFileCategory(supportResult.file_category)

        if (supportResult.is_supported) {
          // Lấy URL thumbnail tương ứng
          if (isPublic) {
            setThumbnailUrl(getPublicDocumentThumbnail(documentId))
          } else {
            const token = getAuthToken()
            if (token) {
              setThumbnailUrl(getDocumentThumbnail(documentId))
            } else {
              setError("Cần đăng nhập để xem thumbnail")
            }
          }
        }
      } catch (err) {
        console.error("Error loading document thumbnail:", err)
        setError(err instanceof Error ? err.message : "Lỗi khi tải thumbnail")
        setIsSupported(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadThumbnail()
  }, [documentId, isPublic])

  return {
    thumbnailUrl,
    isSupported,
    fileCategory,
    isLoading,
    error
  }
} 