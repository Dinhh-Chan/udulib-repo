import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  getDocumentDetail, 
  updateDocument, 
  createDocument,
  deleteDocument,
  Document, 
  DocumentUpdateData,
  getPublicDocumentFullPreview
} from "@/lib/api/documents"
import { getSubjects } from "@/lib/api/subject"
import { Subject } from "@/types/subject"

interface EditDocumentModalProps {
  documentId: number | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditDocumentModal({ documentId, isOpen, onClose, onSuccess }: EditDocumentModalProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subjectId, setSubjectId] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([])
  const [newFile, setNewFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Fetch document details and subjects
  useEffect(() => {
    if (isOpen && documentId) {
      fetchDocumentAndSubjects()
    }
  }, [isOpen, documentId])

  const fetchDocumentAndSubjects = async () => {
    setIsLoading(true)
    try {
      const [docResponse, subjectsResponse] = await Promise.all([
        getDocumentDetail(documentId!),
        getSubjects()
      ])
      
      setDocument(docResponse)
      setSubjects(subjectsResponse)
      
      // Populate form
      setTitle(docResponse.title)
      setDescription(docResponse.description || "")
      setSubjectId(docResponse.subject_id)
      setTags(docResponse.tags || [])
      
      // Generate preview URL
      try {
        const preview = getPublicDocumentFullPreview(documentId!)
        setPreviewUrl(preview)
      } catch (error) {
        console.error("Error generating preview:", error)
      }
      
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Không thể tải thông tin tài liệu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewFile(file)
      // Create preview for new file if it's an image
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl("") // Clear preview for non-image files
      }
    }
  }

  const handleTagsChange = (value: string) => {
    const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setTags(tagArray)
  }

  const handleSave = async () => {
    if (!document) return
    
    // Check if document is already approved
    if (document.status === "approved") {
      toast.error("Không thể chỉnh sửa tài liệu đã được duyệt")
      return
    }

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tài liệu")
      return
    }

    setIsSaving(true)
    try {
      if (newFile) {
        // If user uploaded new file, delete old document and create new one
        await deleteDocument(document.document_id)
        
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("subject_id", subjectId.toString())
        formData.append("file", newFile)
        if (tags.length > 0) {
          formData.append("tags", JSON.stringify(tags))
        }
        
        await createDocument(formData)
        toast.success("Đã tạo lại tài liệu với file mới")
      } else {
        // Just update document info
        const updateData: DocumentUpdateData = {
          title,
          description,
          tags
        }
        
        await updateDocument(document.document_id, updateData)
        toast.success("Cập nhật tài liệu thành công")
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving document:", error)
      toast.error("Không thể lưu thay đổi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    // Clean up
    setDocument(null)
    setTitle("")
    setDescription("")
    setSubjectId(0)
    setTags([])
    setNewFile(null)
    setPreviewUrl("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : document ? (
          <div className="space-y-6">
            {/* Status Warning */}
            {document.status === "approved" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Đã duyệt</Badge>
                  <span className="text-sm text-yellow-800">
                    Tài liệu đã được duyệt, không thể chỉnh sửa
                  </span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={document.status === "approved"}
                    placeholder="Nhập tiêu đề tài liệu"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={document.status === "approved"}
                    placeholder="Nhập mô tả tài liệu"
                    rows={3}
                  />
                </div>
                
                {/* Current file info */}
                <div className="p-3 rounded-lg bg-background border">
                  <h4 className="font-medium mb-2">File hiện tại:</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Tên:</strong> {document.title}</p>
                    <p><strong>Loại:</strong> {document.file_type}</p>
                    <p><strong>Kích thước:</strong> {(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="flex items-center gap-2">
                      <span><strong>Trạng thái:</strong></span>
                      <Badge variant={document.status === "approved" ? "default" : "secondary"}>
                        {document.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="space-y-4">
                <h4 className="font-medium">Xem trước:</h4>
                <div className="border rounded-lg bg-gray-50 overflow-hidden" style={{ height: '500px' }}>
                  {previewUrl ? (
                    <div className="w-full h-full">
                      {newFile && newFile.type.startsWith('image/') ? (
                        <div className="w-full h-full flex items-center justify-center p-6">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-[90%] max-h-[90%] object-contain rounded shadow-sm"
                            style={{ maxWidth: '400px', maxHeight: '400px' }}
                          />
                        </div>
                      ) : (
                        <iframe
                          src={previewUrl}
                          className="w-full h-full border-0"
                          title="Document Preview"
                          style={{ minHeight: '500px' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground p-4">
                      <div>
                        <p className="text-lg mb-2">Không có xem trước</p>
                        <p className="text-sm">
                          {newFile ? "File được chọn không hỗ trợ xem trước" : "Tải file để xem trước"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {newFile && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">File mới được chọn:</h5>
                    <p className="text-sm text-blue-700">{newFile.name}</p>
                    <p className="text-sm text-blue-700">
                      Kích thước: {(newFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !document || document.status === "approved"}
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 