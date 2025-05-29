import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MajorsTable } from "@/components/admin/majors-table"
import { PlusCircle } from "lucide-react"
import { AddMajorDialog } from "@/components/admin/add-major-dialog"

export default function MajorsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý ngành học</h1>
        <AddMajorDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm ngành học
          </Button>
        </AddMajorDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ngành học</CardTitle>
        </CardHeader>
        <CardContent>
          <MajorsTable />
        </CardContent>
      </Card>
    </div>
  )
}
