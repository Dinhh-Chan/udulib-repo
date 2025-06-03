"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ForumsTable } from "@/components/admin/forums-table"
import { Plus, Search } from "lucide-react"
import { AddForumDialog } from "@/components/admin/add-forum-dialog"

export default function ForumPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [key, setKey] = useState(0)

  const handleSuccess = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý diễn đàn</h2>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa và quản lý các diễn đàn trong hệ thống
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm diễn đàn
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Danh sách diễn đàn</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm diễn đàn..."
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ForumsTable 
            key={key} 
            searchQuery={searchQuery}
            onReload={handleSuccess}
          />
        </CardContent>
      </Card>

      <AddForumDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
