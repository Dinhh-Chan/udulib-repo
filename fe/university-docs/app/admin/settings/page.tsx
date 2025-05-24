"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">
          Quản lý các cài đặt và tùy chỉnh cho hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt chung</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chức năng đang được phát triển...</p>
        </CardContent>
      </Card>
    </div>
  )
}
