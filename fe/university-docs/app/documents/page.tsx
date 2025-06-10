"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { FilterSidebar } from "./components/FilterSidebar"
import { DocumentThumbnail } from "@/components/ui/document-thumbnail"
import Loading from "../loading"

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
  const [listLoading, setListLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 15 // Số tài liệu mỗi trang theo API
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filters, setFilters] = useState<{
    search?: string
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
      setListLoading(true)
      setError(null)
      const params = new URLSearchParams()
      
      // Thêm các tham số tìm kiếm và lọc
      if (debouncedSearch) params.append("search", debouncedSearch)
      if (filters.year_id) params.append("year_id", filters.year_id.toString())
      if (filters.file_type) params.append("file_type", filters.file_type)
      if (filters.subject_id) params.append("subject_id", filters.subject_id.toString())
      
      // Sử dụng page và per_page thay vì skip và limit
      params.append("page", currentPage.toString())
      params.append("per_page", ITEMS_PER_PAGE.toString())
      
      // Sử dụng API public để lấy tài liệu đã phê duyệt
      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/documents/public?${params.toString()}`
      
      // Nếu có filter theo year_id, sử dụng API academic-year
      if (filters.year_id && !filters.file_type && !filters.subject_id && !debouncedSearch) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/documents/academic-year/${filters.year_id}?page=${currentPage}&per_page=${ITEMS_PER_PAGE}`
      }
      
      const response = await fetch(apiUrl)
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
      setListLoading(false)
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

        <div className="flex gap-8">
          <div className="hidden md:block">
            <FilterSidebar onFilter={setFilters} />
          </div>
          
          <div className="flex-1">
            {listLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {documents.map((doc) => (
                  <Link 
                    key={doc.document_id} 
                    href={`/documents/${doc.document_id}`}
                  >
                    <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-80">
                      {/* Thumbnail Section - Thu nhỏ lại */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        <DocumentThumbnail
                          documentId={doc.document_id}
                          title={doc.title}
                          fileType={doc.file_type}
                          size="large"
                          className="w-full h-full !w-full !h-full"
                        />
                        
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges ở góc trên */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
                            {doc.file_type?.split('/')[1]?.toUpperCase() || doc.file_type?.toUpperCase() || 'UNKNOWN'}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
                            {formatFileSize(doc.file_size)}
                          </span>
                        </div>
                        
                        {/* Subject badge ở góc trái */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 dark:bg-gray-900/90 dark:text-white backdrop-blur-sm">
                            {doc.subject.subject_name.slice(0, 15)}...
                          </span>
                        </div>
                      </div>
                      
                      {/* Content Section - Mở rộng thêm */}
                      <div className="p-4 h-40 flex flex-col">
                        {/* Title */}
                        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
                          {doc.title}
                        </h3>
                        
                        {/* Description - có thể hiển thị nhiều hơn */}
                        <div className="flex-1 mb-2">
                          <p className="text-sm text-muted-foreground line-clamp-3 overflow-hidden" 
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 3,
                               WebkitBoxOrient: 'vertical',
                               textOverflow: 'ellipsis'
                             }}>
                            {doc.description}
                          </p>
                        </div>
                        
                        {/* Tags - giới hạn trong 1 dòng */}
                        <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
                          {doc.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag.tag_id}
                              className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full font-medium"
                            >
                              {tag.tag_name}
                            </span>
                          ))}
                          {doc.tags && doc.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground self-center">+{doc.tags.length - 2}</span>
                          )}
                        </div>
                        
                        {/* Stats footer - luôn ở dưới cùng */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{doc.view_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{doc.download_count}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground/70 truncate max-w-[100px]">
                            {doc.user.full_name}
                          </div>
                        </div>
                      </div>
                      

                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}