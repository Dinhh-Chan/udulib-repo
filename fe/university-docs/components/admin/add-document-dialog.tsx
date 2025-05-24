"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { getSubjects } from "@/lib/api/subject"
import { createDocument } from "@/lib/api/documents"
import { getTags, createTag, addDocumentTags, Tag } from "@/lib/api/tags"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
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

interface AddDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddDocumentDialog({ open, onOpenChange, onSuccess }: AddDocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [subjects, setSubjects] = useState<Array<{ subject_id: number; subject_name: string }>>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [openTagCombobox, setOpenTagCombobox] = useState(false)

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects()
      setSubjects(data)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Không thể tải danh sách môn học")
    }
  }

  const fetchTags = async () => {
    try {
      const data = await getTags()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast.error("Không thể tải danh sách tags")
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
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        subject_id: formData.get("subject_id"),
        file: formData.get("file"),
      }

      // Tạo tài liệu mới
      const document = await createDocument(formData)
      if (!document) {
        throw new Error("Không thể tạo tài liệu")
      }

      // Thêm tags cho tài liệu
      if (selectedTags.length > 0) {
        await addDocumentTags(document.document_id, selectedTags)
      }

      toast.success("Tạo tài liệu thành công")
      onOpenChange(false)
      onSuccess?.()
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
        // Tạo tag mới
        const tag = await createTag(newTag)
        if (tag) {
          setTags([...tags, tag])
          setSelectedTags([...selectedTags, tag.tag_name])
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo tài liệu mới</DialogTitle>
          <DialogDescription>
            Thêm tài liệu mới vào hệ thống. Nhấn Lưu khi hoàn tất.
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_id" className="text-right">
                Môn học
              </Label>
              <Select name="subject_id" required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                      {subject.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Tags
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Popover open={openTagCombobox} onOpenChange={setOpenTagCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTagCombobox}
                        className="w-full justify-between"
                      >
                        Chọn tag có sẵn
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Tìm kiếm tag..." />
                        <CommandEmpty>Không tìm thấy tag.</CommandEmpty>
                        <CommandGroup>
                          {tags.map((tag) => (
                            <CommandItem
                              key={tag.tag_id}
                              onSelect={() => handleSelectTag(tag.tag_name)}
                            >
                              {tag.tag_name}
                            </CommandItem>
                          ))}
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 