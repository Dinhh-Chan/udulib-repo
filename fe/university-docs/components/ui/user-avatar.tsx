import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserAvatar } from "@/hooks/use-user-avatar"
import { User } from "lucide-react"
<<<<<<< HEAD
import { cn } from "@/lib/api/utils"
=======
import { cn } from "@/lib/utils"
>>>>>>> 3c35902094cc5ae9d14dcaca99c44a5ed2a2d9ed

interface UserAvatarProps {
  userId?: number
  username?: string
  fullName?: string
  className?: string
  fallbackClassName?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-10 w-10",
  xl: "h-12 w-12"
}

export function UserAvatar({ 
  userId, 
  username, 
  fullName, 
  className,
  fallbackClassName,
  size = "md"
}: UserAvatarProps) {
  const { avatarUrl, isLoading } = useUserAvatar(userId)

  const getFallbackText = () => {
    if (fullName) {
      return fullName.substring(0, 2).toUpperCase()
    }
    if (username) {
      return username.substring(0, 2).toUpperCase()
    }
    return "ND"
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && !isLoading && (
        <AvatarImage 
          src={avatarUrl} 
          alt={username || fullName || "User avatar"}
          className="object-cover"
          style={{ 
            objectFit: "cover",
            width: "100%",
            height: "100%",
            display: "block"
          }}
        />
      )}
      <AvatarFallback className={cn(
        "bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold",
        fallbackClassName
      )}>
        {userId ? getFallbackText() : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
} 