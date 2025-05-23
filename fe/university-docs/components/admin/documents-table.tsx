"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
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
import { EditDocumentDialog } from "./edit-document-dialog"

interface Document {
  document_id: number
  title: string
  description: string | null
  file_path: string
  file_size: number
  file_type: string
  subject_id: number
  user_id: number
  status: "approved" | "pending" | "rejected"
  view_count: number
  download_count: number
  created_at: string
  updated_at: string | null
  subject: {
    subject_id: number
    subject_name: string
  } | null
  user: {
    user_id: number
    username: string
  } | null
  tags: Array<{
    tag_id: number
    tag_name: string
  }>
  average_rating: number
}

export function DocumentsTable() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null)

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`)
      if (!response.ok) {
        throw new Error("Không thể tải danh sách tài liệu")
      }
      const data = await response.json()
      // Đảm bảo data là một mảng
      setDocuments(Array.isArray(data.documents) ? data.documents : [])
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Không thể tải danh sách tài liệu")
      setDocuments([]) // Set mảng rỗng nếu có lỗi
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa tài liệu")
      }

      toast.success("Xóa tài liệu thành công")
      setDeletingDocument(null)
      fetchDocuments()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
    }
  }

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên tài liệu</TableHead>
            <TableHead>Môn học</TableHead>
            <TableHead>Loại file</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.document_id}>
                <TableCell className="font-medium">{document.title}</TableCell>
                <TableCell>{document.subject?.subject_name || "N/A"}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingDocument(document)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingDocument(document)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={!!deletingDocument} onOpenChange={(open) => !open && setDeletingDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{deletingDocument?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDocument && handleDelete(deletingDocument.document_id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog chỉnh sửa */}
      {editingDocument && (
        <EditDocumentDialog
          document={editingDocument}
          open={!!editingDocument}
          onOpenChange={(open) => !open && setEditingDocument(null)}
          onSuccess={fetchDocuments}
        />
      )}
    </div>
  )
}
