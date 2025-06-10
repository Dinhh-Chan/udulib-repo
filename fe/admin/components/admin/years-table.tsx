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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, MoreHorizontal, Link, ChevronLeft, ChevronRight } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Year } from "@/types/year"
import { getYears, deleteYear, createYearSlug } from "@/lib/api/years"
import { EditYearDialog } from "./edit-year-dialog"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface YearsTableProps {
  searchQuery?: string
  onSuccess?: () => void
}

export function YearsTable({ searchQuery = "", onSuccess }: YearsTableProps) {
  const [years, setYears] = useState<Year[]>([])
  const [filteredYears, setFilteredYears] = useState<Year[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<Year | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loadingSlugYearId, setLoadingSlugYearId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const fetchYears = async () => {
    setIsLoading(true)
    try {
      const data = await getYears(currentPage, itemsPerPage)
      setYears(data)
      // API hiện chưa trả về tổng số trang, tạm thời tính gần đúng
      setTotalPages(Math.ceil(data.length > 0 ? data.length / itemsPerPage : 1))
    } catch (error) {
      console.error("Error fetching years:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu năm học. Vui lòng thử lại sau."
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchYears()
  }, [currentPage])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredYears(years)
    } else {
      const filtered = years.filter(year =>
        year.year_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredYears(filtered)
    }
  }, [searchQuery, years])

  const handleEditClick = (year: Year) => {
    setSelectedYear(year)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (year: Year) => {
    setSelectedYear(year)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateSlug = async (year: Year) => {
    setLoadingSlugYearId(year.year_id)
    try {
      await createYearSlug(year.year_id)
      await fetchYears()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(`Error creating slug for year with ID ${year.year_id}:`, error)
    } finally {
      setLoadingSlugYearId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedYear) return

    try {
      const success = await deleteYear(selectedYear.year_id)
      if (success) {
        await fetchYears()
        if (onSuccess) onSuccess()
        toast({
          title: "Thành công",
          description: "Đã xóa năm học thành công."
        })
      }
    } catch (error) {
      console.error("Error deleting year:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa năm học. Vui lòng thử lại sau."
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditSuccess = () => {
    fetchYears()
    setIsEditDialogOpen(false)
    if (onSuccess) onSuccess()
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  if (isLoading) {
    return <div className="py-10 text-center">Đang tải dữ liệu...</div>
  }

  if (years.length === 0) {
    return <div className="py-10 text-center">Không có năm học nào. Hãy thêm năm học mới.</div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên năm học</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredYears.map((year) => (
            <TableRow key={year.year_id}>
              <TableCell>{year.year_id}</TableCell>
              <TableCell>{year.year_name}</TableCell>
              <TableCell>{year.year_order}</TableCell>
              <TableCell>{formatDate(year.created_at)}</TableCell>
              <TableCell>{year.updated_at ? formatDate(year.updated_at) : "N/A"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditClick(year)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateSlug(year)} disabled={loadingSlugYearId === year.year_id}>
                      <Link className="mr-2 h-4 w-4" />
                      {loadingSlugYearId === year.year_id ? "Đang xử lý..." : "Tạo đường dẫn"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(year)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <div className="text-sm text-muted-foreground">
          Trang {currentPage} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <EditYearDialog
        year={selectedYear}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa năm học "{selectedYear?.year_name}"? 
              Hành động này không thể hoàn tác và có thể ảnh hưởng đến dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 