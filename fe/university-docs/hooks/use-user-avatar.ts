import { useState, useEffect, useCallback } from "react"
import { getUserAvatarById } from "@/lib/api/user"

interface UseUserAvatarReturn {
  avatarUrl: string | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export const useUserAvatar = (userId?: number): UseUserAvatarReturn => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAvatar = useCallback(async () => {
    if (!userId) {
      setAvatarUrl(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = await getUserAvatarById(userId)
      setAvatarUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lấy avatar")
      setAvatarUrl(null)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAvatar()
  }, [fetchAvatar])

  const refetch = useCallback(() => {
    fetchAvatar()
  }, [fetchAvatar])

  return {
    avatarUrl,
    isLoading,
    error,
    refetch
  }
} 