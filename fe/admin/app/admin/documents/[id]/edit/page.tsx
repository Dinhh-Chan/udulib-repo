"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Document, getDocument, updateDocument } from "@/lib/api/documents"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { apiClient } from "@/lib/api/client"

interface Subject {
  subject_id: number
  subject_name: string
}

export default function DocumentEditPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subjectId, setSubjectId] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        const doc = await getDocument(parseInt(params.id))
        if (doc) {
          setDocument(doc)
          setTitle(doc.title)
          setDescription(doc.description || "")
          setSubjectId(doc.subject_id)
          setStatus(doc.status)
        }
      } catch (error) {
        console.error("Error fetching document:", error)
        toast.error("Không thể tải thông tin tài liệu")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSubjects = async () => {
      try {
        const response = await apiClient.get<{ subjects: Subject[] }>("/subjects/")
        setSubjects(response.subjects || [])
      } catch (error) {
        console.error("Error fetching subjects:", error)
        toast.error("Không thể tải danh sách môn học")
      }
    }

    fetchDocument()
    fetchSubjects()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!document) return
    
    try {
      setIsSaving(true)
      const updatedDoc = await updateDocument(document.document_id, {
        title,
        description,
        subject_id: subjectId,
        status
      })
      if (updatedDoc) {
        toast.success("Cập nhật tài liệu thành công")
        router.push(`/admin/documents/${document.document_id}`)
      }
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Không thể cập nhật tài liệu")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy tài liệu</h1>
        <Button onClick={() => router.push("/admin/documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/admin/documents/${document.document_id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa tài liệu</CardTitle>
          <CardDescription>
            Cập nhật thông tin cho tài liệu
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Tiêu đề
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề tài liệu"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Mô tả
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả tài liệu"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Môn học
              </label>
              <Select
                value={subjectId?.toString()}
                onValueChange={(value) => setSubjectId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem 
                      key={subject.subject_id} 
                      value={subject.subject_id.toString()}
                    >
                      {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Trạng thái
              </label>
              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 