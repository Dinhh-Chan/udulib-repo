"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createNotificationForUser, createNotificationForAllUsers, type NotificationType } from "@/lib/api/notification"
import { getUsers, type User } from "@/lib/api/user"
import { Plus, Search, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddNotificationDialogProps {
  onSuccess?: () => void
}

export function AddNotificationDialog({ onSuccess }: AddNotificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<NotificationType>("info")
  const [userId, setUserId] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSendToAll, setSendToAll] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const data = await getUsers({ search: searchQuery })
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Không thể tải danh sách người dùng")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open, searchQuery])

  const handleUserSelect = (user: User) => {
    setSelectedUserId(user.user_id)
    setUserId(user.user_id.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề thông báo")
      return
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung thông báo")
      return
    }
    
    if (!isSendToAll && !selectedUserId) {
      toast.error("Vui lòng chọn người dùng hoặc chọn gửi cho tất cả")
      return
    }

    try {
      setIsLoading(true)
      
      if (isSendToAll) {
        // Gửi thông báo cho tất cả người dùng
        await createNotificationForAllUsers({
          title,
          content,
          type
        })
        toast.success("Đã gửi thông báo cho tất cả người dùng")
        setOpen(false)
        onSuccess?.()
        resetForm()
      } else {
        // Gửi cho người dùng cụ thể
        await createNotificationForUser({
          title,
          content,
          type,
          target_user_id: Number(userId)
        })
        toast.success("Đã gửi thông báo thành công")
        setOpen(false)
        onSuccess?.()
        resetForm()
      }
    } catch (error) {
      console.error("Error creating notification:", error)
      toast.error("Không thể gửi thông báo")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setType("info")
    setUserId("")
    setSelectedUserId(null)
    setSendToAll(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Gửi thông báo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Gửi thông báo mới</DialogTitle>
            <DialogDescription>
              Gửi thông báo đến người dùng cụ thể hoặc tất cả người dùng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sendToAll" 
                checked={isSendToAll}
                onCheckedChange={(checked) => {
                  setSendToAll(checked === true)
                  if (checked) {
                    setSelectedUserId(null)
                    setUserId("")
                  }
                }}
              />
              <label 
                htmlFor="sendToAll" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Gửi cho tất cả người dùng
              </label>
            </div>

            {!isSendToAll && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>Chọn người dùng</label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={fetchUsers}
                      disabled={isLoadingUsers}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                  
                  <ScrollArea className="h-[200px] border rounded-md">
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Đang tải...</span>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">Không tìm thấy người dùng</span>
                      </div>
                    ) : (
                      <div className="p-1">
                        {users.map((user) => (
                          <div 
                            key={user.user_id}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${selectedUserId === user.user_id ? 'bg-muted' : ''}`}
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{user.full_name}</span>
                              <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                            <div>
                              <Badge variant="outline">{user.role}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  
                  {selectedUserId && (
                    <div className="text-sm text-muted-foreground">
                      Đã chọn ID người dùng: {selectedUserId}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="type">Loại thông báo</label>
              <Select
                value={type}
                onValueChange={(value: NotificationType) => setType(value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Thông tin</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="error">Lỗi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="title">Tiêu đề</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề thông báo"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content">Nội dung</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung thông báo"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 