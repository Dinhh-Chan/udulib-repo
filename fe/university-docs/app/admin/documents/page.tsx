"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentsTable } from "@/components/admin/documents-table"
import { AddDocumentDialog } from "@/components/admin/add-document-dialog"

export default function DocumentsPage() {
  const [key, setKey] = useState(0)

  const handleSuccess = () => {
    setKey((prev) => prev + 1)
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tài liệu</CardTitle>
          <AddDocumentDialog onSuccess={handleSuccess}>
            <Button>Thêm tài liệu</Button>
          </AddDocumentDialog>
        </CardHeader>
        <CardContent>
          <DocumentsTable key={key} />
        </CardContent>
      </Card>
    </div>
  )
} 