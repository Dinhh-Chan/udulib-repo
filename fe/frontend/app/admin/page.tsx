import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BarChart, Users, FileText, BookOpen, Settings, AlertTriangle } from "lucide-react"
import AdminDashboard from "@/components/admin/admin-dashboard"
import AdminDocuments from "@/components/admin/admin-documents"
import AdminUsers from "@/components/admin/admin-users"
import AdminDepartments from "@/components/admin/admin-departments"
import AdminSettings from "@/components/admin/admin-settings"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản trị hệ thống</h1>
          <p className="text-muted-foreground">Quản lý tài liệu, người dùng, ngành học và cấu hình hệ thống</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">1,234</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Tài liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">5,678</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Người dùng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">15</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Ngành học
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Cần duyệt
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Ngành học
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="documents">
          <AdminDocuments />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="departments">
          <AdminDepartments />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
