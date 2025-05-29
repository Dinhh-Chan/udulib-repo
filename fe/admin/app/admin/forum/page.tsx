import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ForumPostsTable } from "@/components/admin/forum-posts-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function ForumPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý diễn đàn</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Tìm kiếm bài viết..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="flagged">Đánh dấu</SelectItem>
              <SelectItem value="hidden">Ẩn</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Lọc
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết diễn đàn</CardTitle>
        </CardHeader>
        <CardContent>
          <ForumPostsTable />
        </CardContent>
      </Card>
    </div>
  )
}
