"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { changePassword } from "@/lib/api/user"

export default function SettingsTab() {
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp")
      return
    }

    if (passwordData.new_password.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    setIsChangingPassword(true)
    
    try {
      await changePassword(passwordData)
      toast.success("Đổi mật khẩu thành công")
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Cài đặt tài khoản</CardTitle>
        <CardDescription className="text-sm">Quản lý cài đặt tài khoản và quyền riêng tư</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium">Bảo mật</h3>
          <form onSubmit={handleChangePassword} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">Mật khẩu hiện tại</Label>
              <Input 
                id="current-password" 
                type="password" 
                className="w-full"
                value={passwordData.current_password}
                onChange={(e) => handlePasswordChange("current_password", e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">Mật khẩu mới</Label>
              <Input 
                id="new-password" 
                type="password" 
                className="w-full"
                value={passwordData.new_password}
                onChange={(e) => handlePasswordChange("new_password", e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Xác nhận mật khẩu mới</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                className="w-full"
                value={passwordData.confirm_password}
                onChange={(e) => handlePasswordChange("confirm_password", e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
          </form>

          <Separator />

          <h3 className="text-base sm:text-lg font-medium">Tài khoản liên kết</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Tài khoản Google</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Liên kết tài khoản Google để đăng nhập dễ dàng hơn
                </p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">Liên kết</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 