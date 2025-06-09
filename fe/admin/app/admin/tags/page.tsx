"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TagsTable } from "@/components/admin/tags-table"
import { AddTagDialog } from "@/components/admin/add-tag-dialog"
import { DocumentTagManager } from "@/components/admin/document-tag-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TagsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [key, setKey] = useState(0)
  const [activeTab, setActiveTab] = useState("tags")

  const handleSuccess = () => {
    // Force refresh the tags table
    setKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Tag</h1>
          <p className="text-muted-foreground">
            Quản lý các tag và mối quan hệ với tài liệu
          </p>
        </div>
        {activeTab === "tags" && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm Tag
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tags">Danh sách Tag</TabsTrigger>
          <TabsTrigger value="document-tags">Tài liệu theo Tag</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Tag</CardTitle>
              <CardDescription>
                Tất cả các tag hiện có trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagsTable key={key} onReload={handleSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="document-tags">
          <DocumentTagManager />
        </TabsContent>
      </Tabs>

      <AddTagDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
} 