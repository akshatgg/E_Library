"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Upload, Plus, BarChart3, Users, Calendar, TrendingUp } from "lucide-react"
import { DocumentGrid } from "./document-grid"
import { FileUpload } from "./file-upload"
import type { LegalDocument } from "@/models/legal-document"
import type { UploadResult } from "@/services/file-upload-service"

export function LegalDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showFormDialog, setShowFormDialog] = useState(false)

  const handleUploadComplete = (results: UploadResult[]) => {
    console.log("Upload completed:", results)
    setShowUploadDialog(false)
    // Refresh document grid
  }

  const handleEditDocument = (document: LegalDocument) => {
    setSelectedDocument(document)
    setShowFormDialog(true)
  }

  const stats = [
    {
      title: "Total Documents",
      value: "1,234",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Cases",
      value: "89",
      change: "+5%",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Clients",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "This Month",
      value: "45",
      change: "+23%",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Legal Document Management</h1>
            <p className="text-gray-600 mt-1">Manage your legal documents, forms, and case laws</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Legal Documents</DialogTitle>
                </DialogHeader>
                <FileUpload
                  onUploadComplete={handleUploadComplete}
                  onUploadError={(error) => console.error("Upload error:", error)}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Legal Document</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <p className="text-gray-600">Select a form type to create a new legal document.</p>
                  {/* Form selection will be implemented */}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="forms">Legal Forms</TabsTrigger>
            <TabsTrigger value="cases">Case Laws</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentGrid
                  onEditDocument={handleEditDocument}
                  onDeleteDocument={(id) => console.log("Delete document:", id)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Legal Form Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "Partnership Deed",
                    "Family Settlement Deed",
                    "Sale Deed",
                    "Credit Note",
                    "Debit Note",
                    "HUF Deed",
                    "Reply Letter",
                    "Cash Flow Statement",
                  ].map((form, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium">{form}</h3>
                            <p className="text-sm text-gray-500">Create new {form.toLowerCase()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Law Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Case law search and management will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
