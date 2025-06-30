"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Edit, Trash2, Search } from "lucide-react"
import { type LegalDocument, DocumentType, LegalCategory, DocumentStatus } from "@/models/legal-document"
import { documentController } from "@/controllers/document-controller"

interface DocumentGridProps {
  onEditDocument?: (document: LegalDocument) => void
  onDeleteDocument?: (documentId: string) => void
}

export function DocumentGrid({ onEditDocument, onDeleteDocument }: DocumentGridProps) {
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<LegalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<LegalCategory | "all">("all")
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all")

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchQuery, typeFilter, categoryFilter, statusFilter])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await documentController.getAllDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error("Error loading documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          doc.description?.toLowerCase().includes(query),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((doc) => doc.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    setFilteredDocuments(filtered)
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await documentController.deleteDocument(documentId)
        await loadDocuments()
        onDeleteDocument?.(documentId)
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    }
  }

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return "bg-green-100 text-green-800"
      case DocumentStatus.PENDING_REVIEW:
        return "bg-yellow-100 text-yellow-800"
      case DocumentStatus.REJECTED:
        return "bg-red-100 text-red-800"
      case DocumentStatus.DRAFT:
        return "bg-gray-100 text-gray-800"
      case DocumentStatus.FILED:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DocumentType | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(DocumentType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as LegalCategory | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(LegalCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {category.replace(/_/g, " ").toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DocumentStatus | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(DocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || typeFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by uploading your first document"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2">{document.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {document.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {document.category.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                    {document.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>

                {document.description && <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>}

                <div className="text-xs text-gray-500 space-y-1">
                  <div>Size: {formatFileSize(document.fileSize)}</div>
                  <div>Modified: {new Date(document.lastModified).toLocaleDateString()}</div>
                  {document.caseNumber && <div>Case: {document.caseNumber}</div>}
                </div>

                {document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(document.fileUrl, "_blank")}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEditDocument?.(document)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDocument(document.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
