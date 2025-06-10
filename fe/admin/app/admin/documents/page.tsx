"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getDocuments } from "@/lib/api/documents"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddDocumentDialog } from "@/components/admin/add-document-dialog"

function DocumentsContent() {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get("page")) || 1
  const search = searchParams?.get("search") || ""
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const response = await getDocuments({ page, search })
        if (response) {
          setData(response)
        }
      } catch (err) {
        setError(err as Error)
        toast.error("Không thể tải danh sách tài liệu")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [page, search])

  if (error) {
    toast.error("Không thể tải danh sách tài liệu")
    return null
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data?.documents || []}
        isLoading={isLoading}
        pageCount={Math.ceil((data?.total || 0) / (data?.per_page || 20))}
        currentPage={page}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams?.toString())
          params.set("page", newPage.toString())
          window.history.pushState(null, "", `?${params.toString()}`)
        }}
      />
    </div>
  )
}

export default function DocumentsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [key, setKey] = useState(0)
  const searchParams = useSearchParams()
  const search = searchParams?.get("search") || ""

  const handleSuccess = () => {
    setKey((prev) => prev + 1)
    window.location.reload()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài liệu</h1>
        <AddDocumentDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleSuccess}
        >
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm tài liệu
          </Button>
        </AddDocumentDialog>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Danh sách tài liệu</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={search}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString())
                params.set("search", e.target.value)
                params.set("page", "1")
                window.history.pushState(null, "", `?${params.toString()}`)
              }}
              className="w-[300px]"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <DocumentsContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 