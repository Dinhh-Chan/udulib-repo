"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, Download, Eye, Calendar, User } from "lucide-react"
import React from "react"
import Loading from "../../../../loading"

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

type Subject = {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  description: string;
  major_id: number;
  year_id: number;
}

type Major = {
  major_id: number;
  major_name: string;
  major_code: string;
  description: string;
}

export default function CoursePage({ params }: { params: Promise<{ slug: string; courseSlug: string }> }) {
  const { slug, courseSlug } = React.use(params);
  const [documents, setDocuments] = useState<Document[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [major, setMajor] = useState<Major | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchData() {
      setLoading(true)
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const subjectRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subjects/${courseSlug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const subjectData = await subjectRes.json();
        setSubject(subjectData);

        const majorRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/majors/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const majorData = await majorRes.json();
        setMajor(majorData);

        const documentsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/documents/public?subject_id=${courseSlug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const documentsData = await documentsRes.json();
        setDocuments(Array.isArray(documentsData.documents) ? documentsData.documents : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug, courseSlug, mounted]);

  if (!mounted) return null;
  if (loading) return <Loading />
  if (!subject || !major) return <div>Không tìm thấy thông tin môn học</div>

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/departments" className="hover:underline">
              Ngành học
            </Link>
            <ChevronRight className="h-4 w-4" />
            {major && (
              <>
                <Link href={`/departments/${major.major_id}`} className="hover:underline">
                  {major.major_name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            {subject && <span>{subject.subject_name}</span>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{subject.subject_name}</h1>
          <p className="text-muted-foreground max-w-3xl">{subject.description}</p>
        </div>

        {/* Remove Tabs and show all documents directly */}
        <div className="flex flex-col gap-4 mt-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.document_id} document={doc} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <CardDescription>{document.description}</CardDescription>
          </div>
          <div className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
            {document.file_type}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatFileSize(document.file_size)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDate(document.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{document.view_count} lượt xem</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{document.download_count} lượt tải</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/documents/${document.document_id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Link>
        </Button>
        <Button size="sm" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Tải xuống
        </Button>
      </CardFooter>
    </Card>
  )
}
