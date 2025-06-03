"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, BookOpen, GraduationCap, Eye, Download, MessageSquare, Star } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getOverviewStatistics,
  getDocumentsByStatus,
  getDocumentsBySubject,
  getMostViewedDocuments,
  getMostDownloadedDocuments,
  getActivityByTime,
  type OverviewStatistics,
  type DocumentStatusStats,
  type DocumentBySubjectStats,
  type MostViewedDocument,
  type MostDownloadedDocument,
  type ActivityByTime
} from "@/lib/api/statistics"

function DashboardContent() {
  const [overview, setOverview] = useState<OverviewStatistics | null>(null)
  const [documentStatus, setDocumentStatus] = useState<DocumentStatusStats[]>([])
  const [topSubjects, setTopSubjects] = useState<DocumentBySubjectStats[]>([])
  const [mostViewed, setMostViewed] = useState<MostViewedDocument[]>([])
  const [mostDownloaded, setMostDownloaded] = useState<MostDownloadedDocument[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityByTime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [
          overviewData,
          statusData,
          subjectsData,
          viewedData,
          downloadedData,
          activityData
        ] = await Promise.all([
          getOverviewStatistics(),
          getDocumentsByStatus(),
          getDocumentsBySubject(5),
          getMostViewedDocuments(5),
          getMostDownloadedDocuments(5),
          getActivityByTime(7)
        ])

        setOverview(overviewData)
        setDocumentStatus(Array.isArray(statusData) ? statusData : [])
        setTopSubjects(Array.isArray(subjectsData) ? subjectsData : [])
        setMostViewed(Array.isArray(viewedData) ? viewedData : [])
        setMostDownloaded(Array.isArray(downloadedData) ? downloadedData : [])
        setRecentActivity(Array.isArray(activityData) ? activityData : [])
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Không thể tải dữ liệu thống kê")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-medium">Đang tải dữ liệu...</h2>
          <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-medium text-destructive">{error}</h2>
          <p className="text-sm text-muted-foreground">Vui lòng thử lại sau</p>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-medium">Không có dữ liệu</h2>
          <p className="text-sm text-muted-foreground">Vui lòng thử lại sau</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Tổng số tài liệu",
      value: overview?.total_documents,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lượt xem",
      value: overview?.total_views,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Lượt tải",
      value: overview?.total_downloads,
      icon: Download,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Người dùng",
      value: overview?.total_users,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <p className="text-muted-foreground">
          Thống kê và quản lý hệ thống
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", stat.bgColor)}>
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent className="pt-4">
              <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.title === "Tổng số tài liệu" && "Tài liệu trong hệ thống"}
                {stat.title === "Lượt xem" && "Tổng lượt xem tài liệu"}
                {stat.title === "Lượt tải" && "Tổng lượt tải tài liệu"}
                {stat.title === "Người dùng" && "Người dùng đã đăng ký"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Trạng thái tài liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      status.status === "approved" ? "default" :
                      status.status === "pending" ? "secondary" :
                      "destructive"
                    } className={
                      status.status === "approved" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                      status.status === "pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                      "bg-red-100 text-red-700 hover:bg-red-100"
                    }>
                      {status.status === "approved" ? "Đã duyệt" :
                       status.status === "pending" ? "Chờ duyệt" :
                       "Từ chối"}
                    </Badge>
                  </div>
                  <span className="font-medium">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              Top môn học có nhiều tài liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSubjects.map((subject) => (
                <div key={subject.subject_name} className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject_name}</span>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                    {subject.count} tài liệu
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Tài liệu xem nhiều nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-green-50">
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead className="text-right">Lượt xem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostViewed.map((doc, index) => (
                  <TableRow key={`viewed-${doc.title}-${index}`} className="hover:bg-green-50">
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.subject_name}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">{doc.views}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-500" />
              Tài liệu tải nhiều nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-orange-50">
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead className="text-right">Lượt tải</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostDownloaded.map((doc, index) => (
                  <TableRow key={`downloaded-${doc.title}-${index}`} className="hover:bg-orange-50">
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.subject_name}</TableCell>
                    <TableCell className="text-right font-medium text-orange-600">{doc.downloads}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            Hoạt động 7 ngày qua
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-indigo-50">
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Tài liệu mới</TableHead>
                <TableHead className="text-right">Bình luận</TableHead>
                <TableHead className="text-right">Đánh giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity, index) => (
                <TableRow key={`activity-${activity.date}-${index}`} className="hover:bg-indigo-50">
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium text-blue-600">{activity.uploads}</TableCell>
                  <TableCell className="text-right font-medium text-purple-600">{activity.comments}</TableCell>
                  <TableCell className="text-right font-medium text-indigo-600">{activity.ratings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <DashboardContent />
    </Suspense>
  )
} 