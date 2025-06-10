import { useState, useEffect, useCallback } from "react"
import { getUserAvatarById, getUserAvatar } from "@/lib/api/user"
import { useAuth } from "@/hooks/use-auth"

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
  const { user } = useAuth()

  const fetchAvatar = useCallback(async () => {
    if (!userId) {
      setAvatarUrl(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Nếu là user hiện tại thì gọi API /users/avatar
      const url = userId === user?.user_id 
        ? await getUserAvatar()
        : await getUserAvatarById(userId)
      setAvatarUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lấy avatar")
      setAvatarUrl(null)
    } finally {
      setIsLoading(false)
    }
  }, [userId, user?.user_id])

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