import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Cấu hình hệ thống</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý các cài đặt chung của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Tên trang web</Label>
                <Input id="site-name" defaultValue="Hệ thống Quản lý Tài liệu Học tập" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Mô tả trang web</Label>
                <Input
                  id="site-description"
                  defaultValue="Hệ thống lưu trữ và quản lý tài liệu học tập cho các ngành học"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email liên hệ</Label>
                <Input id="contact-email" type="email" defaultValue="admin@example.edu.vn" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">Khi bật, trang web sẽ hiển thị thông báo bảo trì</p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tài liệu</CardTitle>
              <CardDescription>Quản lý các cài đặt liên quan đến tài liệu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="moderation">Kiểm duyệt tài liệu</Label>
                  <p className="text-sm text-muted-foreground">Tài liệu cần được kiểm duyệt trước khi hiển thị</p>
                </div>
                <Switch id="moderation" defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Dung lượng tối đa (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowed-types">Định dạng cho phép</Label>
                <Input id="allowed-types" defaultValue="pdf,doc,docx,ppt,pptx,xls,xlsx,jpg,png" />
                <p className="text-xs text-muted-foreground">Phân cách bằng dấu phẩy</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-comments">Cho phép bình luận</Label>
                  <p className="text-sm text-muted-foreground">Người dùng có thể bình luận về tài liệu</p>
                </div>
                <Switch id="allow-comments" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý các cài đặt thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Thông báo qua email</Label>
                  <p className="text-sm text-muted-foreground">Gửi thông báo qua email cho người dùng</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin-notifications">Thông báo cho admin</Label>
                  <p className="text-sm text-muted-foreground">Gửi thông báo cho admin khi có tài liệu mới</p>
                </div>
                <Switch id="admin-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="web-notifications">Thông báo trên web</Label>
                  <p className="text-sm text-muted-foreground">Hiển thị thông báo trên trang web</p>
                </div>
                <Switch id="web-notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>Quản lý các cài đặt bảo mật</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="google-login">Đăng nhập bằng Google</Label>
                  <p className="text-sm text-muted-foreground">Cho phép đăng nhập bằng tài khoản Google</p>
                </div>
                <Switch id="google-login" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-verification">Xác thực email</Label>
                  <p className="text-sm text-muted-foreground">Yêu cầu xác thực email khi đăng ký</p>
                </div>
                <Switch id="email-verification" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Chính sách mật khẩu</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chính sách" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Cơ bản (ít nhất 6 ký tự)</SelectItem>
                    <SelectItem value="medium">Trung bình (ít nhất 8 ký tự, bao gồm chữ và số)</SelectItem>
                    <SelectItem value="high">
                      Cao (ít nhất 10 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
