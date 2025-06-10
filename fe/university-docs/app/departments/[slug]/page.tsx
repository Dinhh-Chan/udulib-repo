"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText } from "lucide-react"
import React from "react"
import Loading from "../../loading"
import { Major, Subject } from "@/types"
import { fetchMajors, fetchSubjects, fetchDocumentCount } from "@/lib/api/api"

export default function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [major, setMajor] = useState<Major | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [documentCounts, setDocumentCounts] = useState<{ [subject_id: number]: number }>({})

  useEffect(() => {
    let majorIdFromUrl = Number(slug)
    let foundMajor: Major | null = null

    async function fetchMajor() {
      const data = await fetchMajors()
      if (!isNaN(majorIdFromUrl)) {
        foundMajor = data.find((m: Major) => m.major_id === majorIdFromUrl) || null
      } else {
        foundMajor = data.find((m: Major) => m.slug === slug) || null
      }
      setMajor(foundMajor)
      if (foundMajor) {
        localStorage.setItem('selected_major_id', foundMajor.major_id.toString())
      }
    }

    if (!isNaN(majorIdFromUrl)) {
      fetchMajor()
    } else {
      const storedId = localStorage.getItem('selected_major_id')
      if (storedId) {
        majorIdFromUrl = Number(storedId)
        fetchMajor()
      } else {
        fetchMajor()
      }
    }
  }, [slug])

  useEffect(() => {
    if (!selectedYear || !major) return
    setLoading(true)
    
    async function loadSubjectsAndDocuments() {
      if (!major) return
      const subjectsData = await fetchSubjects(major.major_id, selectedYear)
      setSubjects(Array.isArray(subjectsData) ? subjectsData : [])
      
      if (Array.isArray(subjectsData)) {
        const counts: { [subject_id: number]: number } = {}
        await Promise.all(
          subjectsData.map(async (subject: Subject) => {
            counts[subject.subject_id] = await fetchDocumentCount(subject.subject_id)
          })
        )
        setDocumentCounts(counts)
      }
      setLoading(false)
    }

    loadSubjectsAndDocuments()
  }, [selectedYear, major])

  if (!major) return <Loading />
  if (!major) return <Loading />

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/departments" className="hover:underline">
              Ngành học
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{major.major_name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{major.major_name}</h1>
          <p className="text-muted-foreground max-w-3xl">{major.description}</p>
        </div>

        <Tabs value={selectedYear.toString()} onValueChange={v => setSelectedYear(Number(v))} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="1">Năm 1</TabsTrigger>
            <TabsTrigger value="2">Năm 2</TabsTrigger>
            <TabsTrigger value="3">Năm 3</TabsTrigger>
            <TabsTrigger value="4">Năm 4</TabsTrigger>
          </TabsList>
          {[1,2,3,4].map(year => (
            <TabsContent key={year} value={year.toString()} className="mt-6">
              {loading ? (
                <Loading />
                <Loading />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map(subject => (
                    <Card key={subject.subject_id}>
                      <CardHeader>
                        <CardTitle>{subject.subject_name}</CardTitle>
                        <CardDescription>{subject.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{documentCounts[subject.subject_id] || 0} tài liệu</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/departments/${slug}/courses/${subject.subject_id}`}>Xem tài liệu</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
