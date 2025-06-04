"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Subject {
  subject_id: number
  subject_name: string
  subject_code: string
  description: string
  major_id: number
  year_id: number
  created_at: string
  updated_at: string
}

interface User {
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

interface Document {
  document_id: number
  title: string
  description: string
  file_path: string
  file_size: number
  file_type: string
  subject_id: number
  user_id: number
  status: string
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
  subject: Subject
  user: User
  tags: string[]
  average_rating: number
}

interface DocumentsResponse {
  documents: Document[]
  total: number
  page: number
  per_page: number
}

interface DocumentsTableProps {
  page?: number
  search?: string
}

export function DocumentsTable({ page = 1, search = "" }: DocumentsTableProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<DocumentsResponse>(`/documents?page=${page}&search=${search}`)
        console.log("Documents response:", response) // Debug log
        setDocuments(response.documents || [])
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Không thể tải danh sách tài liệu")
        setDocuments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [page, search])

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/documents/${id}`)
      setDocuments(documents.filter((doc) => doc.document_id !== id))
      toast.success("Xóa tài liệu thành công")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
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
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Danh sách tài liệu</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={search}
            onChange={(e) => {
              const searchParams = new URLSearchParams(window.location.search)
              searchParams.set("search", e.target.value)
              router.push(`?${searchParams.toString()}`)
            }}
            className="w-[300px]"
          />
          <Button
            onClick={() => router.push("/admin/documents/new")}
          >
            Thêm tài liệu
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead>Người đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
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
              documents.map((doc) => (
                <TableRow key={doc.document_id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.subject?.subject_name || "N/A"}</TableCell>
                  <TableCell>{doc.user?.full_name || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/admin/documents/${doc.document_id}`)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(doc.document_id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
