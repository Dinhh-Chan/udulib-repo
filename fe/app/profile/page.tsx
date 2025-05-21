"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, User, Settings, FileText, MessageSquare, History, Bell, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và hoạt động của bạn</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Nguyễn Văn X" />
                  <AvatarFallback>NVX</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">Nguyễn Văn X</h3>
                <p className="text-sm text-muted-foreground">Sinh viên năm 3</p>
                <Badge className="mt-2">Thành viên</Badge>
                <div className="w-full mt-4 pt-4 border-t flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Tài liệu đã tải lên:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bài viết diễn đàn:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ngày tham gia:</span>
                    <span className="font-medium">01/01/2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Thông tin cá nhân
              </Button>
              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("documents")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Tài liệu của tôi
              </Button>
              <Button
                variant={activeTab === "forum" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("forum")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Bài viết diễn đàn
              </Button>
              <Button
                variant={activeTab === "history" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("history")}
              >
                <History className="h-4 w-4 mr-2" />
                Lịch sử hoạt động
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt tài khoản
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Họ</Label>
                        <Input id="firstName" defaultValue="Nguyễn" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input id="lastName" defaultValue="Văn X" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="nguyenvanx@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Mã sinh viên</Label>
                      <Input id="studentId" defaultValue="SV12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Ngành học</Label>
                      <Select defaultValue="it">
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Chọn ngành học" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it">Công nghệ thông tin</SelectItem>
                          <SelectItem value="finance">Tài chính - Ngân hàng</SelectItem>
                          <SelectItem value="accounting">Kế toán</SelectItem>
                          <SelectItem value="business">Quản trị kinh doanh</SelectItem>
                          <SelectItem value="economics">Kinh tế</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Giới thiệu bản thân</Label>
                      <Textarea
                        id="bio"
                        placeholder="Viết một vài dòng về bản thân..."
                        defaultValue="Sinh viên năm 3 ngành Công nghệ thông tin, đam mê lập trình và chia sẻ kiến thức."
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu của tôi</CardTitle>
                  <CardDescription>Quản lý các tài liệu bạn đã tải lên</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="uploaded">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="uploaded">Đã tải lên</TabsTrigger>
                      <TabsTrigger value="saved">Đã lưu</TabsTrigger>
                      <TabsTrigger value="downloaded">Đã tải xuống</TabsTrigger>
                    </TabsList>
                    <TabsContent value="uploaded" className="mt-6">
                      <div className="space-y-4">
                        {userDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                                {doc.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{doc.course}</span>
                                <span>•</span>
                                <span>{doc.uploadDate}</span>
                                <span>•</span>
                                <span>{doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/documents/${doc.id}`}>Xem</Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                Chỉnh sửa
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="saved" className="mt-6">
                      <div className="space-y-4">
                        {savedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                                {doc.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{doc.course}</span>
                                <span>•</span>
                                <span>Đã lưu: {doc.savedDate}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/documents/${doc.id}`}>Xem</Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                Bỏ lưu
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="downloaded" className="mt-6">
                      <div className="space-y-4">
                        {downloadedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">
                                {doc.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{doc.course}</span>
                                <span>•</span>
                                <span>Đã tải: {doc.downloadDate}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/documents/${doc.id}`}>Xem</Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                Tải lại
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                  <CardDescription>Quản lý cài đặt tài khoản và quyền riêng tư</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bảo mật</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Cập nhật mật khẩu</Button>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Thông báo</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Thông báo qua email</Label>
                          <p className="text-sm text-muted-foreground">Nhận thông báo qua email khi có hoạt động mới</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="document-notifications">Thông báo về tài liệu</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo khi tài liệu của bạn được duyệt hoặc có bình luận mới
                          </p>
                        </div>
                        <Switch id="document-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="forum-notifications">Thông báo về diễn đàn</Label>
                          <p className="text-sm text-muted-foreground">
                            Nhận thông báo khi có trả lời cho bài viết của bạn
                          </p>
                        </div>
                        <Switch id="forum-notifications" defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Quyền riêng tư</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility">Hiển thị hồ sơ công khai</Label>
                          <p className="text-sm text-muted-foreground">Cho phép người dùng khác xem hồ sơ của bạn</p>
                        </div>
                        <Switch id="profile-visibility" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="activity-visibility">Hiển thị hoạt động</Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị hoạt động gần đây của bạn cho người dùng khác
                          </p>
                        </div>
                        <Switch id="activity-visibility" />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Tài khoản liên kết</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Tài khoản Google</Label>
                          <p className="text-sm text-muted-foreground">
                            Liên kết tài khoản Google để đăng nhập dễ dàng hơn
                          </p>
                        </div>
                        <Button variant="outline">Liên kết</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="pt-4">
                      <Button variant="destructive">Xóa tài khoản</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>Quản lý thông báo của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">Tất cả</TabsTrigger>
                      <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                      <TabsTrigger value="read">Đã đọc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-6">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border rounded-lg ${
                              notification.read ? "" : "bg-primary/5 border-primary/20"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-2 h-2 mt-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`}
                              />
                              <div className="flex-1">
                                <p className={notification.read ? "text-muted-foreground" : ""}>
                                  {notification.content}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <Button variant="ghost" size="sm">
                                  Đánh dấu đã đọc
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="unread" className="mt-6">
                      <div className="space-y-4">
                        {notifications
                          .filter((n) => !n.read)
                          .map((notification) => (
                            <div key={notification.id} className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                              <div className="flex items-start gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                <div className="flex-1">
                                  <p>{notification.content}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Đánh dấu đã đọc
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="read" className="mt-6">
                      <div className="space-y-4">
                        {notifications
                          .filter((n) => n.read)
                          .map((notification) => (
                            <div key={notification.id} className="p-4 border rounded-lg">
                              <div className="flex items-start gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-muted" />
                                <div className="flex-1">
                                  <p className="text-muted-foreground">{notification.content}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const userDocuments = [
  {
    id: "1",
    title: "Bài tập thực hành lập trình C++",
    course: "Nhập môn lập trình",
    uploadDate: "15/04/2023",
    status: "approved",
  },
  {
    id: "2",
    title: "Báo cáo đồ án môn học Cơ sở dữ liệu",
    course: "Cơ sở dữ liệu",
    uploadDate: "20/05/2023",
    status: "approved",
  },
  {
    id: "3",
    title: "Slide thuyết trình môn Mạng máy tính",
    course: "Mạng máy tính",
    uploadDate: "10/06/2023",
    status: "pending",
  },
]

const savedDocuments = [
  {
    id: "4",
    title: "Giáo trình Nhập môn lập trình",
    course: "Nhập môn lập trình",
    savedDate: "05/03/2023",
  },
  {
    id: "5",
    title: "Đề thi cuối kỳ môn Cấu trúc dữ liệu và giải thuật",
    course: "Cấu trúc dữ liệu và giải thuật",
    savedDate: "12/04/2023",
  },
]

const downloadedDocuments = [
  {
    id: "6",
    title: "Slide bài giảng tuần 1-5 môn Nhập môn lập trình",
    course: "Nhập môn lập trình",
    downloadDate: "01/03/2023",
  },
  {
    id: "7",
    title: "Bài tập thực hành số 1 môn Cấu trúc dữ liệu",
    course: "Cấu trúc dữ liệu và giải thuật",
    downloadDate: "10/04/2023",
  },
]

const notifications = [
  {
    id: "1",
    content: "Tài liệu 'Bài tập thực hành lập trình C++' của bạn đã được duyệt.",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "2",
    content: "Nguyễn Văn Y đã bình luận về tài liệu của bạn.",
    time: "Hôm qua",
    read: false,
  },
  {
    id: "3",
    content: "Bài viết của bạn trên diễn đàn đã nhận được 3 câu trả lời mới.",
    time: "2 ngày trước",
    read: false,
  },
  {
    id: "4",
    content: "Tài liệu 'Báo cáo đồ án môn học Cơ sở dữ liệu' của bạn đã được duyệt.",
    time: "1 tuần trước",
    read: true,
  },
  {
    id: "5",
    content: "Chào mừng bạn đến với hệ thống quản lý tài liệu học tập!",
    time: "01/01/2023",
    read: true,
  },
]
