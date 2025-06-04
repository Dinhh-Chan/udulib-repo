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

interface ForumsTableProps {
  page?: number
  per_page?: number
  onReload?: () => void
  subjectId?: number
}

interface ForumWithSubject extends Forum {
  subjectData?: Subject
}

export function ForumsTable({ page = 1, per_page = 20, onReload, subjectId }: ForumsTableProps) {
  const router = useRouter()
  const [forums, setForums] = useState<ForumWithSubject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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
      const filteredData = subjectId 
        ? forumsWithSubject.filter(forum => forum.subject_id === subjectId)
        : forumsWithSubject
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
  }, [page, per_page])

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

  const filteredForums = forums.filter(forum => {
    if (!forum) return false
    const subjectName = forum.subjectData?.subject_name || ""
    const subjectCode = forum.subjectData?.subject_code || ""
    const description = forum.description || ""
    const searchTermLower = searchTerm.toLowerCase()
    
    return subjectName.toLowerCase().includes(searchTermLower) ||
           subjectCode.toLowerCase().includes(searchTermLower) ||
           description.toLowerCase().includes(searchTermLower)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên môn học, mã môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        {subjectId !== undefined && (
          <AddForumDialog subjectId={subjectId} onSuccess={fetchForums} />
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredForums.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có diễn đàn nào
                </TableCell>
              </TableRow>
            ) : (
              filteredForums.map((forum) => (
                <TableRow key={forum.forum_id}>
                  <TableCell className="font-medium">
                    {forum.subjectData?.subject_name || "Không có tên"}
                  </TableCell>
                  <TableCell>{forum.subjectData?.subject_code || "Không có mã"}</TableCell>
                  <TableCell>{forum.description}</TableCell>
                  <TableCell>{new Date(forum.created_at).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem asChild>
                          <EditForumDialog
                            forum={forum}
                            onSuccess={fetchForums}
                            trigger={
                              <div className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </div>
                            }
                          />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 