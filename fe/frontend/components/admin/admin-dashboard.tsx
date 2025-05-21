"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle, Eye, Download, ThumbsUp } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động tài liệu</CardTitle>
            <CardDescription>Thống kê hoạt động tài liệu trong 30 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Biểu đồ thống kê hoạt động tài liệu
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Người dùng mới</CardTitle>
            <CardDescription>Thống kê người dùng mới trong 30 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Biểu đồ thống kê người dùng mới
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Tài liệu đã duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hôm nay</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tuần này</span>
                <span className="font-bold">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tháng này</span>
                <span className="font-bold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tổng cộng</span>
                <span className="font-bold">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-500" />
              Tài liệu chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hôm nay</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tuần này</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tháng này</span>
                <span className="font-bold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tổng cộng</span>
                <span className="font-bold">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Tài liệu bị báo cáo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hôm nay</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tuần này</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tháng này</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tổng cộng</span>
                <span className="font-bold">45</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê tương tác</CardTitle>
          <CardDescription>Thống kê lượt xem, tải xuống và thích trong 30 ngày qua</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="views">
            <TabsList className="mb-4">
              <TabsTrigger value="views" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Lượt xem
              </TabsTrigger>
              <TabsTrigger value="downloads" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Lượt tải
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Lượt thích
              </TabsTrigger>
            </TabsList>

            <TabsContent value="views">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Biểu đồ thống kê lượt xem
              </div>
            </TabsContent>

            <TabsContent value="downloads">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Biểu đồ thống kê lượt tải
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Biểu đồ thống kê lượt thích
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
