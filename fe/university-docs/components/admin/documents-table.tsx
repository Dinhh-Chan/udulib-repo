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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
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
import { DocumentDetailDialog } from "./document-detail-dialog"
import { Document, getDocuments, deleteDocument } from "@/lib/api/documents"

export function DocumentsTable() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null)
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const data = await getDocuments()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteDocument(id)
      if (success) {
        setDeletingDocument(null)
        fetchDocuments()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
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
            <TableHead>Người tải lên</TableHead>
            <TableHead>Loại file</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.document_id}>
                <TableCell className="font-medium">{document.title}</TableCell>
                <TableCell>{document.subject?.subject_name || "N/A"}</TableCell>
                <TableCell>{document.user?.username || "N/A"}</TableCell>
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
                      <DropdownMenuItem onClick={() => setViewingDocument(document)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Xem chi tiết</span>
                      </DropdownMenuItem>
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

      {/* Dialog xem chi tiết */}
      {viewingDocument && (
        <DocumentDetailDialog
          document={viewingDocument}
          open={!!viewingDocument}
          onOpenChange={(open) => !open && setViewingDocument(null)}
          onEdit={(doc) => {
            setViewingDocument(null)
            setEditingDocument(doc)
          }}
          onDelete={fetchDocuments}
        />
      )}
    </div>
  )
}
