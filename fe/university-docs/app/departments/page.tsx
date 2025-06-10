"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"
import { MajorImage } from "@/components/ui/major-image"
import Loading from "../loading"
import { fetchMajors, fetchSubjectStatsByMajor, fetchDocumentStatsByMajor, Major, SubjectStat, DocumentStat } from "@/lib/api/document-detail"

export default function DepartmentsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [documentStats, setDocumentStats] = useState<DocumentStat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [majorsData, subjectStatsData, docStats] = await Promise.all([
          fetchMajors(),
          fetchSubjectStatsByMajor(),
          fetchDocumentStatsByMajor()
        ]);
        
        setMajors(majorsData);
        setSubjectStats(subjectStatsData);
        setDocumentStats(docStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
