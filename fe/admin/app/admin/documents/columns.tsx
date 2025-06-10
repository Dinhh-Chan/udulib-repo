"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ViewDocumentDialog } from "@/components/admin/view-document-dialog"
import { EditDocumentDialog } from "@/components/admin/edit-document-dialog"
import { Document, deleteDocument } from "@/lib/api/documents"

export interface Subject {
  subject_id: number
  subject_name: string
  subject_code: string
  description: string
  major_id: number
  year_id: number
  created_at: string
  updated_at: string
}

export interface User {
  user_id: number
  username: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string | null
  updated_at: string
  last_login: string
}

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "subject",
    header: "Môn học",
    cell: ({ row }) => {
      const subject = row.original.subject
      return subject ? subject.subject_name : "N/A"
    },
  },
  {
    accessorKey: "user",
    header: "Người đăng",
    cell: ({ row }) => {
      const user = row.original.user
      return user ? user.username : "N/A"
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
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
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString("vi-VN")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original
      const router = useRouter()
      const [viewDialogOpen, setViewDialogOpen] = useState(false)
      const [editDialogOpen, setEditDialogOpen] = useState(false)

      const handleDelete = async () => {
        if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
          try {
            const success = await deleteDocument(document.document_id)
            if (success) {
              toast.success("Xóa tài liệu thành công")
              // Reload trang để cập nhật dữ liệu
              window.location.reload()
            }
          } catch (error) {
            console.error("Lỗi khi xóa tài liệu:", error)
            toast.error("Không thể xóa tài liệu")
          }
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete()}>
                <Trash className="mr-2 h-4 w-4" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ViewDocumentDialog 
            documentId={document.document_id} 
            open={viewDialogOpen} 
            onOpenChange={setViewDialogOpen} 
          />
          
          <EditDocumentDialog 
            documentId={document.document_id}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={() => {
              setEditDialogOpen(false)
              window.location.reload()
            }}
          />
        </>
      )
    },
  },
] 