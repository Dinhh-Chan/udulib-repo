"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"
import { getYear } from "@/lib/api/years"
import { Year } from "@/types/year"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getEnhancedSubjectsByYear } from "@/lib/api/subject"
import { Subject } from "@/types/subject"

// Tạo component cho bảng môn học
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Params = {
  id: string;
}

export default function YearDetailPage() {
  const router = useRouter()
  const params = useParams<Params>()
  const yearId = params?.id
  const { toast } = useToast()
  const [year, setYear] = useState<Year | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const fetchYearDetails = async () => {
      if (!yearId) return
      
      setIsLoading(true)
      try {
        const yearData = await getYear(parseInt(yearId))
        setYear(yearData)
        
        // Lấy danh sách môn học theo năm học sử dụng hàm getEnhancedSubjectsByYear để có thêm thông tin ngành học
        try {
          const subjectsData = await getEnhancedSubjectsByYear(parseInt(yearId))
          setSubjects(subjectsData)
          setFilteredSubjects(subjectsData)
        } catch (error) {
          console.error("Error fetching subjects:", error)
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể tải danh sách môn học. Vui lòng thử lại sau."
          })
        }
      } catch (error) {
        console.error("Error fetching year details:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin năm học. Vui lòng thử lại sau."
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchYearDetails()
  }, [yearId, toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubjects(subjects)
    } else {
      const filtered = subjects.filter(subject =>
        subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.subject_code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSubjects(filtered)
    }
  }, [searchQuery, subjects])

  const handleBack = () => {
    router.push("/admin/years")
  }

  if (isLoading) {
    return <div className="container mx-auto py-6">Đang tải dữ liệu...</div>
  }

  if (!year) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="text-center py-10">Không tìm thấy thông tin năm học</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{year.year_name}</h1>
          <p className="text-muted-foreground">
            Chi tiết năm học và danh sách môn học
          </p>
        </div>
      </div>

      {/* Thông tin năm học */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin năm học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p>{year.year_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tên năm học</p>
              <p>{year.year_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày tạo</p>
              <p>{formatDate(year.created_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Số môn học</p>
              <p>{subjects.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách môn học */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách môn học</CardTitle>
          <CardDescription>
            Danh sách các môn học thuộc năm học này
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="Tìm kiếm môn học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm" className="px-3">
              <Search className="h-4 w-4" />
              <span className="sr-only">Tìm kiếm</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubjects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mã môn học</TableHead>
                  <TableHead>Tên môn học</TableHead>
                  <TableHead>Ngành học</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => (
                  <TableRow key={subject.subject_id}>
                    <TableCell>{subject.subject_id}</TableCell>
                    <TableCell>{subject.subject_code}</TableCell>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.major_name || "N/A"}</TableCell>
                    <TableCell>{formatDate(subject.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center">
              {subjects.length === 0 
                ? "Không có môn học nào trong năm học này" 
                : "Không tìm thấy môn học nào phù hợp với từ khóa tìm kiếm"
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 