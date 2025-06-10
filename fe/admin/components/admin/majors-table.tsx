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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MoreHorizontal } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { EditMajorDialog } from "./edit-major-dialog"
import { Major } from "@/types/major"
import { deleteMajor, getMajors } from "@/lib/api/major"
import { showSuccessToast, showErrorToast } from "@/lib/utils"

interface MajorsTableProps {
  page?: number
  search?: string
}

export function MajorsTable({ page = 1, search = "" }: MajorsTableProps) {
  const [majors, setMajors] = useState<Major[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(search)
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setIsLoading(true)
        const response = await getMajors(page, debouncedSearch)
        setMajors(response || [])
      } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.type === 'silent' && error.message) {
          // Đã được xử lý bởi ApiClient, không cần làm gì thêm
        } else if (error.response?.data?.detail) {
          // Hiển thị lỗi cụ thể từ API
          showErrorToast(error.response.data.detail);
        } else if (error instanceof Error) {
          showErrorToast(error.message);
        } else {
          showErrorToast("Không thể tải danh sách ngành học");
        }
        setMajors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMajors()
  }, [page, debouncedSearch, reloadKey])

  useEffect(() => {
    if (debouncedSearch !== search) {
      const params = new URLSearchParams(searchParams?.toString())
      params.set("search", debouncedSearch)
      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
    }
  }, [debouncedSearch, router, search, searchParams])

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa ngành học này?")) {
      return;
    }
    
    try {
      await deleteMajor(id)
      setReloadKey(key => key + 1)
      showSuccessToast("Xóa ngành học thành công")
    } catch (error: any) {
      // Xử lý lỗi từ API
      if (error.type === 'silent' && error.message) {
        // Đã được xử lý bởi ApiClient, không cần làm gì thêm
      } else if (error.response?.data?.detail) {
        // Hiển thị lỗi cụ thể từ API
        showErrorToast(error.response.data.detail);
      } else if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast("Không thể xóa ngành học");
      }
    }
  }

  const handleEdit = (major: Major) => {
    setSelectedMajor(major)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setReloadKey(key => key + 1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-6 py-4">
        <h2 className="text-2xl font-bold tracking-tight">Danh sách ngành học</h2>
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ngành học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã ngành</TableHead>
              <TableHead>Tên ngành</TableHead>
              <TableHead>Mô tả</TableHead>
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
            ) : majors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              majors.map((major) => (
                <TableRow key={major.major_id}>
                  <TableCell>{major.major_code}</TableCell>
                  <TableCell>{major.major_name}</TableCell>
                  <TableCell>{major.description}</TableCell>
                  <TableCell>{new Date(major.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(major)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(major.major_id)}
                        >
                          Xóa
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

      {selectedMajor && (
        <EditMajorDialog
          major={selectedMajor}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
