"use client"

import { NotificationsTable } from "@/components/admin/notifications-table"
import { AddNotificationDialog } from "@/components/admin/add-notification-dialog"

export default function NotificationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý thông báo</h2>
        <AddNotificationDialog />
      </div>
      <NotificationsTable />
    </div>
  )
} 