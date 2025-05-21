"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle, Search, Eye, FileText, Trash2, CheckSquare, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Dữ liệu mẫu cho tài liệu
const documents = [
  {
    id: 1,
    title: "Giáo trình HTML, CSS cơ bản",
    department: "Công nghệ thông tin",
    course: "Phát triển ứng dụng web",
    uploadDate: "2023-05-10",
    views: 1245,
    downloads: 567,
    likes: 89,
    fileType: "PDF",
    status: "approved",
    uploader: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Bài tập JavaScript",
    department: "Công nghệ thông tin",
    course: "Phát triển ứng dụng web",
    uploadDate: "2023-05-09",
    views: 876,
    downloads: 432,
    likes: 56,
    fileType: "DOCX",
    status: "approved",
    uploader: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Slide bài giảng ReactJS",
    department: "Công nghệ thông tin",
    course: "Phát triển ứng dụng web",
    uploadDate: "2023-05-08",
    views: 987,
    downloads: 543,
    likes: 78,
    fileType: "PPTX",
    status: "pending",
    uploader: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Đề thi cuối kỳ Marketing căn bản",
    department: "Marketing",
    course: "Marketing căn bản",
    uploadDate: "2023-05-07",
    views: 765,
    downloads: 321,
    likes: 45,
    fileType: "PDF",
    status: "pending",
    uploader: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    title: "Bài tập lớn Kinh tế vĩ mô",
    department: "Kinh tế",
    course: "Kinh tế vĩ mô",
    uploadDate: "2023-05-06",
    views: 543,
    downloads: 234,
    likes: 32,
    fileType: "DOCX",
    status: "reported",
    uploader: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function AdminDocuments() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý tài liệu</CardTitle>
          <CardDescription>Quản lý tất cả tài liệu trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm tài liệu..." className="pl-10" />
            </div>

            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ngành học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="it">Công nghệ thông tin</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="economics">Kinh tế</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="pptx">PPTX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Đã duyệt
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                Chờ duyệt
              </TabsTrigger>
              <TabsTrigger value="reported" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                Bị báo cáo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tài liệu</TableHead>
                      <TableHead>Ngành học</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Người tải lên</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge>{doc.fileType}</Badge>
                            <span className="line-clamp-1">{doc.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{doc.department}</TableCell>
                        <TableCell>{doc.course}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={doc.uploader.avatar || "/placeholder.svg"} alt={doc.uploader.name} />
                              <AvatarFallback>{doc.uploader.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{doc.uploader.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(doc.uploadDate).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell>{doc.views}</TableCell>
                        <TableCell>
                          {doc.status === "approved" && (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Đã duyệt
                            </Badge>
                          )}
                          {doc.status === "pending" && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                              Chờ duyệt
                            </Badge>
                          )}
                          {doc.status === "reported" && (
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                              Bị báo cáo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {doc.status === "pending" && (
                              <Button variant="ghost" size="icon" className="text-green-600">
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="approved">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tài liệu</TableHead>
                      <TableHead>Ngành học</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Người tải lên</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.status === "approved")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Badge>{doc.fileType}</Badge>
                              <span className="line-clamp-1">{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.department}</TableCell>
                          <TableCell>{doc.course}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={doc.uploader.avatar || "/placeholder.svg"} alt={doc.uploader.name} />
                                <AvatarFallback>{doc.uploader.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{doc.uploader.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>{doc.views}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tài liệu</TableHead>
                      <TableHead>Ngành học</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Người tải lên</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.status === "pending")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Badge>{doc.fileType}</Badge>
                              <span className="line-clamp-1">{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.department}</TableCell>
                          <TableCell>{doc.course}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={doc.uploader.avatar || "/placeholder.svg"} alt={doc.uploader.name} />
                                <AvatarFallback>{doc.uploader.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{doc.uploader.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-green-600">
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="reported">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tài liệu</TableHead>
                      <TableHead>Ngành học</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Người tải lên</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead>Lý do báo cáo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.status === "reported")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Badge>{doc.fileType}</Badge>
                              <span className="line-clamp-1">{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.department}</TableCell>
                          <TableCell>{doc.course}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={doc.uploader.avatar || "/placeholder.svg"} alt={doc.uploader.name} />
                                <AvatarFallback>{doc.uploader.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{doc.uploader.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>Vi phạm bản quyền</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-green-600">
                                <CheckSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
