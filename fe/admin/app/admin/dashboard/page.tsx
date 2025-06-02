"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, BookOpen, GraduationCap } from "lucide-react"
import { useEffect, useState } from "react"
import { getDocumentCount } from "@/lib/api/documents"
import { getSubjectCount } from "@/lib/api/subject"
import { getMajorCount } from "@/lib/api/major"
import { getUsers } from "@/lib/api/users"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    documents: 0,
    users: 0,
    subjects: 0,
    majors: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docCount, subCount, majCount, users] = await Promise.all([
          getDocumentCount(),
          getSubjectCount(),
          getMajorCount(),
          getUsers()
        ])

        setStats({
          documents: docCount,
          subjects: subCount,
          majors: majCount,
          users: users.length
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">
          Thống kê và quản lý hệ thống
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tài liệu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents}</div>
            <p className="text-xs text-muted-foreground">
              Tài liệu trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Môn học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subjects}</div>
            <p className="text-xs text-muted-foreground">
              Môn học trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngành học</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.majors}</div>
            <p className="text-xs text-muted-foreground">
              Ngành học trong hệ thống
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tài liệu mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add recent documents table here */}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add recent activities here */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 