import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Users, Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quản trị hệ thống</h1>
          <p className="text-muted-foreground">Quản lý ngành học, môn học, tài liệu và người dùng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng số ngành học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">6</div>
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng số môn học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">42</div>
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng số tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">358</div>
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tổng số người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">1,245</div>
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="departments">Ngành học</TabsTrigger>
            <TabsTrigger value="courses">Môn học</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý ngành học</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm ngành học
                  </Button>
                </div>
                <CardDescription>Quản lý danh sách các ngành học trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm ngành học..." className="flex-1" />
                </div>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Tên ngành học</div>
                    <div className="col-span-3">Mã ngành</div>
                    <div className="col-span-2">Số môn học</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {departments.map((dept) => (
                    <div key={dept.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                      <div className="col-span-1 text-muted-foreground">{dept.id}</div>
                      <div className="col-span-4 font-medium">{dept.name}</div>
                      <div className="col-span-3">{dept.slug}</div>
                      <div className="col-span-2">{dept.courseCount}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý môn học</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm môn học
                  </Button>
                </div>
                <CardDescription>Quản lý danh sách các môn học trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm môn học..." className="flex-1" />
                </div>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Tên môn học</div>
                    <div className="col-span-2">Mã môn</div>
                    <div className="col-span-2">Ngành học</div>
                    <div className="col-span-1">Năm</div>
                    <div className="col-span-1">Tài liệu</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {adminCourses.map((course) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                      <div className="col-span-1 text-muted-foreground">{course.id}</div>
                      <div className="col-span-3 font-medium">{course.name}</div>
                      <div className="col-span-2">{course.slug}</div>
                      <div className="col-span-2">{course.department}</div>
                      <div className="col-span-1">Năm {course.year}</div>
                      <div className="col-span-1">{course.documentCount}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý tài liệu</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tài liệu
                  </Button>
                </div>
                <CardDescription>Quản lý danh sách các tài liệu trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm tài liệu..." className="flex-1" />
                </div>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Tiêu đề</div>
                    <div className="col-span-2">Môn học</div>
                    <div className="col-span-1">Loại</div>
                    <div className="col-span-1">Kích thước</div>
                    <div className="col-span-1">Người tải</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {adminDocuments.map((doc) => (
                    <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                      <div className="col-span-1 text-muted-foreground">{doc.id}</div>
                      <div className="col-span-3 font-medium">{doc.title}</div>
                      <div className="col-span-2">{doc.course}</div>
                      <div className="col-span-1">{doc.type}</div>
                      <div className="col-span-1">{doc.fileSize}</div>
                      <div className="col-span-1">{doc.uploader}</div>
                      <div className="col-span-1">
                        <Badge
                          variant={
                            doc.status === "approved" ? "default" : doc.status === "pending" ? "outline" : "destructive"
                          }
                        >
                          {doc.status === "approved" ? "Đã duyệt" : doc.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {doc.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-500">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý người dùng</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm người dùng
                  </Button>
                </div>
                <CardDescription>Quản lý danh sách người dùng trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm người dùng..." className="flex-1" />
                </div>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Họ tên</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-1">Vai trò</div>
                    <div className="col-span-1">Tài liệu</div>
                    <div className="col-span-2">Ngày đăng ký</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                      <div className="col-span-1 text-muted-foreground">{user.id}</div>
                      <div className="col-span-2 font-medium">{user.name}</div>
                      <div className="col-span-3">{user.email}</div>
                      <div className="col-span-1">
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role === "admin" ? "Admin" : user.role === "teacher" ? "Giảng viên" : "Sinh viên"}
                        </Badge>
                      </div>
                      <div className="col-span-1">{user.documentCount}</div>
                      <div className="col-span-2">{user.registrationDate}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Sample data
const departments = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    slug: "it",
    courseCount: 42,
  },
  {
    id: "2",
    name: "Tài chính - Ngân hàng",
    slug: "finance",
    courseCount: 36,
  },
  {
    id: "3",
    name: "Kế toán",
    slug: "accounting",
    courseCount: 30,
  },
  {
    id: "4",
    name: "Quản trị kinh doanh",
    slug: "business",
    courseCount: 38,
  },
  {
    id: "5",
    name: "Kinh tế",
    slug: "economics",
    courseCount: 32,
  },
  {
    id: "6",
    name: "Luật",
    slug: "law",
    courseCount: 34,
  },
]

const adminCourses = [
  {
    id: "1",
    name: "Nhập môn lập trình",
    slug: "intro-to-programming",
    department: "Công nghệ thông tin",
    year: 1,
    documentCount: 24,
  },
  {
    id: "2",
    name: "Cấu trúc dữ liệu và giải thuật",
    slug: "data-structures",
    department: "Công nghệ thông tin",
    year: 1,
    documentCount: 18,
  },
  {
    id: "3",
    name: "Toán rời rạc",
    slug: "discrete-math",
    department: "Công nghệ thông tin",
    year: 1,
    documentCount: 15,
  },
  {
    id: "4",
    name: "Lập trình hướng đối tượng",
    slug: "oop",
    department: "Công nghệ thông tin",
    year: 2,
    documentCount: 22,
  },
  {
    id: "5",
    name: "Cơ sở dữ liệu",
    slug: "database",
    department: "Công nghệ thông tin",
    year: 2,
    documentCount: 20,
  },
]

const adminDocuments = [
  {
    id: "1",
    title: "Giáo trình Nhập môn lập trình",
    course: "Nhập môn lập trình",
    type: "PDF",
    fileSize: "8.5 MB",
    uploader: "TS. Nguyễn Văn A",
    status: "approved",
  },
  {
    id: "2",
    title: "Slide bài giảng tuần 1-5",
    course: "Nhập môn lập trình",
    type: "PPTX",
    fileSize: "5.2 MB",
    uploader: "TS. Nguyễn Văn A",
    status: "approved",
  },
  {
    id: "3",
    title: "Bài tập thực hành số 1",
    course: "Nhập môn lập trình",
    type: "DOCX",
    fileSize: "2.3 MB",
    uploader: "ThS. Trần Thị B",
    status: "pending",
  },
  {
    id: "4",
    title: "Đề thi giữa kỳ năm 2022",
    course: "Nhập môn lập trình",
    type: "PDF",
    fileSize: "1.8 MB",
    uploader: "Admin",
    status: "approved",
  },
  {
    id: "5",
    title: "Bài tập thực hành số 2",
    course: "Nhập môn lập trình",
    type: "DOCX",
    fileSize: "3.1 MB",
    uploader: "ThS. Trần Thị B",
    status: "rejected",
  },
]

const users = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "admin",
    documentCount: 15,
    registrationDate: "01/01/2023",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "teacher",
    documentCount: 28,
    registrationDate: "15/01/2023",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "student",
    documentCount: 5,
    registrationDate: "20/02/2023",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "student",
    documentCount: 3,
    registrationDate: "05/03/2023",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "teacher",
    documentCount: 12,
    registrationDate: "10/03/2023",
  },
]
