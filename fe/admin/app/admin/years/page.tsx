"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { YearsTable } from "@/components/admin/years-table"
import { AddYearDialog } from "@/components/admin/add-year-dialog"

export default function YearsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setIsAddDialogOpen(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý năm học</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách năm học trong hệ thống
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm năm học
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách năm học</CardTitle>
          <CardDescription>
            Danh sách tất cả các năm học trong hệ thống
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="Tìm kiếm năm học..."
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
          <YearsTable 
            key={refreshKey} 
            searchQuery={searchQuery} 
            onSuccess={() => setRefreshKey(prev => prev + 1)} 
          />
        </CardContent>
      </Card>

      <AddYearDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
} 