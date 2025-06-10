"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"
import { MajorImage } from "@/components/ui/major-image"
import Loading from "../loading"
import { fetchMajors, fetchSubjectStatsByMajor, fetchDocumentStatsByMajor } from "@/lib/api/document-detail"

type Major = {
  major_id: number;
  major_name: string;
  major_code: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

type SubjectStat = {
  major_id: number;
  major_name: string;
  major_code: string;
  subject_count: number;
}

type DocumentStat = {
  major_code: string;
  document_count: number;
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
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [documentStats, setDocumentStats] = useState<DocumentStat[]>([])
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

      const subjectStatsData = await fetchSubjectStatsByMajor();
      setSubjectStats(subjectStatsData);
      const docStats = await fetchDocumentStatsByMajor();
      setDocumentStats(docStats);

      setLoading(false)
    }
    fetchData()
  }, [])

  function getCourseCount(major_code: string) {
    const stat = subjectStats.find((s) => s.major_code === major_code);
    return stat ? stat.subject_count : 0;
  }

  function getDocumentCount(major_code: string) {
    const stat = documentStats.find((doc) => doc.major_code === major_code);
    return stat ? stat.document_count : 0;
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
                  <MajorImage 
                    majorId={major.major_id}
                    majorName={major.major_name}
                    className="h-40"
                  />
                  <CardHeader>
                    <CardTitle>{major.major_name}</CardTitle>
                    <CardDescription>{major.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Không còn hiển thị tags */}
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm text-muted-foreground">
                      {getCourseCount(major.major_code)} môn học • {getDocumentCount(major.major_code)} tài liệu
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
