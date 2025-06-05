"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Plus, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getForums } from "@/lib/api/forum"
import type { Forum } from "@/types/forum"

export default function ForumPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forums, setForums] = useState<Forum[]>([])
  const [isLoadingForums, setIsLoadingForums] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      loadForums()
    }
  }, [isLoading, isAuthenticated, router])

  const loadForums = async () => {
    try {
      const data = await getForums()
      setForums(data)
    } catch (error) {
      console.error("Error loading forums:", error)
    } finally {
      setIsLoadingForums(false)
    }
  }

  if (isLoading || isLoadingForums) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Diễn đàn</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Diễn đàn thảo luận</h1>
              <p className="text-muted-foreground">Thảo luận và chia sẻ kiến thức theo từng môn học</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forums.map((forum) => (
            <Link key={forum.forum_id} href={`/forum/${forum.forum_id}`}>
              <Card className="h-full hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{forum.subject_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{forum.post_count} bài viết</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
