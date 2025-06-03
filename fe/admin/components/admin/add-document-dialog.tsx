"use client"

import { useState, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { apiClientAxios as apiClient } from "@/lib/api/client"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getSubjects } from "@/lib/api/subject"
import { getTags, createTag } from "@/lib/api/tags"

interface AddDocumentDialogProps {
  children?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Subject {
  subject_id: number
  subject_name: string
}

interface Tag {
  tag_id: number
  tag_name: string
}

export function AddDocumentDialog({ children, open, onOpenChange, onSuccess }: AddDocumentDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [openTagCombobox, setOpenTagCombobox] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [searchTagTerm, setSearchTagTerm] = useState("")

  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true)
      const response = await getSubjects()
      setSubjects(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Không thể tải danh sách môn học")
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  const fetchTags = async () => {
    try {
      setIsLoadingTags(true)
      const response = await getTags()
      setTags(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast.error("Không thể tải danh sách tags")
    } finally {
      setIsLoadingTags(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchSubjects()
      fetchTags()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Thêm tags vào formData
      if (selectedTags.length > 0) {
        formData.append('tags', JSON.stringify(selectedTags))
      }

      // Tạo tài liệu mới
      const response = await apiClient.post("/documents", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success("Tạo tài liệu thành công")
      onOpenChange(false)
      
      // Gọi callback onSuccess nếu có
      if (onSuccess) {
        onSuccess()
      } else {
        // Làm mới trang nếu không có callback
        router.refresh()
      }

      // Sau 500ms, làm mới toàn bộ trang để đảm bảo dữ liệu được cập nhật
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Error creating document:", error)
      toast.error("Không thể tạo tài liệu mới")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      // Kiểm tra xem tag đã tồn tại chưa
      const existingTag = tags.find(t => t.tag_name.toLowerCase() === newTag.toLowerCase())
      if (existingTag) {
        if (!selectedTags.includes(existingTag.tag_name)) {
          setSelectedTags([...selectedTags, existingTag.tag_name])
        }
      } else {
        // Tạo tag mới trên server
        const createdTag = await createTag(newTag)
        if (createdTag) {
          // Thêm vào danh sách tags đã chọn
          setSelectedTags([...selectedTags, newTag])
          // Cập nhật danh sách tags
          await fetchTags()
        }
      }
      setNewTag("")
    } catch (error) {
      console.error("Error adding tag:", error)
    }
  }

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName))
  }

  const handleSelectTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
    setOpenTagCombobox(false)
  }

  const filteredTags = searchTagTerm 
    ? tags.filter(tag => tag.tag_name.toLowerCase().includes(searchTagTerm.toLowerCase()))
    : tags

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cho tài liệu mới. Nhấn Lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tên tài liệu
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                placeholder="Nhập tên tài liệu"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                placeholder="Nhập mô tả tài liệu"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_id" className="text-right">
                Môn học
              </Label>
              <div className="col-span-3">
                <Select name="subject_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSubjects ? "Đang tải..." : "Chọn môn học"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSubjects ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Đang tải danh sách môn học...</span>
                      </div>
                    ) : subjects.length === 0 ? (
                      <SelectItem value="empty" disabled>Không có môn học nào</SelectItem>
                    ) : (
                      subjects.map((subject) => (
                        <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                          {subject.subject_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                className="col-span-3"
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Tags
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Popover open={openTagCombobox} onOpenChange={setOpenTagCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTagCombobox}
                        className="w-full justify-between"
                      >
                        {isLoadingTags ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Đang tải tags...
                          </>
                        ) : (
                          <>
                            Chọn tag có sẵn
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Tìm kiếm tag..." 
                          value={searchTagTerm}
                          onValueChange={setSearchTagTerm}
                        />
                        <CommandEmpty>Không tìm thấy tag.</CommandEmpty>
                        <CommandGroup>
                          {isLoadingTags ? (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Đang tải...</span>
                            </div>
                          ) : filteredTags.length === 0 ? (
                            <CommandItem disabled>Không có tag nào phù hợp</CommandItem>
                          ) : (
                            filteredTags.map((tag) => (
                              <CommandItem
                                key={tag.tag_id}
                                onSelect={() => handleSelectTag(tag.tag_name)}
                                className="flex items-center"
                              >
                                <span className={selectedTags.includes(tag.tag_name) ? "font-bold" : ""}>
                                  {tag.tag_name}
                                </span>
                                {selectedTags.includes(tag.tag_name) && (
                                  <Badge className="ml-auto" variant="outline">Đã chọn</Badge>
                                )}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập tag mới"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select name="status" defaultValue="pending">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : "Tạo tài liệu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 