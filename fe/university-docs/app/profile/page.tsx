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
import { getUserForumPosts, deleteForumPost } from "@/lib/api/forum"
import { ForumPost } from "@/types/forum"
import { getViewedDocuments, getDownloadedDocuments, DocumentHistory } from "@/lib/api/document-history"

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
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [isLoadingForumPosts, setIsLoadingForumPosts] = useState(false)
  const [forumCurrentPage, setForumCurrentPage] = useState(1)
  const [forumTotalPages, setForumTotalPages] = useState(1)
  const [forumPostToDelete, setForumPostToDelete] = useState<number | null>(null)
  const [isDeleteForumPostDialogOpen, setIsDeleteForumPostDialogOpen] = useState(false)
  const [viewedDocuments, setViewedDocuments] = useState<DocumentHistory[]>([])
  const [downloadedDocuments, setDownloadedDocuments] = useState<DocumentHistory[]>([])
  const [isLoadingViewedDocuments, setIsLoadingViewedDocuments] = useState(false)
  const [isLoadingDownloadedDocuments, setIsLoadingDownloadedDocuments] = useState(false)
  const [viewedCurrentPage, setViewedCurrentPage] = useState(1)
  const [viewedTotalPages, setViewedTotalPages] = useState(1)
  const [downloadedCurrentPage, setDownloadedCurrentPage] = useState(1)
  const [downloadedTotalPages, setDownloadedTotalPages] = useState(1)

  useEffect(() => {
    // Lấy tab từ URL query parameter
    const tab = searchParams?.get("tab")
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
    const fetchUserForumPosts = async () => {
      if (!authUser?.user_id || activeTab !== "forum") return

      setIsLoadingForumPosts(true)
      try {
        const response = await getUserForumPosts(authUser.user_id, forumCurrentPage, 5)
        setForumPosts(response.posts || [])
        setForumTotalPages(response.total_pages)
      } catch (error) {
        console.error("Error fetching forum posts:", error)
        toast.error("Không thể tải danh sách bài viết")
        setForumPosts([])
      } finally {
        setIsLoadingForumPosts(false)
      }
    }

    fetchUserForumPosts()
  }, [authUser?.user_id, forumCurrentPage, activeTab])

  useEffect(() => {
    const fetchViewedDocuments = async () => {
      if (!authUser?.user_id || activeTab !== "documents") return

      setIsLoadingViewedDocuments(true)
      try {
        const response = await getViewedDocuments(authUser.user_id)
        setViewedDocuments(response || [])
        setViewedTotalPages(1) // Backend sẽ handle pagination
      } catch (error) {
        console.error("Error fetching viewed documents:", error)
        toast.error("Không thể tải danh sách tài liệu đã xem")
        setViewedDocuments([])
      } finally {
        setIsLoadingViewedDocuments(false)
      }
    }

    fetchViewedDocuments()
  }, [authUser?.user_id, viewedCurrentPage, activeTab])

  useEffect(() => {
    const fetchDownloadedDocuments = async () => {
      if (!authUser?.user_id || activeTab !== "documents") return

      setIsLoadingDownloadedDocuments(true)
      try {
        const response = await getDownloadedDocuments(authUser.user_id)
        setDownloadedDocuments(response || [])
        setDownloadedTotalPages(1) // Backend sẽ handle pagination
      } catch (error) {
        console.error("Error fetching downloaded documents:", error)
        toast.error("Không thể tải danh sách tài liệu đã tải")
        setDownloadedDocuments([])
      } finally {
        setIsLoadingDownloadedDocuments(false)
      }
    }

    fetchDownloadedDocuments()
  }, [authUser?.user_id, downloadedCurrentPage, activeTab])

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
    // Cập nhật URL mà không reload trang
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.pushState({}, '', url)
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

  const handleDeleteForumPost = async () => {
    if (!forumPostToDelete) return

    try {
      setIsLoadingForumPosts(true)
      await deleteForumPost(forumPostToDelete)
      toast.success("Xóa bài viết thành công")
      setIsDeleteForumPostDialogOpen(false)
      // Refresh danh sách bài viết forum
      const response = await getUserForumPosts(authUser!.user_id, forumCurrentPage, 5)
      setForumPosts(response.posts || [])
      setForumTotalPages(response.total_pages)
    } catch (error) {
      console.error("Error deleting forum post:", error)
      toast.error("Không thể xóa bài viết")
    } finally {
      setIsLoadingForumPosts(false)
      setForumPostToDelete(null)
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
      
      // Cập nhật localStorage và state
      localStorage.setItem("user", JSON.stringify(updatedUserData))
      setUser(updatedUserData)

      toast.success("Cập nhật thông tin thành công")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Không thể cập nhật thông tin")
    } finally {
      setIsUpdating(false)
    }
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "warning":
        return "bg-amber-100 border-amber-300 text-amber-800"
      case "success":
        return "bg-green-100 border-green-300 text-green-800"
      case "error":
        return "bg-red-100 border-red-300 text-red-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500 text-white"
      case "warning":
        return "bg-amber-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này</p>
          <Button asChild>
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user && !isLoading && isAuthenticated) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">Không tìm thấy thông tin người dùng</p>
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </div>
      </div>
    )
  }

  // At this point, user is guaranteed to exist
  if (!user) {
    return <Loading />
  }

  return (
    <div className="container py-4 sm:py-6 lg:py-8 px-4 md:px-6">
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Quản lý thông tin cá nhân và hoạt động của bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="w-full lg:w-64 xl:w-72 space-y-4 lg:space-y-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.full_name} />
                  <AvatarFallback className="text-sm sm:text-base">{user.full_name}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-base sm:text-lg truncate w-full">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                <Badge className="mt-2 text-xs">{user.status === 'active' ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</Badge>
                <div className="w-full mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium truncate ml-2 max-w-[60%]">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên đăng nhập:</span>
                    <span className="font-medium truncate ml-2 max-w-[60%]">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tham gia:</span>
                    <span className="font-medium">{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã sinh viên:</span>
                    <span className="font-medium truncate ml-2 max-w-[60%]">{user.university_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-1 lg:space-x-0 lg:space-y-1 pb-2 lg:pb-0">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="justify-start whitespace-nowrap flex-shrink-0 lg:w-full"
                onClick={() => handleTabChange("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline lg:inline">Thông tin cá nhân</span>
                <span className="sm:hidden lg:hidden">Hồ sơ</span>
              </Button>
              <Button
                variant={activeTab === "documents" ? "default" : "ghost"}
                className="justify-start whitespace-nowrap flex-shrink-0 lg:w-full"
                onClick={() => handleTabChange("documents")}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline lg:inline">Tài liệu của tôi</span>
                <span className="sm:hidden lg:hidden">Tài liệu</span>
              </Button>
              <Button
                variant={activeTab === "forum" ? "default" : "ghost"}
                className="justify-start whitespace-nowrap flex-shrink-0 lg:w-full"
                onClick={() => handleTabChange("forum")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline lg:inline">Bài viết diễn đàn</span>
                <span className="sm:hidden lg:hidden">Diễn đàn</span>
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="justify-start whitespace-nowrap flex-shrink-0 lg:w-full"
                onClick={() => handleTabChange("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline lg:inline">Thông báo</span>
                <span className="sm:hidden lg:hidden">Thông báo</span>
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="justify-start whitespace-nowrap flex-shrink-0 lg:w-full"
                onClick={() => handleTabChange("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline lg:inline">Cài đặt tài khoản</span>
                <span className="sm:hidden lg:hidden">Cài đặt</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
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
            )}

            {activeTab === "documents" && (
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Tài liệu của tôi</CardTitle>
                  <CardDescription className="text-sm">Quản lý các tài liệu bạn đã tải lên</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="uploaded">
                    <TabsList>
                      <TabsTrigger value="uploaded">Tải lên</TabsTrigger>
                      <TabsTrigger value="viewed">Đã xem</TabsTrigger>
                      <TabsTrigger value="downloaded">Đã tải</TabsTrigger>
                    </TabsList>
                    <TabsContent value="uploaded" className="mt-4 sm:mt-6">
                      {isLoadingDocuments ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : documents && documents.length > 0 ? (
                        <>
                          <div className="space-y-3 sm:space-y-4">
                            {documents.map((doc) => (
                              <div key={doc.document_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link href={`/documents/${doc.document_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                                    {doc.title}
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                    <Badge variant={doc.status === "approved" ? "default" : "secondary"} className="text-xs">
                                      {doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                                    </Badge>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{new Date(doc.created_at).toLocaleDateString('vi-VN')}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="truncate max-w-[120px] sm:max-w-none">{doc.subject.subject_name}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{doc.view_count} lượt xem</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{doc.download_count} lượt tải</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.document_id)} className="text-xs sm:text-sm">
                                    Chỉnh sửa
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => {
                                      setDocumentToDelete(doc.document_id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                    className="text-xs sm:text-sm"
                                  >
                                    Xóa
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-full sm:w-auto"
                              >
                                Trước
                              </Button>
                              <span className="flex items-center px-4 text-sm">
                                Trang {currentPage} / {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-full sm:w-auto"
                              >
                                Sau
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                          Chưa có tài liệu nào được tải lên
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="viewed" className="mt-4 sm:mt-6">
                      {isLoadingViewedDocuments ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : viewedDocuments.length > 0 ? (
                        <>
                          <div className="space-y-3 sm:space-y-4">
                            {viewedDocuments.map((history) => (
                              <div key={history.history_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link href={`/documents/${history.document_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                                    {history.document?.title || "Tài liệu không có tiêu đề"}
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                    <span className="truncate">{history.document?.subject?.subject_name || "Không xác định"}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Đã xem: {new Date(history.created_at).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {viewedTotalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewedCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={viewedCurrentPage === 1}
                                className="w-full sm:w-auto"
                              >
                                Trước
                              </Button>
                              <span className="flex items-center px-4 text-sm">
                                Trang {viewedCurrentPage} / {viewedTotalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewedCurrentPage((prev) => Math.min(prev + 1, viewedTotalPages))}
                                disabled={viewedCurrentPage === viewedTotalPages}
                                className="w-full sm:w-auto"
                              >
                                Sau
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                          Chưa có tài liệu nào được xem
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="downloaded" className="mt-4 sm:mt-6">
                      {isLoadingDownloadedDocuments ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : downloadedDocuments.length > 0 ? (
                        <>
                          <div className="space-y-3 sm:space-y-4">
                            {downloadedDocuments.map((history) => (
                              <div key={history.history_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link href={`/documents/${history.document_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                                    {history.document?.title || "Tài liệu không có tiêu đề"}
                                  </Link>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                    <span className="truncate">{history.document?.subject?.subject_name || "Không xác định"}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Đã tải: {new Date(history.created_at).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {downloadedTotalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDownloadedCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={downloadedCurrentPage === 1}
                                className="w-full sm:w-auto"
                              >
                                Trước
                              </Button>
                              <span className="flex items-center px-4 text-sm">
                                Trang {downloadedCurrentPage} / {downloadedTotalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDownloadedCurrentPage((prev) => Math.min(prev + 1, downloadedTotalPages))}
                                disabled={downloadedCurrentPage === downloadedTotalPages}
                                className="w-full sm:w-auto"
                              >
                                Sau
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                          Chưa có tài liệu nào được tải
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "forum" && (
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Bài viết diễn đàn</CardTitle>
                  <CardDescription className="text-sm">Quản lý các bài viết bạn đã đăng trên diễn đàn</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingForumPosts ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : forumPosts && forumPosts.length > 0 ? (
                    <>
                      <div className="space-y-3 sm:space-y-4">
                        {forumPosts.map((post) => (
                          <div key={post.post_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              {post.status === "approved" ? (
                                <Link href={`/forum/posts/${post.post_id}`} className="font-medium hover:underline text-sm sm:text-base block truncate">
                                  {post.title}
                                </Link>
                              ) : (
                                <span className="font-medium text-muted-foreground text-sm sm:text-base block truncate">
                                  {post.title}
                                </span>
                              )}
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                                <Badge variant={post.status === "approved" ? "default" : "secondary"} className="text-xs">
                                  {post.status === "approved" ? "Đã duyệt" : 
                                   post.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                                </Badge>
                                <span className="hidden sm:inline">•</span>
                                <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate max-w-[120px] sm:max-w-none">{(post as any).forum_name || "Diễn đàn"}</span>
                                {post.reply_count !== undefined && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{post.reply_count} trả lời</span>
                                  </>
                                )}
                              </div>
                              <div className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                                {post.content.length > 100 && '...'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {post.status === "approved" && (
                                <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm">
                                  <Link href={`/forum/posts/${post.post_id}`}>Xem</Link>
                                </Button>
                              )}
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => {
                                  setForumPostToDelete(post.post_id)
                                  setIsDeleteForumPostDialogOpen(true)
                                }}
                                className="text-xs sm:text-sm"
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {forumTotalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setForumCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={forumCurrentPage === 1}
                            className="w-full sm:w-auto"
                          >
                            Trước
                          </Button>
                          <span className="flex items-center px-4 text-sm">
                            Trang {forumCurrentPage} / {forumTotalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setForumCurrentPage((prev) => Math.min(prev + 1, forumTotalPages))}
                            disabled={forumCurrentPage === forumTotalPages}
                            className="w-full sm:w-auto"
                          >
                            Sau
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                      Chưa có bài viết nào được đăng
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Cài đặt tài khoản</CardTitle>
                  <CardDescription className="text-sm">Quản lý cài đặt tài khoản và quyền riêng tư</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-medium">Bảo mật</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-sm font-medium">Mật khẩu hiện tại</Label>
                        <Input id="current-password" type="password" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm font-medium">Mật khẩu mới</Label>
                        <Input id="new-password" type="password" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium">Xác nhận mật khẩu mới</Label>
                        <Input id="confirm-password" type="password" className="w-full" />
                      </div>
                      <Button className="w-full sm:w-auto">Cập nhật mật khẩu</Button>
                    </div>

                    <Separator />

                    <h3 className="text-base sm:text-lg font-medium">Thông báo</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications" className="text-sm font-medium">Thông báo qua email</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Nhận thông báo qua email khi có hoạt động mới</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="document-notifications" className="text-sm font-medium">Thông báo về tài liệu</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Nhận thông báo khi tài liệu của bạn được duyệt hoặc có bình luận mới
                          </p>
                        </div>
                        <Switch id="document-notifications" defaultChecked />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="forum-notifications" className="text-sm font-medium">Thông báo về diễn đàn</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Nhận thông báo khi có trả lời cho bài viết của bạn
                          </p>
                        </div>
                        <Switch id="forum-notifications" defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-base sm:text-lg font-medium">Quyền riêng tư</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-visibility" className="text-sm font-medium">Hiển thị hồ sơ công khai</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">Cho phép người dùng khác xem hồ sơ của bạn</p>
                        </div>
                        <Switch id="profile-visibility" defaultChecked />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="activity-visibility" className="text-sm font-medium">Hiển thị hoạt động</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Hiển thị hoạt động gần đây của bạn cho người dùng khác
                          </p>
                        </div>
                        <Switch id="activity-visibility" />
                      </div>
                    </div>

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

                    <Separator />

                    <div className="pt-3 sm:pt-4">
                      <Button variant="destructive" className="w-full sm:w-auto">Xóa tài khoản</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Thông báo</CardTitle>
                  <CardDescription className="text-sm">Quản lý thông báo của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" value={activeNotificationTab} onValueChange={setActiveNotificationTab}>
                    <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                      <TabsTrigger value="all" className="text-xs sm:text-sm">Tất cả</TabsTrigger>
                      <TabsTrigger value="unread" className="text-xs sm:text-sm">Chưa đọc</TabsTrigger>
                      <TabsTrigger value="read" className="text-xs sm:text-sm">Đã đọc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4 sm:mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {notifications.map((notification) => (
                            <div
                              key={`notification-${notification.notification_id}`}
                              className={`p-3 sm:p-4 border rounded-lg ${
                                !notification.is_read 
                                  ? notification.type 
                                    ? getNotificationTypeColor(notification.type)
                                    : "bg-primary/5 border-primary/20" 
                                  : ""
                              }`}
                            >
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div
                                  className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                    notification.is_read ? "bg-muted" : "bg-primary"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                      getNotificationTypeBadge(notification.type || "info")
                                    }`}>
                                      {(notification.type || "info").toUpperCase()}
                                    </span>
                                    <p className="font-medium text-sm sm:text-base truncate">{notification.title}</p>
                                  </div>
                                  <p className={`text-xs sm:text-sm ${notification.is_read ? "text-muted-foreground" : ""}`}>
                                    {notification.content}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                {!notification.is_read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkNotificationAsRead(notification.notification_id)}
                                    className="flex-shrink-0 text-xs sm:text-sm"
                                  >
                                    <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                                    <span className="sm:hidden">Đã đọc</span>
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
                                className="text-xs sm:text-sm"
                              >
                                <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                                <span className="sm:hidden">Đọc tất cả</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                          Không có thông báo nào
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="unread" className="mt-4 sm:mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.filter(n => !n.is_read).length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {notifications
                            .filter(n => !n.is_read)
                            .map((notification) => (
                              <div
                                key={`notification-${notification.notification_id}`}
                                className={`p-3 sm:p-4 border rounded-lg ${getNotificationTypeColor(notification.type || "info")}`}
                              >
                                <div className="flex items-start gap-3 sm:gap-4">
                                  <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                        getNotificationTypeBadge(notification.type || "info")
                                      }`}>
                                        {(notification.type || "info").toUpperCase()}
                                      </span>
                                      <p className="font-medium text-sm sm:text-base truncate">{notification.title}</p>
                                    </div>
                                    <p className="text-xs sm:text-sm">{notification.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkNotificationAsRead(notification.notification_id)}
                                    className="flex-shrink-0 text-xs sm:text-sm"
                                  >
                                    <span className="hidden sm:inline">Đánh dấu đã đọc</span>
                                    <span className="sm:hidden">Đã đọc</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleMarkAllNotificationsAsRead}
                              className="text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                              <span className="sm:hidden">Đọc tất cả</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                          Không có thông báo chưa đọc
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="read" className="mt-4 sm:mt-6">
                      {isLoadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.filter(n => n.is_read).length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {notifications
                            .filter(n => n.is_read)
                            .map((notification) => (
                              <div
                                key={`notification-${notification.notification_id}`}
                                className="p-3 sm:p-4 border rounded-lg"
                              >
                                <div className="flex items-start gap-3 sm:gap-4">
                                  <div className="w-2 h-2 mt-2 rounded-full bg-muted flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                                        getNotificationTypeBadge(notification.type || "info")
                                      }`}>
                                        {(notification.type || "info").toUpperCase()}
                                      </span>
                                      <p className="font-medium text-muted-foreground text-sm sm:text-base truncate">{notification.title}</p>
                                    </div>
                                    <p className="text-muted-foreground text-xs sm:text-sm">{notification.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(notification.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
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
        <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Chỉnh sửa tài liệu</DialogTitle>
          </DialogHeader>
          {isLoadingDocument ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Tiêu đề</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Mô tả</Label>
                <Textarea
                  id="description"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full min-h-[100px]"
                />
              </div>
              {authUser?.role === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: "approved" | "pending" | "rejected") =>
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger className="w-full">
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
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
              Hủy
            </Button>
            <Button onClick={handleUpdateDocument} disabled={isLoadingDocument} className="w-full sm:w-auto order-1 sm:order-2">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} disabled={isLoadingDocument} className="w-full sm:w-auto order-1 sm:order-2">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteForumPostDialogOpen} onOpenChange={setIsDeleteForumPostDialogOpen}>
        <AlertDialogContent className="max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteForumPost} disabled={isLoadingForumPosts} className="w-full sm:w-auto order-1 sm:order-2">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

