"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"
import Loading from "../loading"

type Major = {
  major_id: number;
  major_name: string;
  major_code: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

type Subject = {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  description: string;
  major_id: number;
  year_id: number;
  created_at?: string;
  updated_at?: string;
}

type Document = {
  document_id: number;
  title: string;
  description: string;
  file_path: string;
  file_size: number;
  file_type: string;
  subject_id: number;
  user_id: number;
  status: string;
  view_count: number;
  download_count: number;
  created_at?: string;
  updated_at?: string;
  subject?: { major_id: number }; 
  tags?: { tag_id: number; tag_name: string; created_at?: string }[];
}

export default function DepartmentsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const majorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/majors`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const majorsData = await majorsRes.json()
      setMajors(Array.isArray(majorsData) ? majorsData : [])

      const subjectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const subjectsData = await subjectsRes.json()
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])

      const documentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/public`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const documentsData = await documentsRes.json()
      setDocuments(Array.isArray(documentsData.documents) ? documentsData.documents : [])

      setLoading(false)
    }
    fetchData()
  }, [])

  function getCourseCount(major_id: number) {
    return subjects.filter(sub => sub.major_id === major_id).length
  }
  function getDocumentCount(major_id: number) {
    return documents.filter(doc => {
      if (doc.subject && doc.subject.major_id) {
        return doc.subject.major_id === major_id
      }
      const subject = subjects.find(sub => sub.subject_id === doc.subject_id)
      return subject?.major_id === major_id
    }).length
  }

  function getTagsByMajor(major_id: number) {
    const docs = documents.filter(doc => {
      if (doc.subject && doc.subject.major_id) {
        return doc.subject.major_id === major_id
      }
      const subject = subjects.find(sub => sub.subject_id === doc.subject_id)
      return subject?.major_id === major_id
    })
    const allTags = docs.flatMap(doc => doc.tags || [])
    const uniqueTags: { tag_id: number, tag_name: string }[] = []
    const seen = new Set()
    for (const tag of allTags) {
      if (!seen.has(tag.tag_id)) {
        uniqueTags.push(tag)
        seen.add(tag.tag_id)
      }
    }
    return uniqueTags
  }

  const filteredMajors = majors.filter((major) =>
    major.major_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Danh sách ngành học</h1>
          <p className="text-muted-foreground">Khám phá tài liệu học tập theo ngành học và môn học</p>
        </div>

        {/* Thanh tìm kiếm ngành học */}
        <div className="relative mb-4">
          <Input
            placeholder="Tìm kiếm ngành học..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMajors.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-8">Không tìm thấy ngành học phù hợp.</div>
          ) : (
            filteredMajors.map((major) => (
              <Card key={major.major_id} className="overflow-hidden">
                <Link href={`/departments/${major.major_id}`}>
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <CardHeader>
                    <CardTitle>{major.major_name}</CardTitle>
                    <CardDescription>{major.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getTagsByMajor(major.major_id).slice(0, 3).map(tag => (
                        <span
                          key={tag.tag_id}
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {tag.tag_name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      {getCourseCount(major.major_id)} môn học • {getDocumentCount(major.major_id)} tài liệu
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
