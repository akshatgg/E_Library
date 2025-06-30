"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminDocuments } from "@/components/admin/admin-documents"
import { AdminCategories } from "@/components/admin/admin-categories"
import { AdminSettings } from "@/components/admin/admin-settings"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import type { UserData } from "@/lib/auth"

interface AdminDashboardProps {
  user: UserData
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("documents")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="documents" className="space-y-4">
        <AdminDocuments />
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <AdminCategories />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <AdminUsers />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <AdminAnalytics />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <AdminSettings />
      </TabsContent>
    </Tabs>
  )
}
