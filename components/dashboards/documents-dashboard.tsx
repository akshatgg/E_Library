"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FileText,
  Upload,
  Printer,
  ScanIcon as Scanner,
  Share2,
  Download,
  Edit,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"

interface Document {
  id: string
  title: string
  type: string
  status: "draft" | "pending" | "approved" | "rejected"
  createdAt: string
  size: string
  isFavorite: boolean
  tags: string[]
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Partnership Deed - ABC & Co",
    type: "Partnership Deed",
    status: "approved",
    createdAt: "2024-01-15",
    size: "2.5 MB",
    isFavorite: true,
    tags: ["partnership", "legal", "business"],
  },
  {
    id: "2",
    title: "HUF Deed - Kumar Family",
    type: "HUF Deed",
    status: "pending",
    createdAt: "2024-01-14",
    size: "1.8 MB",
    isFavorite: false,
    tags: ["huf", "family", "tax"],
  },
  {
    id: "3",
    title: "Reply to Income Tax Notice",
    type: "Reply Letter",
    status: "draft",
    createdAt: "2024-01-13",
    size: "0.9 MB",
    isFavorite: true,
    tags: ["reply", "income-tax", "notice"],
  },
]

export function DocumentsDashboard() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showScanDialog, setShowScanDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handlePrint = (document: Document) => {
    setSelectedDocument(document)
    setShowPrintDialog(true)
  }

  const handleScan = () => {
    setShowScanDialog(true)
  }

  const handleShare = (document: Document, platform: string) => {
    toast.success(`Sharing ${document.title} via ${platform}`)
  }

  const handleUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: Document = {
          id: Date.now().toString(),
          title: file.name,
          type: "Uploaded Document",
          status: "draft",
          createdAt: new Date().toISOString().split("T")[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          isFavorite: false,
          tags: ["uploaded"],
        }
        setDocuments((prev) => [newDoc, ...prev])
      })
      toast.success(`${files.length} document(s) uploaded successfully`)
    }
  }

  const toggleFavorite = (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "pending":
        return Clock
      case "rejected":
        return AlertTriangle
      default:
        return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-1">Manage your legal documents with advanced tools</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={handleScan} variant="outline">
                <Scanner className="h-4 w-4 mr-2" />
                Scan Document
              </Button>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {documents.filter((d) => d.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {documents.filter((d) => d.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-3xl font-bold text-pink-600">{documents.filter((d) => d.isFavorite).length}</p>
                </div>
                <Star className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => {
              const StatusIcon = getStatusIcon(document.status)
              return (
                <Card key={document.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <StatusIcon className="h-8 w-8 text-blue-500" />
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(document.status)} variant="secondary">
                          {document.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(document.id)}
                          className="p-1 h-6 w-6"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              document.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{document.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{document.type}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {document.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      <div>Size: {document.size}</div>
                      <div>Created: {document.createdAt}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePrint(document)}>
                        <Printer className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDocuments.map((document) => {
                  const StatusIcon = getStatusIcon(document.status)
                  return (
                    <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <StatusIcon className="h-8 w-8 text-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg">{document.title}</h3>
                              <Badge className={getStatusColor(document.status)} variant="secondary">
                                {document.status}
                              </Badge>
                              {document.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{document.type}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Size: {document.size}</span>
                              <span>Created: {document.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handlePrint(document)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX files up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{selectedDocument.title}</h3>
                <p className="text-sm text-gray-600">{selectedDocument.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Now
                </Button>
                <Button variant="outline" onClick={() => toast.success("Added to print queue")}>
                  Add to Queue
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scan Dialog */}
      <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Scanner className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Scanner Ready</p>
              <p className="text-sm text-gray-500 mb-4">Place document on scanner and click scan</p>
              <Button onClick={() => toast.success("Scanning document...")}>
                <Scanner className="h-4 w-4 mr-2" />
                Start Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
