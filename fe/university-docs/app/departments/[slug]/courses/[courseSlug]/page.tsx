"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, Download, Eye, Calendar, User } from "lucide-react"
import React from "react"
import Loading from "../../../../loading"
import { Document, Subject, Major } from "@/types"
import { fetchSubject, fetchMajor, fetchDocuments } from "@/lib/api/api"
import { DocumentThumbnail } from "@/components/ui/document-thumbnail"

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
        const [subjectData, majorData, documentsData] = await Promise.all([
          fetchSubject(courseSlug),
          fetchMajor(slug),
          fetchDocuments(courseSlug)
        ]);
        
        setSubject(subjectData);
        setMajor(majorData);
        setDocuments(documentsData);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
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
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = bytes / Math.pow(k, i)
    return `${size.toFixed(1)} ${sizes[i]}`
  }

  return (
    <Link href={`/documents/${document.document_id}`}>
      <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-80">
        {/* Thumbnail Section */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <DocumentThumbnail
            documentId={document.document_id}
            title={document.title}
            fileType={document.file_type}
            size="large"
            className="w-full h-full !w-full !h-full"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges ở góc trên */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
              {document.file_type?.split('/')[1]?.toUpperCase() || document.file_type?.toUpperCase() || 'UNKNOWN'}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
              {formatFileSize(document.file_size)}
            </span>
          </div>
          
          {/* Subject badge ở góc trái */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 dark:bg-gray-900/90 dark:text-white backdrop-blur-sm">
              {document.subject?.subject_name?.slice(0, 15)}...
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 h-40 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
            {document.title}
          </h3>
          
          {/* Description */}
          <div className="flex-1 mb-2">
            <p className="text-sm text-muted-foreground line-clamp-3 overflow-hidden" 
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 3,
                 WebkitBoxOrient: 'vertical',
                 textOverflow: 'ellipsis'
               }}>
              {document.description}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
            {document.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.tag_id}
                className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full font-medium"
              >
                {tag.tag_name}
              </span>
            ))}
            {document.tags && document.tags.length > 2 && (
              <span className="text-xs text-muted-foreground self-center">+{document.tags.length - 2}</span>
            )}
          </div>
          
          {/* Stats footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{document.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{document.download_count}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground/70 truncate max-w-[100px]">
              {document.user?.full_name}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
