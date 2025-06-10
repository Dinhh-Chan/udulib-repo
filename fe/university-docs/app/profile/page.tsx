"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, User, Settings, FileText, MessageSquare, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUserProfile, getUserAvatar } from "@/lib/api/user"
import { User as UserType } from "@/types/user"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Loading from "@/app/loading"
import { getDocumentDetail, updateDocument, deleteDocument, DocumentUpdateData } from "@/lib/api/documents"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteForumPost } from "@/lib/api/forum"
import { motion, AnimatePresence } from "framer-motion"

// Import các tab components
import ProfileTab from "@/components/profile/ProfileTab"
import DocumentsTab from "@/components/profile/DocumentsTab"
import ForumTab from "@/components/profile/ForumTab"
import NotificationsTab from "@/components/profile/NotificationsTab"
import SettingsTab from "@/components/profile/SettingsTab"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { user: authUser, isAuthenticated } = useAuth()
  
  // Dialog states
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
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
  const [forumPostToDelete, setForumPostToDelete] = useState<number | null>(null)
  const [isDeleteForumPostDialogOpen, setIsDeleteForumPostDialogOpen] = useState(false)

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
          
          // Load avatar
          try {
            const avatar = await getUserAvatar()
            setAvatarUrl(avatar)
          } catch (error) {
            // Không hiển thị lỗi nếu user chưa có avatar
            console.log("User chưa có avatar")
          }
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

  // Event listeners for child components
  useEffect(() => {
    const handleEditDocument = async (event: any) => {
      const { documentId } = event.detail
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

    const handleDeleteDocument = (event: any) => {
      const { documentId } = event.detail
      setDocumentToDelete(documentId)
      setIsDeleteDialogOpen(true)
    }

    const handleDeleteForumPost = (event: any) => {
      const { postId } = event.detail
      setForumPostToDelete(postId)
      setIsDeleteForumPostDialogOpen(true)
    }

    window.addEventListener('editDocument', handleEditDocument)
    window.addEventListener('deleteDocument', handleDeleteDocument)
    window.addEventListener('deleteForumPost', handleDeleteForumPost)

    return () => {
      window.removeEventListener('editDocument', handleEditDocument)
      window.removeEventListener('deleteDocument', handleDeleteDocument)
      window.removeEventListener('deleteForumPost', handleDeleteForumPost)
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Cập nhật URL mà không reload trang
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.pushState({}, '', url)
  }

  const handleUpdateDocument = async () => {
    if (!selectedDocument) return

    try {
      setIsLoadingDocument(true)
      await updateDocument(selectedDocument.document_id, editForm)
      toast.success("Cập nhật tài liệu thành công")
      setIsEditDialogOpen(false)
      // Trigger refresh in child component
      window.dispatchEvent(new CustomEvent('refreshDocuments'))
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Không thể cập nhật tài liệu")
    } finally {
      setIsLoadingDocument(false)
    }
  }

  const handleDeleteDocumentConfirm = async () => {
    if (!documentToDelete) return

    try {
      setIsLoadingDocument(true)
      await deleteDocument(documentToDelete)
      toast.success("Xóa tài liệu thành công")
      setIsDeleteDialogOpen(false)
      // Trigger refresh in child component
      window.dispatchEvent(new CustomEvent('refreshDocuments'))
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
    } finally {
      setIsLoadingDocument(false)
      setDocumentToDelete(null)
    }
  }

  const handleDeleteForumPostConfirm = async () => {
    if (!forumPostToDelete) return

    try {
      await deleteForumPost(forumPostToDelete)
      toast.success("Xóa bài viết thành công")
      setIsDeleteForumPostDialogOpen(false)
      // Trigger refresh in child component
      window.dispatchEvent(new CustomEvent('refreshForumPosts'))
    } catch (error) {
      console.error("Error deleting forum post:", error)
      toast.error("Không thể xóa bài viết")
    } finally {
      setForumPostToDelete(null)
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
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user && !isLoading && isAuthenticated) {
    return (
      <Loading />
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
                  <AvatarImage 
                    src={avatarUrl || undefined} 
                    alt={user.full_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm sm:text-base">
                    {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-base sm:text-lg truncate w-full">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.role === "admin" ? "Quản trị viên" : user.role === "student" ? "Sinh viên" : "Giảng viên"}</p>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && user && (
                  <ProfileTab 
                    user={user} 
                    onUserUpdate={(updatedUser) => {
                      setUser(updatedUser)
                      getUserAvatar().then(setAvatarUrl).catch(() => console.log("No avatar"))
                    }} 
                  />
                )}

                {activeTab === "documents" && authUser?.user_id && (
                  <DocumentsTab userId={authUser.user_id} />
                )}

                {activeTab === "forum" && authUser?.user_id && (
                  <ForumTab userId={authUser.user_id} />
                )}

                {activeTab === "notifications" && (
                  <NotificationsTab />
                )}

                {activeTab === "settings" && (
                  <SettingsTab />
                )}
              </motion.div>
            </AnimatePresence>
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
                <label htmlFor="title" className="text-sm font-medium">Tiêu đề</label>
                <input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Mô tả</label>
                <Textarea
                  id="description"
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full min-h-[100px]"
                />
              </div>
              {authUser?.role === "admin" && (
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Trạng thái</label>
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
            <AlertDialogAction onClick={handleDeleteDocumentConfirm} disabled={isLoadingDocument} className="w-full sm:w-auto order-1 sm:order-2">
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
            <AlertDialogAction onClick={handleDeleteForumPostConfirm} className="w-full sm:w-auto order-1 sm:order-2">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

