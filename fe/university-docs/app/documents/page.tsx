"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Download, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { FilterSidebar } from "./components/FilterSidebar"

interface Document {
  document_id: number
  title: string
  description: string
  file_type: string
  file_size: number
  file_path: string
  view_count: number
  download_count: number
  average_rating: number
  tags: Array<{
    tag_id: number
    tag_name: string
  }>
  subject: {
    subject_name: string
    subject_code: string
  }
  user: {
    full_name: string
    username: string
  }
}

interface ApiResponse {
  documents: Document[]
  total: number
  page: number
  per_page: number
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 20 // Số tài liệu mỗi trang theo API
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filters, setFilters] = useState<{
    search?: string
    major_id?: number
    year_id?: number
    file_type?: string
    subject_id?: number
  }>({})

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // Delay 500ms

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      // Thêm các tham số tìm kiếm và lọc
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (filters.major_id) params.append("major_id", filters.major_id.toString())
      if (filters.year_id) params.append("year_id", filters.year_id.toString())
      if (filters.file_type) params.append("file_type", filters.file_type)
      if (filters.subject_id) params.append("subject_id", filters.subject_id.toString())
      
      // Tính toán skip dựa trên trang hiện tại
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      params.append("skip", skip.toString())
      params.append("limit", ITEMS_PER_PAGE.toString())
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      setDocuments(data.documents || [])
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE))
    } catch (err) {
      console.error("Error fetching documents:", err)
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [debouncedSearch, filters, currentPage])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = bytes / Math.pow(k, i)
    return `${size.toFixed(1)} ${sizes[i]}`
  }

  const handleView = async (documentId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/view`, {
        method: 'POST',
        credentials: 'include'
      })
      // Cập nhật lại danh sách tài liệu sau khi ghi nhận lượt xem
      fetchDocuments()
    } catch (err) {
      console.error("Error recording view:", err)
    }
  }

  const handleDownload = async (documentId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/download`, {
        method: 'POST',
        credentials: 'include'
      })
      // Cập nhật lại danh sách tài liệu sau khi ghi nhận lượt tải
      fetchDocuments()
    } catch (err) {
      console.error("Error recording download:", err)
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Tổng hợp tài liệu</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:hidden">
              <FilterSidebar onFilter={setFilters} />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden md:block">
            <FilterSidebar onFilter={setFilters} />
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy tài liệu nào
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <Card key={doc.document_id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                          <div>
                            <h3 className="font-medium line-clamp-2">
                              <Link 
                                href={`/documents/${doc.document_id}`}
                                className="hover:underline"
                                onClick={() => handleView(doc.document_id)}
                              >
                                {doc.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {doc.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {doc.tags?.map((tag) => (
                              <span
                                key={tag.tag_id}
                                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                              >
                                {tag.tag_name}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{doc.file_type?.split('/')[1]?.toUpperCase() || doc.file_type?.toUpperCase() || 'UNKNOWN'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>{formatFileSize(doc.file_size)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{doc.view_count}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span>{doc.download_count}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>Đăng bởi: {doc.user.full_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Môn: {doc.subject.subject_code}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Phân trang */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Hiển thị tối đa 5 nút trang
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          // Nếu có nhiều hơn 5 trang, hiển thị các trang xung quanh trang hiện tại
                          if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
