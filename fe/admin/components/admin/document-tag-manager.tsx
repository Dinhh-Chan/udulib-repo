"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Tag, Plus } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { getDocumentsByTag, removeDocumentTag, DocumentListResponse } from "@/lib/api/document-tag"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTags } from "@/lib/api/tag"
import Link from "next/link"
import { CustomPagination } from "@/components/ui/pagination"

export function DocumentTagManager() {
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isTagsLoading, setIsTagsLoading] = useState(true)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [perPage, setPerPage] = useState(10)
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortDesc, setSortDesc] = useState(true)

  // Fetch all tags first
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsTagsLoading(true)
        const tagsData = await getTags()
        if (Array.isArray(tagsData)) {
          const tagNames = tagsData.map(tag => tag.tag_name)
          setTags(tagNames)
          if (tagNames.length > 0 && !selectedTag) {
            setSelectedTag(tagNames[0])
          }
        }
      } catch (error) {
        console.error("Error fetching tags:", error)
        showErrorToast("Không thể tải danh sách tag")
      } finally {
        setIsTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Fetch documents by selected tag
  useEffect(() => {
    if (selectedTag) {
      fetchDocumentsByTag()
    } else {
      setDocuments([])
      setFilteredDocuments([])
    }
  }, [selectedTag, currentPage, perPage, sortBy, sortDesc])

  // Filter documents based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = documents.filter(
        doc => 
          doc.title.toLowerCase().includes(query) || 
          doc.description?.toLowerCase().includes(query)
      )
      setFilteredDocuments(filtered)
    }
  }, [searchQuery, documents])

  const fetchDocumentsByTag = async () => {
    if (!selectedTag) return;
    
    try {
      setIsLoading(true)
      const data: DocumentListResponse = await getDocumentsByTag(selectedTag, {
        page: currentPage,
        per_page: perPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      
      if (data && data.documents) {
        setDocuments(data.documents)
        setFilteredDocuments(data.documents)
        // Tính total_pages nếu API không trả về
        const calculatedTotalPages = data.total_pages || Math.ceil(data.total / data.per_page)
        setTotalPages(calculatedTotalPages)
        setTotalItems(data.total)

        // Log để debug
        console.log("API response:", data)
        console.log("Documents loaded:", data.documents.length)
      } else {
        console.log("Empty or invalid response:", data)
        setDocuments([])
        setFilteredDocuments([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      console.error(`Error fetching documents for tag ${selectedTag}:`, error)
      showErrorToast(`Không thể tải danh sách tài liệu cho tag "${selectedTag}"`)
      setDocuments([])
      setFilteredDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveTag = async (documentId: number) => {
    if (!selectedTag) return
    
    if (confirm(`Bạn có chắc chắn muốn xóa tag "${selectedTag}" khỏi tài liệu này không?`)) {
      try {
        await removeDocumentTag(documentId, selectedTag)
        showSuccessToast(`Đã xóa tag "${selectedTag}" khỏi tài liệu thành công`)
        // Reload documents with this tag
        fetchDocumentsByTag()
      } catch (error) {
        console.error("Error removing tag from document:", error)
        showErrorToast("Không thể xóa tag khỏi tài liệu")
      }
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleSortChange = (value: string) => {
    // Format: field_direction (e.g., "created_at_desc")
    const [field, direction] = value.split('_');
    
    // Sửa lỗi trường
    let correctedField = field;
    if (field === 'created') {
      correctedField = 'created_at';
    } else if (field === 'view') {
      correctedField = 'view_count';
    } else if (field === 'download') {
      correctedField = 'download_count';
    }
    
    setSortBy(correctedField);
    setSortDesc(direction === 'desc');
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quản lý tài liệu theo tag</CardTitle>
        <CardDescription>
          Xem và quản lý các tài liệu theo tag
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="w-full md:w-64">
            <Select 
              value={selectedTag} 
              onValueChange={setSelectedTag}
              disabled={isTagsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tag..." />
              </SelectTrigger>
              <SelectContent>
                {tags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <Select 
              defaultValue="created_at_desc" 
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at_desc">Mới nhất</SelectItem>
                <SelectItem value="created_at_asc">Cũ nhất</SelectItem>
                <SelectItem value="title_asc">Tên A-Z</SelectItem>
                <SelectItem value="title_desc">Tên Z-A</SelectItem>
                <SelectItem value="view_count_desc">Lượt xem (cao-thấp)</SelectItem>
                <SelectItem value="download_count_desc">Lượt tải (cao-thấp)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : selectedTag ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        {searchQuery 
                          ? `Không tìm thấy tài liệu phù hợp với tag "${selectedTag}"` 
                          : `Không có tài liệu nào với tag "${selectedTag}"`}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.document_id}>
                        <TableCell>{doc.document_id}</TableCell>
                        <TableCell>
                          <Link 
                            href={`/admin/documents/${doc.document_id}`} 
                            className="font-medium hover:underline"
                          >
                            {doc.title}
                          </Link>
                          <div className="text-xs text-muted-foreground mt-1">
                            {doc.description?.substring(0, 50)}
                            {doc.description?.length > 50 ? "..." : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={doc.status === "approved" ? "default" : 
                                    doc.status === "rejected" ? "destructive" : "secondary"}
                          >
                            {doc.status === "approved" ? "Đã duyệt" : 
                             doc.status === "rejected" ? "Đã từ chối" : "Chờ duyệt"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRemoveTag(doc.document_id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Gỡ tag
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
            
            {totalItems > 0 && (
              <div className="text-sm text-muted-foreground text-center mt-2">
                Hiển thị {filteredDocuments.length} trên tổng số {totalItems} tài liệu
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isTagsLoading ? "Đang tải danh sách tag..." : "Vui lòng chọn một tag để xem tài liệu"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}