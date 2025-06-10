"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search } from "lucide-react"
import { MajorImage } from "@/components/ui/major-image"
import Loading from "../loading"
import { fetchMajors, fetchSubjectsByMajorAndYear, fetchDocumentStatsByMajor } from "@/lib/api/document-detail"

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

type DocumentMajorStat = { major_code: string; document_count: number };

export default function DepartmentsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [documents, setDocuments] = useState<DocumentMajorStat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const majorsData = await fetchMajors();
      setMajors(Array.isArray(majorsData) ? majorsData : []);

      const allSubjects: any[] = [];
      for (const major of majorsData) {
        for (let year = 1; year <= 4; year++) {
          const yearSubjects = await fetchSubjectsByMajorAndYear(major.major_id, year);
          if (Array.isArray(yearSubjects)) allSubjects.push(...yearSubjects);
        }
      }
      setSubjects(allSubjects);

      // Lấy tổng số tài liệu theo major
      const docStats = await fetchDocumentStatsByMajor();
      setDocuments(docStats);
    }
    fetchData();
  }, []);

  function getCourseCount(major_id: number) {
    return subjects.filter(sub => sub.major_id === major_id).length
  }
  function getDocumentCount(major_code: string) {
    const stat = documents.find((doc) => doc.major_code === major_code);
    return stat ? stat.document_count : 0;
  }

  function getTagsByMajor(major_id: number) {
    const docs = subjects.filter(sub => sub.major_id === major_id);
    const allTags = docs.flatMap(sub => Array.isArray((sub as any).tags) ? (sub as any).tags : []);
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
                      {/* {getCourseCount(major.major_id)}*/} môn học • {getDocumentCount(major.major_code)} tài liệu 
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
