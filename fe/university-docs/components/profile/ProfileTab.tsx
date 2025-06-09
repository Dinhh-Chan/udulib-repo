import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User as UserType } from "@/types/user"
import { updateUserProfile } from "@/lib/api/user"
import { toast } from "sonner"

interface ProfileTabProps {
  user: UserType
  onUserUpdate: (updatedUser: UserType) => void
}

export default function ProfileTab({ user, onUserUpdate }: ProfileTabProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState(() => {
    const nameParts = user.full_name.split(" ")
    return {
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      studentId: user.university_id?.toString() || ""
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
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