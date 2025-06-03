"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Eye, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getForums, deleteForum, type Forum } from "@/lib/api/forum"
import { getSubject } from "@/lib/api/subject"
import { type Subject } from "@/types/subject"
import { AddForumDialog } from "./add-forum-dialog"
import { EditForumDialog } from "./edit-forum-dialog"
import { formatDate } from "@/lib/utils"

export interface ForumsTableProps {
  page?: number
  per_page?: number
  onReload?: () => void
  subjectId?: number
  searchQuery?: string
}

interface ForumWithSubject extends Forum {
  subjectData?: Subject
}

export function ForumsTable({ page = 1, per_page = 20, onReload, subjectId, searchQuery = "" }: ForumsTableProps) {
  const router = useRouter()
  const [forums, setForums] = useState<ForumWithSubject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedForum, setSelectedForum] = useState<ForumWithSubject | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const fetchForums = async () => {
    try {
      setIsLoading(true)
      const data = await getForums({ page, per_page })
      const forumsWithSubject = await Promise.all(
        data.map(async (forum) => {
          const subject = await getSubject(forum.subject_id)
          return { ...forum, subjectData: subject || undefined }
        })
      )
      let filteredData = subjectId 
        ? forumsWithSubject.filter(forum => forum.subject_id === subjectId)
        : forumsWithSubject
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filteredData = filteredData.filter(forum => 
          forum.subjectData?.subject_name?.toLowerCase().includes(query) ||
          forum.subjectData?.subject_code?.toLowerCase().includes(query) ||
          forum.description?.toLowerCase().includes(query)
        )
      }
      
      setForums(filteredData)
    } catch (error) {
      console.error("Error fetching forums:", error)
      toast.error("Không thể tải danh sách diễn đàn")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchForums()
  }, [page, per_page, subjectId, searchQuery])

  const handleView = (id: number) => {
    router.push(`/admin/forum/${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa diễn đàn này?")) return

    try {
      await deleteForum(id)
      toast.success("Đã xóa diễn đàn")
      fetchForums()
      onReload?.()
    } catch (error) {
      console.error("Error deleting forum:", error)
      toast.error("Không thể xóa diễn đàn")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (forums.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Không tìm thấy diễn đàn nào</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {subjectId !== undefined && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            + Thêm diễn đàn
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên môn học</TableHead>
              <TableHead>Mã môn học</TableHead>
              <TableHead>Mô tả diễn đàn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forums.map((forum) => (
              <TableRow key={forum.forum_id}>
                <TableCell className="font-medium">
                  {forum.subjectData?.subject_name || "Không có tên"}
                </TableCell>
                <TableCell>{forum.subjectData?.subject_code || "Không có mã"}</TableCell>
                <TableCell className="max-w-xs truncate">{forum.description}</TableCell>
                <TableCell>{formatDate(forum.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(forum.forum_id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Xem chi tiết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedForum(forum)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(forum.forum_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedForum && (
        <EditForumDialog
          forum={selectedForum}
          open={!!selectedForum}
          onOpenChange={(open) => !open && setSelectedForum(null)}
          onSuccess={fetchForums}
        />
      )}

      {subjectId !== undefined && (
        <AddForumDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={fetchForums}
          subjectId={subjectId}
        />
      )}
    </div>
  )
} 