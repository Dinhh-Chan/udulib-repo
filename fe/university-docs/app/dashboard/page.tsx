import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoursesTable } from "@/components/admin/courses-table"
import { PlusCircle } from "lucide-react"
import { AddCourseDialog } from "@/components/admin/add-course-dialog"

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý môn học</h1>
        <AddCourseDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>
        </AddCourseDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesTable />
        </CardContent>
      </Card>
    </div>
  )
}
