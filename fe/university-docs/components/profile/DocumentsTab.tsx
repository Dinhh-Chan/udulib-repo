import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getUserDocuments, Document, deleteDocument } from "@/lib/api/documents"
import { getViewedDocuments, getDownloadedDocuments, DocumentHistory } from "@/lib/api/document-history"
import { toast } from "sonner"
import EditDocumentModal from "./EditDocumentModal"

interface DocumentsTabProps {
  userId: number
}

export default function DocumentsTab({ userId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [viewedDocuments, setViewedDocuments] = useState<DocumentHistory[]>([])
  const [downloadedDocuments, setDownloadedDocuments] = useState<DocumentHistory[]>([])
  
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [isLoadingViewedDocuments, setIsLoadingViewedDocuments] = useState(false)
  const [isLoadingDownloadedDocuments, setIsLoadingDownloadedDocuments] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewedCurrentPage, setViewedCurrentPage] = useState(1)
  const [viewedTotalPages, setViewedTotalPages] = useState(1)
  const [downloadedCurrentPage, setDownloadedCurrentPage] = useState(1)
  const [downloadedTotalPages, setDownloadedTotalPages] = useState(1)

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null)

  const fetchUserDocuments = async () => {
    setIsLoadingDocuments(true)
    try {
      const response = await getUserDocuments(userId, currentPage)
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

  const fetchViewedDocuments = async () => {
    setIsLoadingViewedDocuments(true)
    try {
      const response = await getViewedDocuments(userId, viewedCurrentPage, 5)
      setViewedDocuments(response?.items || [])
      setViewedTotalPages(response?.pages || 1)
    } catch (error) {
      console.error("Error fetching viewed documents:", error)
      toast.error("Không thể tải danh sách tài liệu đã xem")
      setViewedDocuments([])
    } finally {
      setIsLoadingViewedDocuments(false)
    }
  }

  const fetchDownloadedDocuments = async () => {
    setIsLoadingDownloadedDocuments(true)
    try {
      const response = await getDownloadedDocuments(userId, downloadedCurrentPage, 5)
      setDownloadedDocuments(response?.items || [])
      setDownloadedTotalPages(response?.pages || 1)
    } catch (error) {
      console.error("Error fetching downloaded documents:", error)
      toast.error("Không thể tải danh sách tài liệu đã tải")
      setDownloadedDocuments([])
    } finally {
      setIsLoadingDownloadedDocuments(false)
    }
  }

  useEffect(() => {
    fetchUserDocuments()
  }, [userId, currentPage])

  useEffect(() => {
    fetchViewedDocuments()
  }, [userId, viewedCurrentPage])

  useEffect(() => {
    fetchDownloadedDocuments()
  }, [userId, downloadedCurrentPage])

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      return
    }
    
    try {
      await deleteDocument(documentId)
      toast.success("Xóa tài liệu thành công")
      fetchUserDocuments() // Refresh the list
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Không thể xóa tài liệu")
    }
  }

  const handleEditDocument = (documentId: number) => {
    setEditingDocumentId(documentId)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchUserDocuments() // Refresh the list
    setEditModalOpen(false)
    setEditingDocumentId(null)
  }

  return (
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
                        <Button variant="outline" size="sm" onClick={() => handleEditDocument(doc.document_id)} className="text-xs sm:text-sm">
                          Chỉnh sửa
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteDocument(doc.document_id)}
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
      
      {/* Edit Document Modal */}
      <EditDocumentModal
        documentId={editingDocumentId}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditingDocumentId(null)
        }}
        onSuccess={handleEditSuccess}
      />
    </Card>
  )
} 