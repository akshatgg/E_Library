"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Plus,
  Eye,
  Trash2,
  Calendar,
  User,
  Building,
  FileCheck,
  FileX,
  FolderOpen,
  Settings,
  Archive,
  PaperclipIcon,
} from "lucide-react"
import { toast } from "sonner"

interface Document {
  id: string
  title: string
  type: string
  category: string
  status: "draft" | "pending" | "approved" | "rejected" | "archived"
  createdAt: string
  updatedAt: string
  dueDate?: string
  size: string
  isFavorite: boolean
  tags: string[]
  description: string
  assignedTo: string
  department: string
  priority: "low" | "medium" | "high"
  version: string
  attachments: number
}

const documentTypes = [
  "Partnership Deed",
  "HUF Deed",
  "Reply Letter",
  "Assessment Order",
  "Appeal Letter",
  "Income Tax Return",
  "TDS Certificate",
  "Audit Report",
  "Notice Reply",
  "Agreement",
  "Other"
]

const departments = [
  "Tax Department",
  "Legal Department", 
  "Audit Department",
  "Compliance Department",
  "Documentation Department"
]

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Partnership Deed - ABC & Co",
    type: "Partnership Deed",
    category: "Legal",
    status: "approved",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    dueDate: "2024-02-15",
    size: "2.5 MB",
    isFavorite: true,
    tags: ["partnership", "legal", "business"],
    description: "Partnership deed for ABC & Co establishing terms and conditions",
    assignedTo: "Rajesh Kumar",
    department: "Legal Department",
    priority: "high",
    version: "1.2",
    attachments: 3
  },
  {
    id: "2",
    title: "HUF Deed - Kumar Family",
    type: "HUF Deed",
    category: "Tax",
    status: "pending",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    dueDate: "2024-01-30",
    size: "1.8 MB",
    isFavorite: false,
    tags: ["huf", "family", "tax"],
    description: "Hindu Undivided Family deed for Kumar family tax planning",
    assignedTo: "Priya Sharma",
    department: "Tax Department",
    priority: "medium",
    version: "1.0",
    attachments: 2
  },
  {
    id: "3",
    title: "Reply to Income Tax Notice",
    type: "Reply Letter",
    category: "Tax",
    status: "draft",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    dueDate: "2024-01-25",
    size: "0.9 MB",
    isFavorite: true,
    tags: ["reply", "income-tax", "notice"],
    description: "Response to income tax department notice regarding assessment",
    assignedTo: "Amit Singh",
    department: "Tax Department",
    priority: "high",
    version: "1.1",
    attachments: 1
  },
  {
    id: "4",
    title: "TDS Certificate Q3 2024",
    type: "TDS Certificate",
    category: "Tax",
    status: "approved",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
    size: "1.2 MB",
    isFavorite: false,
    tags: ["tds", "certificate", "quarterly"],
    description: "Third quarter TDS certificate for financial year 2024",
    assignedTo: "Neha Gupta",
    department: "Compliance Department",
    priority: "medium",
    version: "1.0",
    attachments: 0
  },
  {
    id: "5",
    title: "Audit Report - Annual 2023",
    type: "Audit Report",
    category: "Audit",
    status: "archived",
    createdAt: "2023-12-20",
    updatedAt: "2024-01-05",
    size: "5.2 MB",
    isFavorite: false,
    tags: ["audit", "annual", "2023"],
    description: "Annual audit report for the financial year 2023",
    assignedTo: "Dr. Ramesh Patel",
    department: "Audit Department",
    priority: "low",
    version: "2.0",
    attachments: 7
  }
]

