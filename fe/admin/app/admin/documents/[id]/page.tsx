"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api/client"
import { Document } from "@/app/admin/documents/columns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Eye, Trash } from "lucide-react"
import { toast } from "sonner"
import { formatFileSize } from "@/lib/utils"

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<Document>(`/documents/${params.id}`)
        setDocument(response)
      } catch (error) {
        console.error("Error fetching document:", error)
        toast.error("Không thể tải thông tin tài liệu")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [params.id])

  const handleDelete = async () => {
    if (!document) return
    
    if (confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      try {
        await apiClient.delete(`/documents/${document.document_id}`)
        toast.success("Xóa tài liệu thành công")
        router.push("/admin/documents")
      } catch (error) {
        console.error("Error deleting document:", error)
        toast.error("Không thể xóa tài liệu")
      }
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
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy tài liệu</h1>
        <Button onClick={() => router.push("/admin/documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/admin/documents/${document.document_id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{document.title}</CardTitle>
              <CardDescription>
                {document.description || "Không có mô tả"}
              </CardDescription>
            </div>
            {getStatusBadge(document.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {document.tags && document.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {typeof tag === "string" ? tag : tag.tag_name}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">Không có thẻ</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.open(document.file_path, "_blank")}>
              <Eye className="mr-2 h-4 w-4" />
              Xem
            </Button>
            <Button onClick={() => window.open(document.file_path, "_blank")}>
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 