"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoursesTable } from "@/components/admin/courses-table"
import { PlusCircle, Search } from "lucide-react"
import { AddCourseDialog } from "@/components/admin/add-course-dialog"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"

export default function CoursesPage() {
  const [key, setKey] = useState(0)
  const searchParams = useSearchParams()
  const search = searchParams?.get("search") || ""

  const handleSuccess = () => {
    // Force reload bảng bằng cách thay đổi key
    setKey(prev => prev + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý môn học</h1>
        <AddCourseDialog onSuccess={handleSuccess}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>
        </AddCourseDialog>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Danh sách môn học</CardTitle>
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm môn học..."
              value={search}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString())
                params.set("search", e.target.value)
                params.set("page", "1")
                window.history.pushState(null, "", `?${params.toString()}`)
              }}
              className="pl-8 w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <CoursesTable key={key} search={search} />
        </CardContent>
      </Card>
    </div>
  )
}
