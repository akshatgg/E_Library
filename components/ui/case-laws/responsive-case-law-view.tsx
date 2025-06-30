"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Search,
  Filter,
  Download,
  Eye,
  Star,
  FileText,
  Scale,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Share2,
  Calendar,
  Gavel,
  Building,
  CreditCard,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Menu,
  Grid,
  List,
} from "lucide-react"

interface CaseLawData {
  id: string
  title: string
  caseNumber: string
  appealNumber?: string
  panNumber?: string
  gstinNumber?: string
  court: "ITO" | "Commissioner" | "Commissioner_Appeal" | "ITAT" | "High_Court" | "Supreme_Court"
  courtLocation: string
  taxType: "Income_Tax" | "GST" | "Corporate_Tax" | "Service_Tax" | "Customs" | "Excise"
  section: string
  subSection?: string
  rule?: string
  appellant: string
  respondent: string
  dateOfOrder: string
  dateOfHearing?: string
  decision: "Won" | "Lost" | "Partly_Allowed" | "Remanded" | "Dismissed"
  groundOfAppeal: string[]
  summary: string
  keyPoints: string[]
  precedentValue: "High" | "Medium" | "Low"
  tags: string[]
  citations: string[]
  viewCount: number
  downloadCount: number
  isBookmarked: boolean
}

