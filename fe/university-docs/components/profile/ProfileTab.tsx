import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User as UserType } from "@/types/user"
import { updateUserProfile, getUserAvatar, uploadAvatar } from "@/lib/api/user"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"

interface ProfileTabProps {
  user: UserType
  onUserUpdate: (updatedUser: UserType) => void
}

export default function ProfileTab({ user, onUserUpdate }: ProfileTabProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState(() => {
    const nameParts = user.full_name.split(" ")
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      studentId: user.university_id?.toString() || ""
    }
  })

  // Load avatar khi component mount
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        setIsLoadingAvatar(true)
        const avatar = await getUserAvatar()
        setAvatarUrl(avatar)
      } catch (error) {
        // Không hiển thị lỗi nếu user chưa có avatar
        console.log("User chưa có avatar")
      } finally {
        setIsLoadingAvatar(false)
      }
    }

    loadAvatar()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      toast.error("Vui lòng chọn file ảnh")
      return
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File ảnh không được vượt quá 5MB")
      return
    }

    try {
      setIsLoadingAvatar(true)
      const updatedUser = await uploadAvatar(file)
      
      // Cập nhật avatar hiển thị
      const newAvatarUrl = await getUserAvatar()
      setAvatarUrl(newAvatarUrl)

      onUserUpdate(updatedUser)
      toast.success("Cập nhật avatar thành công")
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      toast.error(error.message || "Không thể upload avatar")
    } finally {
      setIsLoadingAvatar(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      const updatedUser = await updateUserProfile(user.user_id, {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        university_id: formData.studentId
      })

      const updatedUserData = {
        ...user,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        university_id: updatedUser.university_id
      }
      
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      onUserUpdate(updatedUserData)

      toast.success("Cập nhật thông tin thành công")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Không thể cập nhật thông tin")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Thông tin cá nhân</CardTitle>
        <CardDescription className="text-sm">Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage 
                src={avatarUrl || undefined} 
                alt={user.full_name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg sm:text-xl">
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isLoadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
              onClick={handleAvatarClick}
              disabled={isLoadingAvatar}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">Họ</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Tên</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-sm font-medium">Mã sinh viên</Label>
            <Input 
              id="studentId" 
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 sm:pt-6">
        <Button 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
          className="w-full sm:w-auto"
        >
          {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
        </Button>
      </CardFooter>
    </Card>
  )
} 