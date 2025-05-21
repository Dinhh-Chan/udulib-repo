"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, ChevronRight, ChevronDown, FileText, Book } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

// Dữ liệu mẫu cho ngành học và môn học
const departments = [
  {
    id: 1,
    name: "Công nghệ thông tin",
    description: "Chương trình đào tạo về lập trình, phát triển phần mềm, mạng máy tính và an ninh mạng.",
    documentCount: 245,
    courseCount: 32,
    years: [
      {
        id: 1,
        name: "Năm 1",
        courses: [
          {
            id: 1,
            name: "Nhập môn lập trình",
            documentCount: 24,
          },
          {
            id: 2,
            name: "Toán rời rạc",
            documentCount: 18,
          },
        ],
      },
      {
        id: 2,
        name: "Năm 2",
        courses: [
          {
            id: 5,
            name: "Cấu trúc dữ liệu và giải thuật",
            documentCount: 28,
          },
          {
            id: 6,
            name: "Cơ sở dữ liệu",
            documentCount: 26,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Tài chính - Ngân hàng",
    description: "Chương trình đào tạo về quản lý tài chính, ngân hàng, đầu tư và thị trường chứng khoán.",
    documentCount: 187,
    courseCount: 28,
    years: [
      {
        id: 1,
        name: "Năm 1",
        courses: [
          {
            id: 20,
            name: "Kinh tế vĩ mô",
            documentCount: 22,
          },
          {
            id: 21,
            name: "Nguyên lý kế toán",
            documentCount: 19,
          },
        ],
      },
      {
        id: 2,
        name: "Năm 2",
        courses: [
          {
            id: 22,
            name: "Tài chính doanh nghiệp",
            documentCount: 24,
          },
          {
            id: 23,
            name: "Thị trường chứng khoán",
            documentCount: 21,
          },
        ],
      },
    ],
  },
]

export default function AdminDepartments() {
  const [expandedDepartment, setExpandedDepartment] = useState<number | null>(null)

  const toggleDepartment = (id: number) => {
    if (expandedDepartment === id) {
      setExpandedDepartment(null)
    } else {
      setExpandedDepartment(id)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý ngành học</CardTitle>
          <CardDescription>Quản lý ngành học, năm học và môn học trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm ngành học, môn học..." className="pl-10" />
            </div>

            <div className="flex gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm ngành học
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Ngành học</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-center">Môn học</TableHead>
                  <TableHead className="text-center">Tài liệu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <>
                    <TableRow
                      key={department.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleDepartment(department.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {expandedDepartment === department.id ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          {department.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-1">{department.description}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Book className="h-4 w-4 text-muted-foreground" />
                          <span>{department.courseCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{department.documentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedDepartment === department.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="bg-muted/30 p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">Năm học và môn học</h3>
                              <div className="flex gap-2">
                                <Button size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Thêm năm học
                                </Button>
                                <Button size="sm">
                                  <Plus className="h-3 w-3 mr-1" />
                                  Thêm môn học
                                </Button>
                              </div>
                            </div>

                            <Accordion type="multiple" className="w-full">
                              {department.years.map((year) => (
                                <AccordionItem key={year.id} value={`year-${year.id}`}>
                                  <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                                    <div className="flex items-center">
                                      {year.name} <Badge className="ml-2">{year.courses.length} môn học</Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="rounded-md border mt-2">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Môn học</TableHead>
                                            <TableHead className="text-center">Tài liệu</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {year.courses.map((course) => (
                                            <TableRow key={course.id}>
                                              <TableCell className="font-medium">{course.name}</TableCell>
                                              <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                                  <span>{course.documentCount}</span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                  <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
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
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
