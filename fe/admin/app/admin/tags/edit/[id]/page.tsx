"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/lib/utils"
import { getTag, updateTag } from "@/lib/api/tag"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditTagPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tagName, setTagName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const tagId = parseInt(params.id, 10)

  useEffect(() => {
    if (isNaN(tagId)) {
      showErrorToast("ID tag không hợp lệ")
      router.push("/admin/tags")
      return
    }
    
    fetchTagDetails()
  }, [tagId])

  const fetchTagDetails = async () => {
    try {
      setIsFetching(true)
      const tag = await getTag(tagId)
      setTagName(tag.tag_name)
    } catch (error) {
      console.error("Error fetching tag details:", error)
      showErrorToast("Không thể tải thông tin tag")
      router.push("/admin/tags")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) {
      showErrorToast("Vui lòng nhập tên tag")
      return
    }

    try {
      setIsLoading(true)
      await updateTag(tagId, { tag_name: tagName })
      router.push("/admin/tags")
    } catch (error) {
      console.error("Error updating tag:", error)
      showErrorToast("Không thể cập nhật tag")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/admin/tags")
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Tag</CardTitle>
          <CardDescription>
            Cập nhật thông tin tag
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {isFetching ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tên tag</Label>
                  <Input
                    id="tag-name"
                    placeholder="Nhập tên tag"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleBack}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 