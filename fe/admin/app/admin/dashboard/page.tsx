"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, BookOpen, GraduationCap, Eye, Download, MessageSquare, Star } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
            <div className="text-2xl font-bold">{overview.total_documents}</div>
            <p className="text-xs text-muted-foreground">
              Tài liệu trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_views}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt xem tài liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt tải</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_downloads}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt tải tài liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_users}</div>
            <p className="text-xs text-muted-foreground">
              Người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trạng thái tài liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documentStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      status.status === "approved" ? "default" :
                      status.status === "pending" ? "secondary" :
                      "destructive"
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

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top môn học có nhiều tài liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topSubjects.map((subject) => (
                <div key={subject.subject_name} className="flex items-center justify-between">
                  <span className="font-medium">{subject.subject_name}</span>
                  <Badge variant="secondary">{subject.count} tài liệu</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu xem nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead className="text-right">Lượt xem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostViewed.map((doc) => (
                  <TableRow key={doc.document_id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.subject_name}</TableCell>
                    <TableCell className="text-right">{doc.views}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tài liệu tải nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tài liệu</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead className="text-right">Lượt tải</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostDownloaded.map((doc) => (
                  <TableRow key={doc.document_id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.subject_name}</TableCell>
                    <TableCell className="text-right">{doc.downloads}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động 7 ngày qua</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Tài liệu mới</TableHead>
                <TableHead className="text-right">Bình luận</TableHead>
                <TableHead className="text-right">Đánh giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.date}>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{activity.uploads}</TableCell>
                  <TableCell className="text-right">{activity.comments}</TableCell>
                  <TableCell className="text-right">{activity.ratings}</TableCell>
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