"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quản lý môn học</h2>
        <p className="text-muted-foreground">
          Thêm, sửa, xóa và quản lý các môn học trong hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chức năng đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  )
} 