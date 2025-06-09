"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Plus, MessageSquare, Search, Filter, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getForums, getSubjects } from "@/lib/api/forum"
import type { Forum } from "@/types/forum"

interface Subject {
  subject_id: number
  subject_name: string
  subject_code: string
}

export default function ForumPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [forums, setForums] = useState<Forum[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingForums, setIsLoadingForums] = useState(true)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      loadSubjects()
      loadForums() // Load initial forums
    }
  }, [isLoading, isAuthenticated, router])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        performSearch()
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm, isAuthenticated])

  // Instant search when subject changes
  useEffect(() => {
    if (isAuthenticated && subjects.length > 0) {
      performSearch()
    }
  }, [selectedSubjectId, isAuthenticated, subjects])

  const loadSubjects = async () => {
    try {
      const data = await getSubjects()
      setSubjects(data)
    } catch (error) {
      console.error("Error loading subjects:", error)
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  const performSearch = useCallback(async () => {
    try {
      setIsSearching(true)
      const params: any = {}
      if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim()
      if (selectedSubjectId && selectedSubjectId !== "all") params.subject_id = parseInt(selectedSubjectId)
      
      const data = await getForums(params)
      setForums(data)
    } catch (error) {
      console.error("Error loading forums:", error)
    } finally {
      setIsSearching(false)
      setIsLoadingForums(false)
    }
  }, [searchTerm, selectedSubjectId])

  const loadForums = async () => {
    try {
      setIsLoadingForums(true)
      const data = await getForums()
      setForums(data)
    } catch (error) {
      console.error("Error loading forums:", error)
    } finally {
      setIsLoadingForums(false)
    }
  }

  const handleClearFilters = async () => {
    setSearchTerm("")
    setSelectedSubjectId("all")
  }

  if (isLoading || isLoadingForums) {
    return <div>Đang tải...</div>
  }

  const hasActiveFilters = searchTerm.trim() || (selectedSubjectId && selectedSubjectId !== "all")

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

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên môn học, mã môn học hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn học</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                      {subject.subject_name} ({subject.subject_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <div className="flex justify-start sm:justify-end">
                <Button variant="outline" onClick={handleClearFilters} size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Xóa lọc
                </Button>
              </div>
            )}
          </div>

          {/* Loading indicator */}
          {isSearching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              <span>Đang tìm kiếm...</span>
            </div>
          )}
        </div>

        {/* Forums Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forums.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                {hasActiveFilters ? "Không tìm thấy diễn đàn nào phù hợp với bộ lọc" : "Chưa có diễn đàn nào"}
              </div>
            </div>
          ) : (
            forums.map((forum) => (
              <Link key={forum.forum_id} href={`/forum/${forum.forum_id}`}>
                <Card className="h-full hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{forum.subject_name}</CardTitle>
                    {forum.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {forum.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{forum.post_count || 0} bài viết</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
