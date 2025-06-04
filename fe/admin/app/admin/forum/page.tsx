"use client"

import { ForumsTable } from "@/components/admin/forums-table"

export default function ForumPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý diễn đàn</h2>
      </div>
      <ForumsTable />
    </div>
  )
}
