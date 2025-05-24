import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, FileText, Download, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Tổng hợp tài liệu</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-medium line-clamp-2">
                      <Link href={`/documents/${doc.id}`} className="hover:underline">
                        {doc.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doc.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{doc.fileType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample data
const documents = [
  {
    id: "1",
    title: "Giáo trình Nhập môn lập trình",
    description: "Giáo trình chính thức môn Nhập môn lập trình",
    fileType: "PDF",
    fileSize: "8.5 MB",
    tags: ["Lý thuyết", "Tham khảo", "Giáo trình"],
  },
  {
    id: "2",
    title: "Slide bài giảng tuần 1-5",
    description: "Slide bài giảng từ tuần 1 đến tuần 5 môn Nhập môn lập trình",
    fileType: "PPTX",
    fileSize: "5.2 MB",
    tags: ["Lý thuyết", "Slide"],
  },
  {
    id: "3",
    title: "Bài tập thực hành số 1",
    description: "Bài tập thực hành về các khái niệm cơ bản trong lập trình",
    fileType: "DOCX",
    fileSize: "2.3 MB",
    tags: ["Bài tập", "Thực hành"],
  },
  {
    id: "4",
    title: "Đề thi giữa kỳ năm 2022",
    description: "Đề thi giữa kỳ môn Nhập môn lập trình năm 2022",
    fileType: "PDF",
    fileSize: "1.8 MB",
    tags: ["Đề thi", "Tham khảo"],
  },
] 