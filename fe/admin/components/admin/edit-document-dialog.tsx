"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/client"
import { Document } from "@/app/admin/documents/columns"
import { cn } from "@/lib/utils"

interface Tag {
  tag_id: number;
  tag_name: string;
  created_at?: string;
}

interface Subject {
  subject_id: number;
  subject_name: string;
  subject_code: string;
}

interface EditDocumentDialogProps {
  documentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditDocumentDialog({ documentId, open, onOpenChange, onSuccess }: EditDocumentDialogProps) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<string>("")
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState("")
  const [subjectId, setSubjectId] = useState<number | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [existingTags, setExistingTags] = useState<Tag[]>([])
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [subjectPopoverOpen, setSubjectPopoverOpen] = useState(false)

  useEffect(() => {
    if (open && documentId) {
      fetchDocument()
      fetchSubjects()
      fetchExistingTags()
    }
  }, [open, documentId])

  const fetchDocument = async () => {
    try {
      setIsFetching(true)
      const response = await apiClient.get<Document>(`/documents/${documentId}`)
      setDocument(response)
      setTitle(response.title)
      setDescription(response.description || "")
      setStatus(response.status)
      setTags(response.tags || [])
      setSubjectId(response.subject_id || null)
    } catch (error) {
      toast.error("Không thể tải thông tin tài liệu")
    } finally {
      setIsFetching(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await apiClient.get<Subject[]>('/subjects')
      setSubjects(Array.isArray(response) ? response : [])
    } catch (error) {
      toast.error("Không thể tải danh sách môn học")
    }
  }

  const fetchExistingTags = async () => {
    try {
      const response = await apiClient.get<Tag[]>('/tags')
      setExistingTags(Array.isArray(response) ? response : [])
    } catch (error) {
      toast.error("Không thể tải danh sách tag")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Cập nhật thông tin tài liệu
      await apiClient.put(`/documents/${documentId}`, {
        title,
        description: description || undefined,
        status,
        subject_id: subjectId
      })
      
      // Cập nhật tags
      if (document?.tags) {
        // Xác định tags mới để thêm
        const currentTagNames = tags.map(tag => tag.tag_name);
        const originalTagNames = document.tags.map(tag => 
          typeof tag === 'string' ? tag : tag.tag_name
        );
        
        const tagsToAdd = currentTagNames.filter(tagName => !originalTagNames.includes(tagName));
        if (tagsToAdd.length > 0) {
          try {
            await apiClient.post(`/documents/${documentId}/tags`, tagsToAdd);
          } catch (error) {
            // Lỗi đã được xử lý bởi ApiClient
          }
        }
        
        // Xác định tags cũ để xóa
        const tagsToRemove = originalTagNames.filter(tagName => !currentTagNames.includes(tagName));
        
        // Xử lý tuần tự từng tag để tránh lỗi
        for (const tagName of tagsToRemove) {
          try {
            await apiClient.delete(`/documents/${documentId}/tags/${encodeURIComponent(tagName)}`);
          } catch (error) {
            // Lỗi đã được xử lý bởi ApiClient
          }
        }
      }
      
      toast.success("Cập nhật tài liệu thành công")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      // Không cần làm gì vì lỗi đã được xử lý bởi ApiClient
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (!newTag) return;
    
    const tagName = newTag.trim();
    if (tagName === "") return;
    
    // Kiểm tra tag đã tồn tại chưa
    const tagExists = tags.some(tag => 
      typeof tag === 'string' 
        ? tag === tagName 
        : tag.tag_name === tagName
    );
    
    if (!tagExists) {
      // Thêm tag mới với cấu trúc tạm thời
      setTags([...tags, { tag_id: Date.now(), tag_name: tagName }]);
      setNewTag("");
    } else {
      toast.error("Tag này đã tồn tại");
    }
  }

  const handleSelectExistingTag = (tag: Tag) => {
    // Kiểm tra tag đã được thêm chưa
    const tagExists = tags.some(t => 
      (typeof t === 'string' ? t === tag.tag_name : t.tag_id === tag.tag_id)
    );
    
    if (!tagExists) {
      setTags([...tags, tag]);
    } else {
      toast.error("Tag này đã được thêm");
    }
    
    setTagPopoverOpen(false);
  }

  const handleRemoveTag = (tagIdOrName: number | string) => {
    setTags(tags.filter(tag => {
      if (typeof tag === 'string') {
        return tag !== tagIdOrName;
      }
      return tag.tag_id !== tagIdOrName;
    }));
  }

  if (isFetching) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đang tải...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!document) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lỗi</DialogTitle>
            <DialogDescription>
              Không thể tải thông tin tài liệu
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của tài liệu này
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Môn học</Label>
              <Popover open={subjectPopoverOpen} onOpenChange={setSubjectPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={subjectPopoverOpen}
                    className="justify-between"
                    disabled={isLoading}
                  >
                    {subjectId
                      ? subjects.find((subject) => subject.subject_id === subjectId)?.subject_name
                      : "Chọn môn học..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm môn học..." />
                    <CommandEmpty>Không tìm thấy môn học.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {subjects.map((subject) => (
                          <CommandItem
                            key={subject.subject_id}
                            value={subject.subject_id.toString()}
                            onSelect={() => {
                              setSubjectId(subject.subject_id)
                              setSubjectPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                subjectId === subject.subject_id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {subject.subject_name} ({subject.subject_code})
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge 
                    key={typeof tag === 'string' ? tag : tag.tag_id} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {typeof tag === 'string' ? tag : tag.tag_name}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(typeof tag === 'string' ? tag : tag.tag_id)}
                      className="text-xs rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10"
                      disabled={isLoading}
                    >
                      Chọn tag có sẵn
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px]">
                    <Command>
                      <CommandInput placeholder="Tìm kiếm tag..." />
                      <CommandEmpty>Không tìm thấy tag.</CommandEmpty>
                      <CommandGroup heading="Tag có sẵn">
                        <CommandList>
                          {existingTags.map((tag) => (
                            <CommandItem
                              key={tag.tag_id}
                              value={tag.tag_name}
                              onSelect={() => handleSelectExistingTag(tag)}
                            >
                              {tag.tag_name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                <div className="flex flex-1 gap-2">
                  <Input
                    id="newTag"
                    placeholder="Tạo tag mới"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddTag} 
                    disabled={!newTag || isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 