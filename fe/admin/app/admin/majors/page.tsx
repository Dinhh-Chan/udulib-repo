"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MajorsTable } from "@/components/admin/majors-table"
import { PlusCircle } from "lucide-react"
import { AddMajorDialog } from "@/components/admin/add-major-dialog"

export default function MajorsPage() {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get("page")) || 1
  const search = searchParams?.get("search") || ""

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý ngành học</h1>
        <AddMajorDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm ngành học
          </Button>
        </AddMajorDialog>
      </div>
      <Card>
        <CardContent>
          <MajorsTable page={page} search={search} />
        </CardContent>
      </Card>
    </div>
  )
}
