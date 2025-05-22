"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Major {
  id: number
  name: string
  code: string
  courses: number
  documents: number
}

interface DeleteMajorDialogProps {
  major: Major
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMajorDialog({ major, open, onOpenChange }: DeleteMajorDialogProps) {
  const handleDelete = () => {
    // Xử lý xóa ngành học
    console.log("Xóa ngành học:", major)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa ngành học "{major.name}" và không thể hoàn tác. Tất cả môn học và tài liệu liên quan sẽ
            bị ảnh hưởng.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
