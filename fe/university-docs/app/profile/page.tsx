"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
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
import { getUserProfile, updateUserProfile } from "@/lib/api/user"
import { User as UserType } from "@/types/user"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Loading from "@/app/loading"
import { getUserDocuments, getDocumentDetail, updateDocument, deleteDocument, Document, DocumentUpdateData } from "@/lib/api/documents"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Notification, getAllNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/api/notification"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user: authUser, isAuthenticated } = useAuth()
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoadingDocument, setIsLoadingDocument] = useState(false)
  const [editForm, setEditForm] = useState<DocumentUpdateData>({
    title: "",
    description: "",
    status: "pending",
    tags: []
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [activeNotificationTab, setActiveNotificationTab] = useState("all")
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: ""
  })

  useEffect(() => {
    // Lấy tab từ URL query parameter
    const tab = searchParams.get("tab")
    if (tab && ["profile", "documents", "forum", "notifications", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isAuthenticated) {
          setIsLoading(false)
          return
        }

        if (authUser?.user_id) {
          const userData = await getUserProfile(authUser.user_id.toString())
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast.error("Không thể tải thông tin người dùng")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [authUser, isAuthenticated])

  useEffect(() => {
    const fetchUserDocuments = async () => {
      if (!authUser?.user_id) return

      setIsLoadingDocuments(true)
      try {
        const response = await getUserDocuments(authUser.user_id, currentPage)
        setDocuments(response.documents || [])
        setTotalPages(Math.ceil(response.total / response.per_page))
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Không thể tải danh sách tài liệu")
        setDocuments([])
      } finally {
        setIsLoadingDocuments(false)
      }
    }

    if (activeTab === "documents") {
      fetchUserDocuments()
    }
  }, [authUser?.user_id, currentPage, activeTab])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || activeTab !== "notifications") return

      setIsLoadingNotifications(true)
      try {
        const data = await getAllNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        toast.error("Không thể tải thông báo")
      } finally {
        setIsLoadingNotifications(false)
      }
    }

    fetchNotifications()
  }, [isAuthenticated, activeTab])

  useEffect(() => {
    if (user) {
      const nameParts = user.full_name.split(" ")
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        studentId: user.university_id?.toString() || ""
      })
    }
  }, [user])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Cập nhật URL với tab mới
    router.push(`/profile?tab=${tab}`)
  }

  const handleViewDocument = async (documentId: number) => {
    try {
      setIsLoadingDocument(true)
      const doc = await getDocumentDetail(documentId)
      setSelectedDocument(doc)
      setIsEditDialogOpen(true)
      setEditForm({
        title: doc.title,
        description: doc.description,
        status: doc.status,
        tags: doc.tags.map((tag: any) => tag.tag_name)
      })
    } catch (error) {
      console.error("Error fetching document:", error)
      toast.error("Không thể tải thông tin tài liệu")
    } finally {
      setIsLoadingDocument(false)
    }
  }

  const handleUpdateDocument = async () => {
    if (!selectedDocument) return

    try {
      setIsLoadingDocument(true)
      await updateDocument(selectedDocument.document_id, editForm)
      toast.success("Cập nhật tài liệu thành công")
      setIsEditDialogOpen(false)
      // Refresh danh sách tài liệu
      const response = await getUserDocuments(authUser!.user_id, currentPage)
      setDocuments(response.documents || [])
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Không thể cập nhật tài liệu")
    } finally {
      setIsLoadingDocument(false)
    }
  }

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return

    try {
      setIsLoadingDocument(true)
      await deleteDocument(documentToDelete)
      toast.success("Xóa tài liệu thành công")
      setIsDeleteDialogOpen(false)
      // Refresh danh sách tài liệu
      const response = await getUserDocuments(authUser!.user_id, currentPage)
      setDocuments(response.documents || [])
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
    } finally {
      setIsLoadingDocument(false)
      setDocumentToDelete(null)
    }
  }

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.notification_id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      )
      toast.success("Đã đánh dấu thông báo đã đọc")
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast.error("Không thể đánh dấu thông báo đã đọc")
    }
  }

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, is_read: true }))
      )
      toast.success("Đã đánh dấu tất cả thông báo đã đọc")
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      setIsUpdating(true)
      const updatedUser = await updateUserProfile(user.user_id, {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        university_id: formData.studentId
      })

      // Cập nhật thông tin người dùng trong context
      const updatedUserData = {
        ...user,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        university_id: updatedUser.university_id
      }
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      setUser(updatedUserData)

      toast.success("Cập nhật thông tin thành công")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Không thể cập nhật thông tin")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <p>Vui lòng đăng nhập để xem thông tin</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <p>Không tìm thấy thông tin người dùng</p>
      </div>
    )
  }

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
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.full_name} />
                  <AvatarFallback>{user.full_name}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">{user.role}</p>
                <Badge className="mt-2">{user.status === 'active' ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</Badge>
                <div className="w-full mt-4 pt-4 border-t flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tên đăng nhập:</span>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ngày tham gia:</span>
                    <span className="font-medium">{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleTabChange("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Thông tin cá nhân
              </Button>
              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleTabChange("documents")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Tài liệu của tôi
              </Button>
              <Button
                variant={activeTab === "forum" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleTabChange("forum")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Bài viết diễn đàn
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleTabChange("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleTabChange("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt tài khoản
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
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Tên</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Mã sinh viên</Label>
                      <Input 
                        id="studentId" 
                        value={formData.studentId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </Button>
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
                    <TabsContent value="uploaded" className="mt-6">
                      {isLoadingDocuments ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : documents && documents.length > 0 ? (
                        <>
                          <div className="space-y-4">
                            {documents.map((doc) => (
                              <div key={doc.document_id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                  <Link href={`/documents/${doc.document_id}`} className="font-medium hover:underline">
                                    {doc.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Badge variant={doc.status === "approved" ? "default" : "secondary"}>
                                      {doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                                    </Badge>
                                    <span>•</span>
                                    <span>{new Date(doc.created_at).toLocaleDateString('vi-VN')}</span>
                                    <span>•</span>
                                    <span>{doc.subject.subject_name}</span>
                                    <span>•</span>
                                    <span>{doc.view_count} lượt xem</span>
                                    <span>•</span>
                                    <span>{doc.download_count} lượt tải</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.document_id)}>
                                    Chỉnh sửa
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => {
                                      setDocumentToDelete(doc.document_id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                              >
                                Trước
                              </Button>
                              <span className="flex items-center px-4">
                                Trang {currentPage} / {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                              >
                                Sau
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Chưa có tài liệu nào được tải lên
                        </div>
                      )}
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
                  <Tabs defaultValue="all" value={activeNotificationTab} onValueChange={setActiveNotificationTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">Tất cả</TabsTrigger>
                      <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                      <TabsTrigger value="read">Đã đọc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div
                              key={`notification-${notification.notification_id}`}
                              className={`p-4 border rounded-lg ${
                                !notification.is_read ? "bg-primary/5 border-primary/20" : ""
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-2 h-2 mt-2 rounded-full ${
                                    notification.is_read ? "bg-muted" : "bg-primary"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className={notification.is_read ? "text-muted-foreground" : ""}>
                                    {notification.content}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkNotificationAsRead(notification.notification_id)}
                                  >
                                    Đánh dấu đã đọc
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {notifications.some(n => !n.is_read) && (
                            <div className="flex justify-end mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllNotificationsAsRead}
                              >
                                Đánh dấu tất cả đã đọc
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Không có thông báo nào
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="unread" className="mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.filter(n => !n.is_read).length > 0 ? (
                        <div className="space-y-4">
                          {notifications
                            .filter(n => !n.is_read)
                            .map((notification) => (
                              <div
                                key={`notification-${notification.notification_id}`}
                                className="p-4 border rounded-lg bg-primary/5 border-primary/20"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                                  <div className="flex-1">
                                    <p>{notification.content}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkNotificationAsRead(notification.notification_id)}
                                  >
                                    Đánh dấu đã đọc
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleMarkAllNotificationsAsRead}
                            >
                              Đánh dấu tất cả đã đọc
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Không có thông báo chưa đọc
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="read" className="mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.filter(n => n.is_read).length > 0 ? (
                        <div className="space-y-4">
                          {notifications
                            .filter(n => n.is_read)
                            .map((notification) => (
                              <div
                                key={`notification-${notification.notification_id}`}
                                className="p-4 border rounded-lg"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-2 h-2 mt-2 rounded-full bg-muted" />
                                  <div className="flex-1">
                                    <p className="text-muted-foreground">{notification.content}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Không có thông báo đã đọc
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          </DialogHeader>
          {isLoadingDocument ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              {authUser?.role === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: "approved" | "pending" | "rejected") =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateDocument} disabled={isLoadingDocument}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} disabled={isLoadingDocument}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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