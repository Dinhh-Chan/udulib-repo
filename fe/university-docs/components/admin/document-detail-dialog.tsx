"use client"

import { Document } from "@/lib/api/documents"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatFileSize } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteDocument } from "@/lib/api/documents"
import { toast } from "sonner"

interface DocumentDetailDialogProps {
  document: Document
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (document: Document) => void
  onDelete?: () => void
}

export function DocumentDetailDialog({ document, open, onOpenChange, onEdit, onDelete }: DocumentDetailDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const success = await deleteDocument(document.document_id)
      if (success) {
        toast.success("Xóa tài liệu thành công")
        onOpenChange(false)
        onDelete?.()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{document.title}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về tài liệu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Mô tả:</span>
                    <p className="mt-1">{document.description || "Không có mô tả"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Môn học:</span>
                    <p className="mt-1">{document.subject?.subject_name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Người tải lên:</span>
                    <p className="mt-1">{document.user?.username || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Thông tin file</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground">Loại file:</span>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={
                          document.file_type.toLowerCase().includes("pdf")
                            ? "bg-red-50 text-red-700 border-red-200"
                            : document.file_type.toLowerCase().includes("doc")
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : document.file_type.toLowerCase().includes("xls")
                            ? "bg-green-50 text-green-700 border-green-200"
                            : document.file_type.toLowerCase().includes("ppt")
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : document.file_type.toLowerCase().includes("txt")
                            ? "bg-gray-50 text-gray-700 border-gray-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }
                      >
                        {document.file_type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kích thước:</span>
                    <p className="mt-1">{formatFileSize(document.file_size)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Đường dẫn:</span>
                    <p className="mt-1 break-all">{document.file_path}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Thống kê</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <span className="text-muted-foreground">Lượt xem:</span>
                  <p className="mt-1">{document.view_count}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lượt tải:</span>
                  <p className="mt-1">{document.download_count}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Đánh giá:</span>
                  <p className="mt-1">{document.average_rating.toFixed(1)}/5.0</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={
                        document.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : document.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {document.status === "approved"
                        ? "Đã duyệt"
                        : document.status === "pending"
                        ? "Chờ duyệt"
                        : "Từ chối"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            {document.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag.tag_id} variant="secondary">
                      {tag.tag_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Thời gian</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <p className="mt-1">{new Date(document.created_at).toLocaleString("vi-VN")}</p>
                </div>
                {document.updated_at && (
                  <div>
                    <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                    <p className="mt-1">{new Date(document.updated_at).toLocaleString("vi-VN")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => onEdit?.(document)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleting(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{document.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 