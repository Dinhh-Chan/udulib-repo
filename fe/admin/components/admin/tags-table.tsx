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
import { Search, Pencil, Trash } from "lucide-react"
import { EditTagDialog } from "@/components/admin/edit-tag-dialog"
import { showSuccessToast, showErrorToast } from "@/lib/utils"
import { getTags, deleteTag } from "@/lib/api/tag"
import { Card } from "@/components/ui/card"

interface TagsTableProps {
  onReload?: () => void
}

export function TagsTable({ onReload }: TagsTableProps) {
  const [tags, setTags] = useState<any[]>([])
  const [filteredTags, setFilteredTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<any>(null)

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(tags)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = tags.filter(
        tag => tag.tag_name.toLowerCase().includes(query)
      )
      setFilteredTags(filtered)
    }
  }, [searchQuery, tags])

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const data = await getTags()
      if (Array.isArray(data)) {
        setTags(data)
        setFilteredTags(data)
      } else {
        console.error("Unexpected response format:", data)
        setTags([])
        setFilteredTags([])
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
      showErrorToast("Không thể tải danh sách tag")
      setTags([])
      setFilteredTags([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTag = (tag: any) => {
    setSelectedTag(tag)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTag = async (tagId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tag này không?")) {
      try {
        await deleteTag(tagId)
        showSuccessToast("Xóa tag thành công")
        fetchTags()
        if (onReload) onReload()
      } catch (error) {
        console.error("Error deleting tag:", error)
        showErrorToast("Không thể xóa tag")
      }
    }
  }

  const handleEditSuccess = () => {
    fetchTags()
    if (onReload) onReload()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Tên Tag</TableHead>
                <TableHead className="w-[180px]">Số tài liệu</TableHead>
                <TableHead className="text-right w-[120px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    {searchQuery ? "Không tìm thấy tag phù hợp" : "Chưa có tag nào"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map((tag) => (
                  <TableRow key={tag.tag_id}>
                    <TableCell>{tag.tag_id}</TableCell>
                    <TableCell>{tag.tag_name}</TableCell>
                    <TableCell>{tag.document_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTag(tag)}
                        className="h-8 w-8 mr-1"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTag(tag.tag_id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedTag && (
        <EditTagDialog
          tag={selectedTag}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
} 