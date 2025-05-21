"use client"

import { Badge } from "@/components/ui/badge"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Mail, Shield, Database, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="general">
        <TabsList className="mb-8">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt chung
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Sao lưu
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>
                Quản lý các cài đặt chung của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Tên trang web</Label>
                <Input id="site-name" defaultValue="Thư viện tài liệu học tập" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Mô tả trang web</Label>
                <Textarea
                  id="site-description"
                  defaultValue="Hệ thống lưu trữ và quản lý tài liệu học tập cho các ngành học của trường đại học."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email liên hệ</Label>
                <Input id="contact-email" type="email" defaultValue="contact@example.edu.vn" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="items-per-page">Số mục hiển thị trên mỗi trang</Label>
                <Select defaultValue="20">
                  <SelectTrigger id="items-per-page">
                    <SelectValue placeholder="Chọn số mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">
                    Khi bật, trang web sẽ hiển thị thông báo bảo trì cho người dùng
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tài liệu</CardTitle>
              <CardDescription>
                Quản lý các cài đặt liên quan đến tài liệu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="document-approval">Yêu cầu phê duyệt tài liệu</Label>
                  <p className="text-sm text-muted-foreground">
                    Khi bật, tài liệu mới tải lên cần được admin phê duyệt trước khi hiển thị
                  </p>
                </div>
                <Switch id="document-approval" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Kích thước tối đa của tài liệu (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowed-file-types">Định dạng tài liệu cho phép</Label>
                <Input id="allowed-file-types" defaultValue=".pdf, .docx, .pptx, .xlsx" />
                <p className="text-xs text-muted-foreground">
                  Nhập các định dạng tài liệu được phép tải lên, phân cách bằng dấu phẩy
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-comments">Cho phép bình luận</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người dùng bình luận về tài liệu
                  </p>
                </div>
                <Switch id="allow-comments" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-ratings">Cho phép đánh giá</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người dùng đánh giá tài liệu
                  </p>
                </div>
                <Switch id="allow-ratings" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt email</CardTitle>
              <CardDescription>
                Quản lý các cài đặt liên quan đến email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input id="smtp-username" defaultValue="noreply@example.edu.vn" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input id="smtp-password" type="password" defaultValue="********" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-email">Email người gửi</Label>
                <Input id="from-email" defaultValue="noreply@example.edu.vn" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-name">Tên người gửi</Label>
                <Input id="from-name" defaultValue="Thư viện tài liệu học tập" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Gửi thông báo qua email</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi email thông báo cho người dùng khi có tài liệu mới
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>
                Quản lý các cài đặt liên quan đến bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-email-verification">Yêu cầu xác thực email</Label>
                  <p className="text-sm text-muted-foreground">
                    Yêu cầu người dùng xác thực email trước khi sử dụng tài khoản
                  </p>
                </div>
                <Switch id="require-email-verification" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-min-length">Độ dài tối thiểu của mật khẩu</Label>
                <Input id="password-min-length" type="number" defaultValue="8" />
              </div>
              
              <div className="flex items-center justify  />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-complexity">Yêu cầu mật khẩu phức tạp</Label>
                  <p className="text-sm text-muted-foreground">
                    Yêu cầu mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt
                  </p>
                </div>
                <Switch id="password-complexity\" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Thời gian hết hạn phiên đăng nhập (phút)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-google-login">Cho phép đăng nhập bằng Google</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người dùng đăng nhập bằng tài khoản Google
                  </p>
                </div>
                <Switch id="allow-google-login" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Sao lưu và khôi phục</CardTitle>
              <CardDescription>
                Quản lý sao lưu và khôi phục dữ liệu hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Tần suất sao lưu tự động</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Chọn tần suất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hàng giờ</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                    <SelectItem value="never">Không bao giờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-retention">Thời gian lưu trữ bản sao lưu (ngày)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-location">Vị trí lưu trữ bản sao lưu</Label>
                <Select defaultValue="local">
                  <SelectTrigger id="backup-location">
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Máy chủ cục bộ</SelectItem>
                    <SelectItem value="cloud">Đám mây</SelectItem>
                    <SelectItem value="both">Cả hai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between gap-4">
                <Button className="flex-1">Tạo bản sao lưu ngay</Button>
                <Button variant="outline" className="flex-1">Khôi phục từ bản sao lưu</Button>
              </div>
              
              <div className="space-y-2">
                <Label>Lịch sử sao lưu gần đây</Label>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Kích thước</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>10/05/2023 08:00</TableCell>
                        <TableCell>256 MB</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Thành công
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Khôi phục</Button>
                          <Button variant="ghost" size="sm">Tải xuống</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>09/05/2023 08:00</TableCell>
                        <TableCell>254 MB</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Thành công
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Khôi phục</Button>
                          <Button variant="ghost" size="sm">Tải xuống</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>08/05/2023 08:00</TableCell>
                        <TableCell>250 MB</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Thành công
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Khôi phục</Button>
                          <Button variant="ghost" size="sm">Tải xuống</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
