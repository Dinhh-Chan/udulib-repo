"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User, UserUpdate } from "@/types/user"
import { updateUser } from "@/lib/api/users"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface EditUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const { user: currentUser } = useAuth()
  
  const [formData, setFormData] = useState<UserUpdate>({
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    status: user.status,
    university_id: user.university_id || "",
  })

  // Reset form data when user changes
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      university_id: user.university_id || "",
    })
    setError("")
  }, [user])

  // Check if current user can edit this user
  const canEditUser = () => {
    if (!currentUser) return false
    
    // Admin can edit anyone except themselves (to prevent self-lockout)
    if (currentUser.role === "admin") {
      return currentUser.user_id !== user.user_id
    }
    
    // Non-admin can only edit themselves
    return currentUser.user_id === user.user_id
  }

  // Check if can change role
  const canChangeRole = () => {
    if (!currentUser) return false
    
    // Only admin can change roles
    if (currentUser.role === "admin") {
      // Admin can't change their own role
      return currentUser.user_id !== user.user_id
    }
    
    return false
  }

  // Check if can change status
  const canChangeStatus = () => {
    if (!currentUser) return false
    
    // Only admin can change status
    if (currentUser.role === "admin") {
      // Admin can't change their own status
      return currentUser.user_id !== user.user_id
    }
    
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate permissions before sending
      if (!canEditUser()) {
        setError("Bạn không có quyền chỉnh sửa người dùng này")
        return
      }

      // Create update object with only allowed fields
      const updateData: UserUpdate = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        university_id: formData.university_id,
      }

      // Only include role and status if user has permission
      if (canChangeRole()) {
        updateData.role = formData.role
      }

      if (canChangeStatus()) {
        updateData.status = formData.status
      }

      console.log("Updating user with data:", updateData) // Debug log

      const success = await updateUser(user.user_id, updateData)
      if (success) {
        onSuccess()
        onOpenChange(false)
        toast.success("Cập nhật thông tin thành công")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      
      if (error instanceof Error) {
        if (error.message.includes("403") || error.message.includes("Forbidden")) {
          setError("Bạn không có quyền thực hiện hành động này")
        } else if (error.message.includes("500")) {
          setError("Lỗi server. Vui lòng thử lại sau hoặc liên hệ quản trị viên")
        } else if (error.message.includes("Network Error")) {
          setError("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại")
        } else {
          setError(error.message || "Có lỗi xảy ra khi cập nhật thông tin")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (!canEditUser()) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Không có quyền truy cập</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              Bạn không có quyền chỉnh sửa thông tin người dùng này.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Họ tên</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "admin" | "student" | "teacher") =>
                setFormData({ ...formData, role: value })
              }
              disabled={loading || !canChangeRole()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="teacher">Giảng viên</SelectItem>
                <SelectItem value="student">Sinh viên</SelectItem>
              </SelectContent>
            </Select>
            {!canChangeRole() && (
              <p className="text-sm text-muted-foreground">
                Chỉ admin mới có thể thay đổi vai trò
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive" | "banned") =>
                setFormData({ ...formData, status: value })
              }
              disabled={loading || !canChangeStatus()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="banned">Bị cấm</SelectItem>
              </SelectContent>
            </Select>
            {!canChangeStatus() && (
              <p className="text-sm text-muted-foreground">
                Chỉ admin mới có thể thay đổi trạng thái
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="university_id">Mã sinh viên/Giảng viên</Label>
            <Input
              id="university_id"
              value={formData.university_id}
              onChange={(e) => setFormData({ ...formData, university_id: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}