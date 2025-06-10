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
import { Pencil, Trash, MoreHorizontal, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Year } from "@/types/year"
import { getYears, getYearsWithSubjectsCount, deleteYear } from "@/lib/api/years"
import { EditYearDialog } from "./edit-year-dialog"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { getSubjectsByYear } from "@/lib/api/subject"

interface YearsTableProps {
  searchQuery?: string
  onSuccess?: () => void
}

export function YearsTable({ searchQuery = "", onSuccess }: YearsTableProps) {
  const router = useRouter()
  const [years, setYears] = useState<any[]>([])
  const [filteredYears, setFilteredYears] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<Year | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const fetchYears = async () => {
    setIsLoading(true)
    try {
      // Tạm thời sử dụng API getYears thay vì getYearsWithSubjectsCount vì API đang bị lỗi
      const data = await getYears(currentPage, itemsPerPage)
      console.log("Dữ liệu năm học nhận được:", data)
      
      // Thêm thuộc tính subjects_count giả tạm thời
      const yearsWithSubjectsCount = data.map(year => ({
        ...year,
        subjects_count: 0 // Giá trị mặc định là 0, sẽ cập nhật sau khi API hoạt động đúng
      }))
      
      // Sắp xếp theo ID từ thấp đến cao (1, 2, 3...)
      const sortedYears = yearsWithSubjectsCount.sort((a, b) => a.year_id - b.year_id)
      
      setYears(sortedYears)
      // API hiện chưa trả về tổng số trang, tạm thời tính gần đúng
      setTotalPages(Math.ceil(data.length > 0 ? data.length / itemsPerPage : 1))
      // Đảm bảo cập nhật filteredYears khi có dữ liệu
      setFilteredYears(sortedYears)
      
      // Lấy số môn học cho từng năm học
      fetchSubjectsCountForYears(sortedYears);
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

  // Hàm lấy số môn học cho từng năm học
  const fetchSubjectsCountForYears = async (years: any[]) => {
    for (const year of years) {
      try {
        const subjects = await getSubjectsByYear(year.year_id);
        // Cập nhật state years và filteredYears với số lượng môn học mới
        setYears(prevYears => 
          prevYears.map(y => 
            y.year_id === year.year_id ? { ...y, subjects_count: subjects.length } : y
          )
        );
        setFilteredYears(prevYears => 
          prevYears.map(y => 
            y.year_id === year.year_id ? { ...y, subjects_count: subjects.length } : y
          )
        );
      } catch (error) {
        console.error(`Không thể lấy số môn học cho năm học ${year.year_id}:`, error);
      }
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

  const handleViewDetails = (year: Year) => {
    router.push(`/admin/years/${year.year_id}`)
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
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Số môn học</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredYears.map((year) => (
            <TableRow key={year.year_id}>
              <TableCell>{year.year_id}</TableCell>
              <TableCell>{year.year_name}</TableCell>
              <TableCell>{formatDate(year.created_at)}</TableCell>
              <TableCell>{year.subjects_count || 0}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleViewDetails(year)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(year)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
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