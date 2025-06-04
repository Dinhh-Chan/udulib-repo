"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/client"
import { Document } from "@/app/admin/documents/columns"
import { Download, Eye } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

interface ViewDocumentDialogProps {
  documentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewDocumentDialog({ documentId, open, onOpenChange }: ViewDocumentDialogProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open && documentId) {
      fetchDocument()
    }
  }, [open, documentId])

  const fetchDocument = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<Document>(`/documents/${documentId}`)
      setDocument(response)
    } catch (error) {
      console.error("Error fetching document:", error)
      toast.error("Không thể tải thông tin tài liệu")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Đã duyệt</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Từ chối</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đang tải...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!document) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lỗi</DialogTitle>
            <DialogDescription>
              Không thể tải thông tin tài liệu
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{document.title}</DialogTitle>
            {getStatusBadge(document.status)}
          </div>
          <DialogDescription>
            {document.description || "Không có mô tả"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Thông tin chung</h3>
              <div className="mt-2 border rounded-lg divide-y">
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Môn học</span>
                  <span className="text-sm text-gray-700">{document.subject?.subject_name || "N/A"}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Người đăng</span>
                  <span className="text-sm text-gray-700">{document.user?.full_name || "N/A"}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Ngày tạo</span>
                  <span className="text-sm text-gray-700">{new Date(document.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Ngày cập nhật</span>
                  <span className="text-sm text-gray-700">
                    {document.updated_at ? new Date(document.updated_at).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Thông tin tệp</h3>
              <div className="mt-2 border rounded-lg divide-y">
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Định dạng</span>
                  <span className="text-sm text-gray-700">{document.file_type}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Kích thước</span>
                  <span className="text-sm text-gray-700">{formatFileSize(document.file_size)}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Lượt xem</span>
                  <span className="text-sm text-gray-700">{document.view_count}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-sm font-medium">Lượt tải</span>
                  <span className="text-sm text-gray-700">{document.download_count}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {document.tags && document.tags.length > 0 ? (
                document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {typeof tag === "string" ? tag : tag.tag_name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Không có thẻ</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.open(document.file_path, "_blank")}>
            <Eye className="mr-2 h-4 w-4" />
            Xem
          </Button>
          <Button onClick={() => window.open(document.file_path, "_blank")}>
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 