export function ResponsiveCaseLawView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    court: "",
    taxType: "",
    section: "",
    subSection: "",
    decision: "",
    dateFrom: "",
    dateTo: "",
    panNumber: "",
    appealNumber: "",
    gstinNumber: "",
    groundOfAppeal: "",
  })
  const [sortBy, setSortBy] = useState<keyof CaseLawData>("dateOfOrder")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [viewMode, setViewMode] = useState<"table" | "cards" | "list">("cards")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Enhanced sample data with all required fields
  const caseLawData: CaseLawData[] = [
    {
      id: "1",
      title: "ABC Industries Ltd. vs. Commissioner of Income Tax",
      caseNumber: "ITA No. 1234/Del/2023",
      appealNumber: "CIT(A) 567/Del/2023",
      panNumber: "AABCA1234E",
      gstinNumber: "07AABCA1234E1Z5",
      court: "ITAT",
      courtLocation: "Delhi",
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
      viewCount: 2100,
      downloadCount: 650,
      isBookmarked: true,
    },
    {
      id: "4",
      title: "DEF Corporation vs. ITO Ward 1(2)",
      caseNumber: "ITO/Ward-1(2)/2023-24",
      panNumber: "AABCD1234F",
      court: "ITO",
      courtLocation: "Chennai",
      taxType: "Income_Tax",
      section: "143",
      subSection: "3",
      appellant: "DEF Corporation",
      respondent: "ITO Ward 1(2)",
      dateOfOrder: "2024-01-08",
      decision: "Lost",
      groundOfAppeal: ["Assessment order", "Addition of unexplained investment"],
      summary:
        "ITO confirmed the addition made for unexplained investment. Assessee failed to provide satisfactory explanation for the source of investment.",
      keyPoints: [
        "Burden on assessee to explain source",
        "Unsatisfactory explanation leads to addition",
        "Assessment order upheld",
      ],
      precedentValue: "Low",
      tags: ["Assessment", "Unexplained Investment", "Section 143"],
      citations: [],
      viewCount: 450,
      downloadCount: 120,
      isBookmarked: false,
    },
    {
      id: "5",
      title: "GHI Enterprises vs. Commissioner of Customs",
      caseNumber: "Customs Appeal No. 3456/2023",
      appealNumber: "CUST-3456/2023",
      panNumber: "AABCG3456H",
      court: "High_Court",
      courtLocation: "Kolkata",
      taxType: "Customs",
      section: "28",
      appellant: "GHI Enterprises",
      respondent: "Commissioner of Customs",
      dateOfOrder: "2024-01-05",
      decision: "Remanded",
      groundOfAppeal: ["Valuation dispute", "Classification of goods", "Duty liability"],
      summary:
        "High Court remanded the matter back to Commissioner for fresh consideration of valuation and classification issues.",
      keyPoints: [
        "Valuation needs fresh consideration",
        "Classification to be re-examined",
        "Matter remanded for proper adjudication",
      ],
      precedentValue: "Medium",
      tags: ["Customs", "Valuation", "Classification", "Remand"],
      citations: [],
      viewCount: 680,
      downloadCount: 180,
      isBookmarked: false,
    },
  ]

  // Filter and sort logic
  const filteredAndSortedCases = useMemo(() => {
    const filtered = caseLawData.filter((caseItem) => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const searchMatch =
          caseItem.title.toLowerCase().includes(searchLower) ||
          caseItem.caseNumber.toLowerCase().includes(searchLower) ||
          caseItem.appellant.toLowerCase().includes(searchLower) ||
          caseItem.respondent.toLowerCase().includes(searchLower) ||
          caseItem.summary.toLowerCase().includes(searchLower) ||
          caseItem.section.toLowerCase().includes(searchLower) ||
          caseItem.groundOfAppeal.some((ground) => ground.toLowerCase().includes(searchLower)) ||
          (caseItem.panNumber && caseItem.panNumber.toLowerCase().includes(searchLower)) ||
          (caseItem.gstinNumber && caseItem.gstinNumber.toLowerCase().includes(searchLower))

        if (!searchMatch) return false
      }

      // Apply filters
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
      if (
        filters.groundOfAppeal &&
        !caseItem.groundOfAppeal.some((ground) => ground.toLowerCase().includes(filters.groundOfAppeal.toLowerCase()))
      )
        return false

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
  }, [caseLawData, searchQuery, filters, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCases.length / pageSize)
  const paginatedCases = filteredAndSortedCases.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Auto-adjust view mode based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode("list")
      setPageSize(5)
    } else if (isTablet) {
      setViewMode("cards")
      setPageSize(8)
    } else {
      setPageSize(10)
    }
  }, [isMobile, isTablet])

  const handleSort = (field: keyof CaseLawData) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "Won":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Lost":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "Partly_Allowed":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "Remanded":
        return <RotateCcw className="w-4 h-4 text-blue-500" />
      case "Dismissed":
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
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

  const clearAllFilters = () => {
    setFilters({
      court: "",
      taxType: "",
      section: "",
      subSection: "",
      decision: "",
      dateFrom: "",
      dateTo: "",
      panNumber: "",
      appealNumber: "",
      gstinNumber: "",
      groundOfAppeal: "",
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Case Law Database
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Comprehensive legal precedents with advanced search
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{caseLawData.length}+</div>
              <div className="text-sm text-gray-500">Total Cases</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">6</div>
              <div className="text-sm text-gray-500">Court Levels</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">Daily</div>
              <div className="text-sm text-gray-500">Updates</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600">AI</div>
              <div className="text-sm text-gray-500">Powered</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Advanced Search & Filters
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="sm:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-8 w-8 p-0"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cases, sections, PAN, GSTIN, case numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filters Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${!showFilters && isMobile ? "hidden" : ""}`}
            >
              {/* Court Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Court
                </label>
                <Select value={filters.court} onValueChange={(value) => setFilters({ ...filters, court: value })}>
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

              {/* Tax Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tax Type
                </label>
                <Select value={filters.taxType} onValueChange={(value) => setFilters({ ...filters, taxType: value })}>
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

              {/* Section Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Section
                </label>
                <Input
                  placeholder="e.g., 14A, 68, 16"
                  value={filters.section}
                  onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                />
              </div>

              {/* Sub Section Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Section</label>
                <Input
                  placeholder="e.g., 1, 2, 3"
                  value={filters.subSection}
                  onChange={(e) => setFilters({ ...filters, subSection: e.target.value })}
                />
              </div>

              {/* Decision Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Decision
                </label>
                <Select value={filters.decision} onValueChange={(value) => setFilters({ ...filters, decision: value })}>
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

              {/* PAN Number Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  PAN Number
                </label>
                <Input
                  placeholder="e.g., AABCA1234E"
                  value={filters.panNumber}
                  onChange={(e) => setFilters({ ...filters, panNumber: e.target.value })}
                />
              </div>

              {/* Appeal Number Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Appeal Number</label>
                <Input
                  placeholder="e.g., ITA 1234/Del/2023"
                  value={filters.appealNumber}
                  onChange={(e) => setFilters({ ...filters, appealNumber: e.target.value })}
                />
              </div>

              {/* GSTIN Number Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GSTIN Number</label>
                <Input
                  placeholder="e.g., 07AABCA1234E1Z5"
                  value={filters.gstinNumber}
                  onChange={(e) => setFilters({ ...filters, gstinNumber: e.target.value })}
                />
              </div>

              {/* Date From Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>

              {/* Ground of Appeal Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ground of Appeal</label>
                <Input
                  placeholder="e.g., Disallowance, ITC denial"
                  value={filters.groundOfAppeal}
                  onChange={(e) => setFilters({ ...filters, groundOfAppeal: e.target.value })}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-wrap gap-2 items-center justify-between pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={clearAllFilters} size="sm">
                  Clear All Filters
                </Button>
                <Badge variant="outline" className="px-3 py-1">
                  {filteredAndSortedCases.length} cases found
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>Search Results</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof CaseLawData)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateOfOrder">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="court">Court</SelectItem>
                    <SelectItem value="decision">Decision</SelectItem>
                    <SelectItem value="viewCount">Popularity</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading cases...</p>
              </div>
            ) : paginatedCases.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg">No cases found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                {/* Table View */}
                {viewMode === "table" && !isMobile && (
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
                          <TableHead>Tax Type</TableHead>
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
                                <Badge className={getCourtBadge(caseItem.court)}>
                                  {caseItem.court.replace("_", " ")}
                                </Badge>
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
                              <div className="flex items-center gap-2">
                                {getDecisionIcon(caseItem.decision)}
                                <Badge className={getDecisionBadge(caseItem.decision)}>
                                  {caseItem.decision.replace("_", " ")}
                                </Badge>
                              </div>
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
                )}

                {/* Cards View */}
                {viewMode === "cards" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedCases.map((caseItem) => (
                      <Card
                        key={caseItem.id}
                        className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{caseItem.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge className={getCourtBadge(caseItem.court)}>
                                    {caseItem.court.replace("_", " ")}
                                  </Badge>
                                  <Badge variant="outline">{caseItem.taxType.replace("_", " ")}</Badge>
                                  <div className="flex items-center gap-1">
                                    {getDecisionIcon(caseItem.decision)}
                                    <Badge className={getDecisionBadge(caseItem.decision)}>
                                      {caseItem.decision.replace("_", " ")}
                                    </Badge>
                                  </div>
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
                              <div className="col-span-2">
                                <span className="font-medium">Case No:</span> {caseItem.caseNumber}
                              </div>
                              {caseItem.panNumber && (
                                <div>
                                  <span className="font-medium">PAN:</span> {caseItem.panNumber}
                                </div>
                              )}
                              {caseItem.gstinNumber && (
                                <div>
                                  <span className="font-medium">GSTIN:</span> {caseItem.gstinNumber}
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
                                  PDF
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

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {paginatedCases.map((caseItem) => (
                      <Card key={caseItem.id} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-base mb-1">{caseItem.title}</h3>
                                <div className="flex items-center gap-1 ml-2">
                                  {getDecisionIcon(caseItem.decision)}
                                  <Badge className={getDecisionBadge(caseItem.decision)} size="sm">
                                    {caseItem.decision.replace("_", " ")}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={getCourtBadge(caseItem.court)} size="sm">
                                  {caseItem.court.replace("_", " ")}
                                </Badge>
                                <Badge variant="outline" size="sm">
                                  {caseItem.taxType.replace("_", " ")}
                                </Badge>
                                <Badge variant="outline" size="sm">
                                  Sec {caseItem.section}
                                </Badge>
                                <Badge variant="outline" size="sm">
                                  {caseItem.dateOfOrder}
                                </Badge>
                              </div>

                              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                                {caseItem.summary}
                              </p>

                              <div className="text-xs text-gray-500">
                                Case No: {caseItem.caseNumber}
                                {caseItem.panNumber && ` • PAN: ${caseItem.panNumber}`}
                                {caseItem.gstinNumber && ` • GSTIN: ${caseItem.gstinNumber}`}
                              </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Star
                                  className={`w-4 h-4 ${caseItem.isBookmarked ? "fill-current text-yellow-500" : ""}`}
                                />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 pt-6 border-t">
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
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <Button
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
