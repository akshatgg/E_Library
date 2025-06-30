"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Eye,
  Star,
  FileText,
  Scale,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Share2,
} from "lucide-react"
import type { EnhancedCaseLaw, CaseLawFilters } from "@/types/enhanced-case-law"

export function EnhancedCaseLawTable() {
  const [filters, setFilters] = useState<CaseLawFilters>({})
  const [sortBy, setSortBy] = useState<keyof EnhancedCaseLaw>("dateOfOrder")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  // Sample enhanced case law data
  const sampleCases: EnhancedCaseLaw[] = [
    {
      id: "1",
      title: "ABC Industries Ltd. vs. Commissioner of Income Tax",
      caseNumber: "ITA No. 1234/Del/2023",
      appealNumber: "CIT(A) 567/Del/2023",
      panNumber: "AABCA1234E",
      gstinNumber: "07AABCA1234E1Z5",
      court: "ITAT",
      courtLocation: "Delhi",
      bench: "Delhi Bench 'A'",
      taxType: "Income_Tax",
      section: "14A",
      subSection: "1",
      rule: "Rule 8D",
      appellant: "ABC Industries Ltd.",
      respondent: "Commissioner of Income Tax",
      dateOfOrder: "2024-01-15",
      dateOfHearing: "2024-01-10",
      decision: "Won",
      groundOfAppeal: ["Disallowance under Section 14A", "Application of Rule 8D", "No exempt income earned"],
      summary:
        "ITAT held that when no exempt income is earned during the year, no disallowance under section 14A can be made. The tribunal deleted the addition made by AO under Rule 8D.",
      keyPoints: [
        "No exempt income = No disallowance under 14A",
        "Rule 8D not applicable when no exempt income",
        "AO failed to establish nexus between expenditure and exempt income",
      ],
      precedentValue: "High",
      tags: ["Section 14A", "Rule 8D", "Exempt Income", "Disallowance"],
      citations: ["(2024) 123 ITD 456 (Delhi)"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
      viewCount: 1250,
      downloadCount: 340,
      isBookmarked: true,
    },
    {
      id: "2",
      title: "XYZ Pvt Ltd vs. Commissioner of GST",
      caseNumber: "Appeal No. 5678/Mum/2023",
      appealNumber: "GST-APP-5678/2023",
      panNumber: "AABCX5678F",
      gstinNumber: "27AABCX5678F1Z8",
      court: "Commissioner_Appeal",
      courtLocation: "Mumbai",
      taxType: "GST",
      section: "16",
      subSection: "2",
      rule: "Rule 36",
      appellant: "XYZ Pvt Ltd",
      respondent: "Commissioner of GST",
      dateOfOrder: "2024-01-12",
      dateOfHearing: "2024-01-08",
      decision: "Partly_Allowed",
      groundOfAppeal: ["Denial of Input Tax Credit", "Late filing of returns", "Supplier compliance"],
      summary:
        "Commissioner (Appeals) held that ITC can be claimed if the supplier has paid tax, even if returns are filed late. Partial relief granted to the appellant.",
      keyPoints: [
        "ITC allowable if supplier paid tax",
        "Late filing doesn't automatically disqualify ITC",
        "Supplier compliance is key factor",
      ],
      precedentValue: "Medium",
      tags: ["ITC", "GST", "Late Filing", "Rule 36"],
      citations: [],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
      viewCount: 890,
      downloadCount: 210,
      isBookmarked: false,
    },
    {
      id: "3",
      title: "Supreme Court ruling on Cash Credits",
      caseNumber: "Civil Appeal No. 9876/2023",
      appealNumber: "SLP-9876/2023",
      panNumber: "AABCS9876G",
      court: "Supreme_Court",
      courtLocation: "New Delhi",
      bench: "Constitutional Bench",
      taxType: "Income_Tax",
      section: "68",
      appellant: "Assessee",
      respondent: "Commissioner of Income Tax",
      dateOfOrder: "2024-01-10",
      dateOfHearing: "2024-01-05",
      decision: "Won",
      groundOfAppeal: ["Cash credit addition", "Burden of proof", "Non-response to summons"],
      summary:
        "Supreme Court clarified that mere non-response to summons cannot be the sole basis for addition under Section 68. Burden of proof principles established.",
      keyPoints: [
        "Non-response to summons not sole ground for addition",
        "AO must establish genuineness independently",
        "Burden of proof clarified",
      ],
      precedentValue: "High",
      tags: ["Cash Credits", "Section 68", "Burden of Proof", "Supreme Court"],
      citations: ["(2024) 15 SCC 123"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
      viewCount: 2100,
      downloadCount: 650,
      isBookmarked: true,
    },
  ]

  // Filter and sort cases
  const filteredAndSortedCases = useMemo(() => {
    const filtered = sampleCases.filter((caseItem) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchMatch =
          caseItem.title.toLowerCase().includes(searchLower) ||
          caseItem.caseNumber.toLowerCase().includes(searchLower) ||
          caseItem.appellant.toLowerCase().includes(searchLower) ||
          caseItem.respondent.toLowerCase().includes(searchLower) ||
          caseItem.summary.toLowerCase().includes(searchLower) ||
          caseItem.section.toLowerCase().includes(searchLower) ||
          caseItem.groundOfAppeal.some((ground) => ground.toLowerCase().includes(searchLower))

        if (!searchMatch) return false
      }

      if (filters.court && caseItem.court !== filters.court) return false
      if (filters.taxType && caseItem.taxType !== filters.taxType) return false
      if (filters.section && !caseItem.section.toLowerCase().includes(filters.section.toLowerCase())) return false
      if (filters.subSection && caseItem.subSection !== filters.subSection) return false
      if (filters.decision && caseItem.decision !== filters.decision) return false
      if (filters.panNumber && caseItem.panNumber !== filters.panNumber) return false
      if (filters.appealNumber && caseItem.appealNumber !== filters.appealNumber) return false
      if (filters.gstinNumber && caseItem.gstinNumber !== filters.gstinNumber) return false

      if (filters.dateFrom && caseItem.dateOfOrder < filters.dateFrom) return false
      if (filters.dateTo && caseItem.dateOfOrder > filters.dateTo) return false

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [sampleCases, filters, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCases.length / pageSize)
  const paginatedCases = filteredAndSortedCases.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (field: keyof EnhancedCaseLaw) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getDecisionBadge = (decision: string) => {
    const colors = {
      Won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Partly_Allowed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Remanded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    }
    return colors[decision as keyof typeof colors] || colors.Dismissed
  }

  const getCourtBadge = (court: string) => {
    const colors = {
      ITO: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Commissioner: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Commissioner_Appeal: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      ITAT: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      High_Court: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Supreme_Court: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    }
    return colors[court as keyof typeof colors] || colors.ITO
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enhanced Case Law Database
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive legal precedents with advanced search criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "table" ? "default" : "outline"} onClick={() => setViewMode("table")}>
            <FileText className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button variant={viewMode === "cards" ? "default" : "outline"} onClick={() => setViewMode("cards")}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Cards
          </Button>
        </div>
      </div>

      {/* Advanced Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* General Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">General Search</label>
              <Input
                placeholder="Search cases, titles, parties..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Court */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Court</label>
              <Select value={filters.court || ""} onValueChange={(value) => setFilters({ ...filters, court: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courts</SelectItem>
                  <SelectItem value="ITO">ITO</SelectItem>
                  <SelectItem value="Commissioner">Commissioner</SelectItem>
                  <SelectItem value="Commissioner_Appeal">Commissioner (Appeal)</SelectItem>
                  <SelectItem value="ITAT">ITAT</SelectItem>
                  <SelectItem value="High_Court">High Court</SelectItem>
                  <SelectItem value="Supreme_Court">Supreme Court</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tax Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Type</label>
              <Select
                value={filters.taxType || ""}
                onValueChange={(value) => setFilters({ ...filters, taxType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Tax Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Income_Tax">Income Tax</SelectItem>
                  <SelectItem value="GST">GST</SelectItem>
                  <SelectItem value="Corporate_Tax">Corporate Tax</SelectItem>
                  <SelectItem value="Service_Tax">Service Tax</SelectItem>
                  <SelectItem value="Customs">Customs</SelectItem>
                  <SelectItem value="Excise">Excise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Input
                placeholder="e.g., 14A, 68, 16"
                value={filters.section || ""}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              />
            </div>

            {/* Sub Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Section</label>
              <Input
                placeholder="e.g., 1, 2, 3"
                value={filters.subSection || ""}
                onChange={(e) => setFilters({ ...filters, subSection: e.target.value })}
              />
            </div>

            {/* Decision */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Decision</label>
              <Select
                value={filters.decision || ""}
                onValueChange={(value) => setFilters({ ...filters, decision: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                  <SelectItem value="Partly_Allowed">Partly Allowed</SelectItem>
                  <SelectItem value="Remanded">Remanded</SelectItem>
                  <SelectItem value="Dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PAN Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">PAN Number</label>
              <Input
                placeholder="e.g., AABCA1234E"
                value={filters.panNumber || ""}
                onChange={(e) => setFilters({ ...filters, panNumber: e.target.value })}
              />
            </div>

            {/* Appeal Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Appeal Number</label>
              <Input
                placeholder="e.g., ITA 1234/Del/2023"
                value={filters.appealNumber || ""}
                onChange={(e) => setFilters({ ...filters, appealNumber: e.target.value })}
              />
            </div>

            {/* GSTIN Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">GSTIN Number</label>
              <Input
                placeholder="e.g., 07AABCA1234E1Z5"
                value={filters.gstinNumber || ""}
                onChange={(e) => setFilters({ ...filters, gstinNumber: e.target.value })}
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>

            {/* Ground of Appeal */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ground of Appeal</label>
              <Input
                placeholder="e.g., Disallowance, ITC denial"
                value={filters.groundOfAppeal || ""}
                onChange={(e) => setFilters({ ...filters, groundOfAppeal: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" onClick={() => setFilters({})} className="text-sm">
              Clear All Filters
            </Button>
            <Badge variant="outline" className="px-3 py-1">
              {filteredAndSortedCases.length} cases found
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Search Results</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">per page</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                      <div className="flex items-center gap-1">
                        Case Title
                        {sortBy === "title" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("court")}>
                      <div className="flex items-center gap-1">
                        Court
                        {sortBy === "court" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("taxType")}>
                      <div className="flex items-center gap-1">
                        Tax Type
                        {sortBy === "taxType" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("decision")}>
                      <div className="flex items-center gap-1">
                        Decision
                        {sortBy === "decision" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("dateOfOrder")}>
                      <div className="flex items-center gap-1">
                        Date
                        {sortBy === "dateOfOrder" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCases.map((caseItem) => (
                    <TableRow key={caseItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{caseItem.title}</div>
                          <div className="text-xs text-gray-500">{caseItem.caseNumber}</div>
                          {caseItem.panNumber && (
                            <Badge variant="outline" className="text-xs">
                              PAN: {caseItem.panNumber}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getCourtBadge(caseItem.court)}>{caseItem.court.replace("_", " ")}</Badge>
                          <div className="text-xs text-gray-500">{caseItem.courtLocation}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{caseItem.taxType.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{caseItem.section}</div>
                          {caseItem.subSection && (
                            <div className="text-xs text-gray-500">Sub: {caseItem.subSection}</div>
                          )}
                          {caseItem.rule && <div className="text-xs text-gray-500">{caseItem.rule}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDecisionBadge(caseItem.decision)}>
                          {caseItem.decision.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{caseItem.dateOfOrder}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Star
                              className={`w-4 h-4 ${caseItem.isBookmarked ? "fill-current text-yellow-500" : ""}`}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedCases.map((caseItem) => (
                <Card key={caseItem.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{caseItem.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getCourtBadge(caseItem.court)}>{caseItem.court.replace("_", " ")}</Badge>
                            <Badge variant="outline">{caseItem.taxType.replace("_", " ")}</Badge>
                            <Badge className={getDecisionBadge(caseItem.decision)}>
                              {caseItem.decision.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Section:</span> {caseItem.section}
                          {caseItem.subSection && ` (${caseItem.subSection})`}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {caseItem.dateOfOrder}
                        </div>
                        <div>
                          <span className="font-medium">Case No:</span> {caseItem.caseNumber}
                        </div>
                        {caseItem.panNumber && (
                          <div>
                            <span className="font-medium">PAN:</span> {caseItem.panNumber}
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{caseItem.summary}</p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Star
                              className={`w-4 h-4 ${caseItem.isBookmarked ? "fill-current text-yellow-500" : ""}`}
                            />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredAndSortedCases.length)} of {filteredAndSortedCases.length}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