export function DocumentsDashboard() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showScanDialog, setShowScanDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: "",
    type: "",
    category: "",
    description: "",
    assignedTo: "",
    department: "",
    priority: "medium",
    status: "draft",
    tags: [],
    dueDate: ""
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesDepartment = departmentFilter === "all" || doc.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment
  })

  const handleCreateDocument = () => {
    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title || "Untitled Document",
      type: newDocument.type || "Other",
      category: newDocument.category || "General",
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      dueDate: newDocument.dueDate,
      size: "0 KB",
      isFavorite: false,
      tags: newDocument.tags || [],
      description: newDocument.description || "",
      assignedTo: newDocument.assignedTo || "Unassigned",
      department: newDocument.department || "General",
      priority: newDocument.priority || "medium",
      version: "1.0",
      attachments: 0
    }
    
    setDocuments(prev => [document, ...prev])
    setShowCreateDialog(false)
    setNewDocument({
      title: "",
      type: "",
      category: "",
      description: "",
      assignedTo: "",
      department: "",
      priority: "medium",
      status: "draft",
      tags: [],
      dueDate: ""
    })
    toast.success("Document created successfully")
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setShowViewDialog(true)
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setNewDocument(document)
    setShowEditDialog(true)
  }

  const handleUpdateDocument = () => {
    if (!selectedDocument) return
    
    const updatedDocument: Document = {
      ...selectedDocument,
      ...newDocument,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    
    setDocuments(prev => prev.map(doc => 
      doc.id === selectedDocument.id ? updatedDocument : doc
    ))
    setShowEditDialog(false)
    setSelectedDocument(null)
    setNewDocument({
      title: "",
      type: "",
      category: "",
      description: "",
      assignedTo: "",
      department: "",
      priority: "medium",
      status: "draft",
      tags: [],
      dueDate: ""
    })
    toast.success("Document updated successfully")
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
    toast.success("Document deleted successfully")
  }

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
          category: "General",
          status: "draft",
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          isFavorite: false,
          tags: ["uploaded"],
          description: `Uploaded file: ${file.name}`,
          assignedTo: "Unassigned",
          department: "Documentation Department",
          priority: "medium",
          version: "1.0",
          attachments: 0
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
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
      case "archived":
        return Archive
      default:
        return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Management System</h1>
                <p className="text-gray-600 mt-1">Manage your legal documents with advanced tools and tracking</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={handleScan} variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-200">
                <Scanner className="h-4 w-4 mr-2" />
                Scan Document
              </Button>
              <Button onClick={() => setShowUploadDialog(true)} variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Documents</p>
                  <p className="text-3xl font-bold">{documents.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Approved</p>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pending</p>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Draft</p>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "draft").length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Favorites</p>
                  <p className="text-3xl font-bold">{documents.filter((d) => d.isFavorite).length}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search and Filters */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents, assignees, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {documentTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredDocuments.length} of {documents.length} documents
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => {
              const StatusIcon = getStatusIcon(document.status)
              return (
                <Card key={document.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md bg-white/90 backdrop-blur-sm hover:bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <StatusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge className={`${getStatusColor(document.status)} text-xs`} variant="outline">
                          {document.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`${getPriorityColor(document.priority)} text-xs`} variant="outline">
                          {document.priority.toUpperCase()}
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

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">{document.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{document.type}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{document.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {document.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{document.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{document.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                      </div>
                      {document.dueDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Due: {new Date(document.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Size: {document.size}</span>
                        {document.attachments > 0 && (
                          <div className="flex items-center gap-1">
                            <PaperclipIcon className="h-3 w-3" />
                            <span>{document.attachments}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleViewDocument(document)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleEditDocument(document)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePrint(document)}>
                        <Printer className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDocuments.map((document) => {
                  const StatusIcon = getStatusIcon(document.status)
                  return (
                    <div key={document.id} className="p-6 hover:bg-gray-50/80 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <StatusIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg truncate">{document.title}</h3>
                              <Badge className={`${getStatusColor(document.status)} text-xs`} variant="outline">
                                {document.status.toUpperCase()}
                              </Badge>
                              <Badge className={`${getPriorityColor(document.priority)} text-xs`} variant="outline">
                                {document.priority.toUpperCase()}
                              </Badge>
                              {document.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{document.type} • {document.department}</p>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{document.description}</p>
                            <div className="flex items-center gap-6 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{document.assignedTo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                              </div>
                              {document.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Due: {new Date(document.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              <span>Size: {document.size}</span>
                              {document.attachments > 0 && (
                                <div className="flex items-center gap-1">
                                  <PaperclipIcon className="h-3 w-3" />
                                  <span>{document.attachments} attachments</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDocument(document)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditDocument(document)}>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Create Document Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Document Title *</Label>
                <Input 
                  placeholder="Enter document title"
                  value={newDocument.title || ""}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Document Type *</Label>
                <Select 
                  value={newDocument.type || ""} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select 
                  value={newDocument.category || ""} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Audit">Audit</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Department</Label>
                <Select 
                  value={newDocument.department || ""} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select 
                  value={newDocument.priority || "medium"} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Assigned To</Label>
                <Input 
                  placeholder="Enter assignee name"
                  value={newDocument.assignedTo || ""}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, assignedTo: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Due Date</Label>
                <Input 
                  type="date"
                  value={newDocument.dueDate || ""}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea 
                placeholder="Enter document description"
                rows={3}
                value={newDocument.description || ""}
                onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Document Type Specific Fields */}
            {newDocument.type === "Partnership Deed" && (
              <Card className="p-4 bg-blue-50">
                <h4 className="font-semibold mb-3">Partnership Deed Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Partnership Name</Label>
                    <Input placeholder="Enter partnership name" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Registration Number</Label>
                    <Input placeholder="Enter registration number" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Number of Partners</Label>
                    <Input type="number" placeholder="Enter number of partners" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Business Nature</Label>
                    <Input placeholder="Enter business nature" />
                  </div>
                </div>
              </Card>
            )}

            {newDocument.type === "HUF Deed" && (
              <Card className="p-4 bg-green-50">
                <h4 className="font-semibold mb-3">HUF Deed Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">HUF Name</Label>
                    <Input placeholder="Enter HUF name" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Karta Name</Label>
                    <Input placeholder="Enter Karta name" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">PAN Number</Label>
                    <Input placeholder="Enter PAN number" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Family Members Count</Label>
                    <Input type="number" placeholder="Enter member count" />
                  </div>
                </div>
              </Card>
            )}

            {newDocument.type === "Reply Letter" && (
              <Card className="p-4 bg-yellow-50">
                <h4 className="font-semibold mb-3">Reply Letter Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Original Notice Number</Label>
                    <Input placeholder="Enter notice number" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Notice Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reply Due Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department Issued</Label>
                    <Input placeholder="Enter issuing department" />
                  </div>
                </div>
              </Card>
            )}

            {newDocument.type === "Income Tax Return" && (
              <Card className="p-4 bg-purple-50">
                <h4 className="font-semibold mb-3">Income Tax Return Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Assessment Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AY" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">AY 2024-25</SelectItem>
                        <SelectItem value="2023-24">AY 2023-24</SelectItem>
                        <SelectItem value="2022-23">AY 2022-23</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ITR Form Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ITR form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ITR-1">ITR-1</SelectItem>
                        <SelectItem value="ITR-2">ITR-2</SelectItem>
                        <SelectItem value="ITR-3">ITR-3</SelectItem>
                        <SelectItem value="ITR-4">ITR-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">PAN Number</Label>
                    <Input placeholder="Enter PAN number" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Filing Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="revised">Revised</SelectItem>
                        <SelectItem value="belated">Belated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            {newDocument.type === "TDS Certificate" && (
              <Card className="p-4 bg-indigo-50">
                <h4 className="font-semibold mb-3">TDS Certificate Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Certificate Number</Label>
                    <Input placeholder="Enter certificate number" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Quarter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Q1">Q1 (Apr-Jun)</SelectItem>
                        <SelectItem value="Q2">Q2 (Jul-Sep)</SelectItem>
                        <SelectItem value="Q3">Q3 (Oct-Dec)</SelectItem>
                        <SelectItem value="Q4">Q4 (Jan-Mar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Financial Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select FY" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">FY 2024-25</SelectItem>
                        <SelectItem value="2023-24">FY 2023-24</SelectItem>
                        <SelectItem value="2022-23">FY 2022-23</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">TDS Amount</Label>
                    <Input type="number" placeholder="Enter TDS amount" />
                  </div>
                </div>
              </Card>
            )}

            {newDocument.type === "Audit Report" && (
              <Card className="p-4 bg-red-50">
                <h4 className="font-semibold mb-3">Audit Report Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Audit Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tax">Tax Audit</SelectItem>
                        <SelectItem value="statutory">Statutory Audit</SelectItem>
                        <SelectItem value="internal">Internal Audit</SelectItem>
                        <SelectItem value="concurrent">Concurrent Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Auditor Name</Label>
                    <Input placeholder="Enter auditor name" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Audit Period From</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Audit Period To</Label>
                    <Input type="date" />
                  </div>
                </div>
              </Card>
            )}

            <div>
              <Label className="text-sm font-medium">Tags (comma separated)</Label>
              <Input 
                placeholder="Enter tags separated by commas"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  setNewDocument(prev => ({ ...prev, tags }))
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateDocument} className="bg-blue-600 hover:bg-blue-700">
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6 py-4">
              {/* Header with Status and Actions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
                  <p className="text-gray-600">{selectedDocument.type} • {selectedDocument.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(selectedDocument.status)} text-sm`}>
                    {selectedDocument.status.toUpperCase()}
                  </Badge>
                  <Badge className={`${getPriorityColor(selectedDocument.priority)} text-sm`}>
                    {selectedDocument.priority.toUpperCase()}
                  </Badge>
                  {selectedDocument.isFavorite && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Category</Label>
                      <p className="text-sm">{selectedDocument.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Department</Label>
                      <p className="text-sm">{selectedDocument.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                      <p className="text-sm">{selectedDocument.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Size</Label>
                      <p className="text-sm">{selectedDocument.size}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created</Label>
                      <p className="text-sm">{new Date(selectedDocument.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Modified</Label>
                      <p className="text-sm">{new Date(selectedDocument.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {selectedDocument.dueDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                        <p className="text-sm">{new Date(selectedDocument.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Version</Label>
                      <p className="text-sm">{selectedDocument.version}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Description */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{selectedDocument.description}</p>
              </Card>

              {/* Tags and Attachments */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Attachments</h3>
                  <div className="flex items-center gap-2">
                    <PaperclipIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedDocument.attachments} file(s) attached</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            <Button onClick={() => { setShowViewDialog(false); handleEditDocument(selectedDocument!) }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Document Title</Label>
                  <Input 
                    value={newDocument.title || selectedDocument.title}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select 
                    value={newDocument.status || selectedDocument.status} 
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select 
                    value={newDocument.category || selectedDocument.category} 
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Tax">Tax</SelectItem>
                      <SelectItem value="Audit">Audit</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Select 
                    value={newDocument.priority || selectedDocument.priority} 
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select 
                    value={newDocument.department || selectedDocument.department} 
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <Input 
                    value={newDocument.assignedTo || selectedDocument.assignedTo}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, assignedTo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <Input 
                    type="date"
                    value={newDocument.dueDate || selectedDocument.dueDate || ""}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea 
                  rows={4}
                  value={newDocument.description || selectedDocument.description}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Tags (comma separated)</Label>
                <Input 
                  value={(newDocument.tags || selectedDocument.tags || []).join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    setNewDocument(prev => ({ ...prev, tags }))
                  }}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateDocument} className="bg-blue-600 hover:bg-blue-700">
              Update Document
            </Button>
          </DialogFooter>
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
