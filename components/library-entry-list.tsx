"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  X,
  FileText,
  Trash2,
  Edit,
  ArrowUpDown,
  Download,
  Printer,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { EditEntryModal } from "@/components/edit-entry-modal"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { userbackAxios } from "@/lib/axios-config"
import { type Category, CategoryBadge, getCategoryColorClass } from "@/components/category-management"
import { getCaseLawByCategory } from "@/lib/api-service"

interface LibraryEntry {
  id: string
  pan: string
  section: string
  sub_section: string
  subject: string
  ao_order: string
  itat_no: string
  rsa_no: string
  bench: string
  appeal_no: string
  appellant: string
  respondent: string
  appeal_type: string
  appeal_filed_by: string
  order_result: string
  tribunal_order_date: string
  assessment_year: string
  judgment: string
  conclusion: string
  download: string
  upload: string
  category_id?: string | null
  createdAt: string
  updatedAt: string
  pdfUrl?: string
}

interface LibraryEntryListProps {
  onViewPdf: (url: string) => void
}

export function LibraryEntryList({ onViewPdf }: LibraryEntryListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEntry, setSelectedEntry] = useState<LibraryEntry | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [categories, setCategories] = useState<Category[]>([])

  const [filters, setFilters] = useState({
    section: "",
    assessment_year: "",
    order_result: "",
    bench: "",
    category_id: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  const entriesPerPage = 5

  useEffect(() => {
    fetchLibraryEntries()
    fetchCategories()
  }, [currentPage])

  const fetchCategories = () => {
    // Fetch categories from localStorage
    const storedCategories = localStorage.getItem("elibrary_categories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      // Initialize with default categories if none exist
      const defaultCategories = [
        { id: "1", name: "Tax Law", color: "blue", description: "Tax-related legal documents" },
        { id: "2", name: "Corporate Law", color: "green", description: "Corporate legal documents" },
        { id: "3", name: "Criminal Law", color: "red", description: "Criminal case documents" },
      ]
      localStorage.setItem("elibrary_categories", JSON.stringify(defaultCategories))
      setCategories(defaultCategories)
    }
  }

  const fetchLibraryEntries = async () => {
    try {
      setIsLoading(true)

      // For demo purposes, we'll use localStorage instead of the API
      const storedEntries = localStorage.getItem("elibrary_entries")
      let entries = []

      if (storedEntries) {
        entries = JSON.parse(storedEntries)
      } else {
        // If no entries in localStorage, try to fetch from API
        try {
          const { data } = await userbackAxios.get("/library/getAll")
          if (data && data.allLibrary) {
            // Add some random category_ids to the entries for demo purposes
            entries = data.allLibrary.map((entry: any, index: number) => ({
              ...entry,
              category_id: ((index % 3) + 1).toString(), // Assign categories 1, 2, 3 in rotation
            }))
          }
        } catch (apiError) {
          console.error("API Error, using mock data:", apiError)
          // If API fails, use mock data
          entries = Array.from({ length: 10 }).map((_, i) => ({
            id: `mock-${i}`,
            pan: `PAN${i}`,
            section: `Section ${(i % 3) + 1}`,
            sub_section: `Sub-section ${i}`,
            subject: `Subject ${i}`,
            ao_order: `AO Order ${i}`,
            itat_no: `ITAT-${i}`,
            rsa_no: `RSA-${i}`,
            bench: `Bench ${(i % 4) + 1}`,
            appeal_no: `APP-${i}`,
            appellant: `Appellant ${i}`,
            respondent: `Respondent ${i}`,
            order_result: `Result ${i % 3 ? "Allowed" : i % 2 ? "Dismissed" : "Partially Allowed"}`,
            tribunal_order_date: new Date(2023, i % 12, (i % 28) + 1).toISOString().split("T")[0],
            assessment_year: `20${20 + (i % 5)}-${21 + (i % 5)}`,
            judgment: `This is a mock judgment for entry ${i}. It contains details about the case and the decision made by the court.`,
            conclusion: `Conclusion for entry ${i}`,
            download: "",
            upload: "",
            category_id: ((i % 3) + 1).toString(), // Assign categories 1, 2, 3 in rotation
            createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
            updatedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
          }))
        }

        // Store in localStorage for future use
        localStorage.setItem("elibrary_entries", JSON.stringify(entries))
      }

      // Fetch case law from API for each category
      try {
        const taxLawResults = await getCaseLawByCategory("Tax Law")
        const corporateLawResults = await getCaseLawByCategory("Corporate Law")
        const criminalLawResults = await getCaseLawByCategory("Criminal Law")

        // Convert API results to library entries format
        const apiEntries = [...taxLawResults, ...corporateLawResults, ...criminalLawResults].map((result) => {
          let categoryId = "1" // Default to Tax Law

          if (result.documentType.toLowerCase().includes("corporate")) {
            categoryId = "2" // Corporate Law
          } else if (result.documentType.toLowerCase().includes("criminal")) {
            categoryId = "3" // Criminal Law
          }

          return {
            id: result.id,
            pan: "",
            section: result.documentType.includes("ITAT") ? "Income Tax Act" : "",
            sub_section: "",
            subject: result.title,
            ao_order: result.documentType === "AO Order" ? "Yes" : "No",
            itat_no: result.documentType === "ITAT" ? result.id : "",
            rsa_no: "",
            bench: result.court.split(" ").pop() || "",
            appeal_no: "",
            appellant: result.title.split(" vs ")[0] || "",
            respondent: result.title.split(" vs ")[1] || "",
            appeal_type: "",
            appeal_filed_by: "",
            order_result: "",
            tribunal_order_date: result.date,
            assessment_year: "",
            judgment: result.snippet,
            conclusion: "",
            download: "",
            upload: "",
            pdfUrl: result.pdfUrl,
            category_id: categoryId,
            createdAt: result.date,
            updatedAt: result.date,
          }
        })

        // Combine local entries with API entries
        entries = [...entries, ...apiEntries]

        // Update localStorage with combined entries
        localStorage.setItem("elibrary_entries", JSON.stringify(entries))
      } catch (error) {
        console.error("Error fetching case law:", error)
      }

      setLibraryEntries(entries)
      setTotalPages(Math.ceil(entries.length / entriesPerPage))
    } catch (error) {
      console.error("Error fetching library entries:", error)
      toast({
        title: "Error",
        description: "Failed to fetch library entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEntry = (entry: LibraryEntry) => {
    setSelectedEntry(entry)
    setIsEditModalOpen(true)
  }

  const handleDeleteEntry = (id: string) => {
    setEntryToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!entryToDelete) return

    try {
      // For demo purposes, we'll use localStorage instead of the API
      const entries = JSON.parse(localStorage.getItem("elibrary_entries") || "[]")
      const updatedEntries = entries.filter((entry: any) => entry.id !== entryToDelete)
      localStorage.setItem("elibrary_entries", JSON.stringify(updatedEntries))

      // In a real implementation, we would use the API
      // await userbackAxios.delete(`/library/delete/${entryToDelete}`)

      toast({
        title: "Success",
        description: "Library entry deleted successfully",
      })

      fetchLibraryEntries()
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete library entry",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      section: "",
      assessment_year: "",
      order_result: "",
      bench: "",
      category_id: "",
    })
    setSearchQuery("")
  }

  const getUniqueValues = (field: keyof LibraryEntry) => {
    if (!libraryEntries || libraryEntries.length === 0) return []

    const values = libraryEntries
      .map((item) => item[field])
      .filter((value) => value && typeof value === "string" && value.trim() !== "")

    return [...new Set(values)].sort()
  }

  const getCategoryById = (id: string | null | undefined) => {
    if (!id) return null
    return categories.find((category) => category.id === id) || null
  }

  const filteredEntries = libraryEntries
    .filter((entry) => {
      // Apply dropdown filters
      if (filters.section && entry.section !== filters.section) return false
      if (filters.assessment_year && entry.assessment_year !== filters.assessment_year) return false
      if (filters.order_result && entry.order_result !== filters.order_result) return false
      if (filters.bench && entry.bench !== filters.bench) return false
      if (filters.category_id && entry.category_id !== filters.category_id) return false

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          (entry.appellant && entry.appellant.toLowerCase().includes(query)) ||
          (entry.respondent && entry.respondent.toLowerCase().includes(query)) ||
          (entry.appeal_no && entry.appeal_no.toLowerCase().includes(query)) ||
          (entry.section && entry.section.toLowerCase().includes(query)) ||
          (entry.judgment && entry.judgment.toLowerCase().includes(query))
        )
      }

      return true
    })
    .sort((a, b) => {
      if (!sortField) return 0

      const fieldA = a[sortField as keyof LibraryEntry] || ""
      const fieldB = b[sortField as keyof LibraryEntry] || ""

      if (sortDirection === "asc") {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0
      }
    })

  // Pagination
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)

  const actualTotalPages = Math.ceil(filteredEntries.length / entriesPerPage)

  const handleViewPdf = (entry: LibraryEntry) => {
    // Use the download, upload, or pdfUrl, whichever is available
    const pdfUrl = entry.pdfUrl || entry.download || entry.upload
    if (pdfUrl) {
      onViewPdf(pdfUrl)
    } else {
      toast({
        title: "No PDF Available",
        description: "This entry doesn't have an associated PDF document",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by appellant, respondent, appeal no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              {(filters.section ||
                filters.assessment_year ||
                filters.order_result ||
                filters.bench ||
                filters.category_id) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <Select value={filters.category_id} onValueChange={(value) => handleFilterChange("category_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div className={`mr-2 w-2 h-2 rounded-full ${getCategoryColorClass(category.color)}`} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Section</label>
                <Select value={filters.section} onValueChange={(value) => handleFilterChange("section", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {getUniqueValues("section").map((section, index) => (
                      <SelectItem key={index} value={section as string}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Assessment Year</label>
                <Select
                  value={filters.assessment_year}
                  onValueChange={(value) => handleFilterChange("assessment_year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {getUniqueValues("assessment_year").map((year, index) => (
                      <SelectItem key={index} value={year as string}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Order Result</label>
                <Select
                  value={filters.order_result}
                  onValueChange={(value) => handleFilterChange("order_result", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    {getUniqueValues("order_result").map((result, index) => (
                      <SelectItem key={index} value={result as string}>
                        {result}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Bench</label>
                <Select value={filters.bench} onValueChange={(value) => handleFilterChange("bench", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Benches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Benches</SelectItem>
                    {getUniqueValues("bench").map((bench, index) => (
                      <SelectItem key={index} value={bench as string}>
                        {bench}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters */}
            {(filters.section ||
              filters.assessment_year ||
              filters.order_result ||
              filters.bench ||
              filters.category_id) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.category_id && (
                  <Badge variant="outline" className="bg-primary/5 gap-1">
                    Category: {getCategoryById(filters.category_id)?.name || filters.category_id}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange("category_id", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.section && (
                  <Badge variant="outline" className="bg-primary/5 gap-1">
                    Section: {filters.section}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange("section", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.assessment_year && (
                  <Badge variant="outline" className="bg-primary/5 gap-1">
                    Year: {filters.assessment_year}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange("assessment_year", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.order_result && (
                  <Badge variant="outline" className="bg-primary/5 gap-1">
                    Result: {filters.order_result}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange("order_result", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.bench && (
                  <Badge variant="outline" className="bg-primary/5 gap-1">
                    Bench: {filters.bench}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleFilterChange("bench", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sorting controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("updatedAt")}
            className={sortField === "updatedAt" ? "bg-primary/10" : ""}
          >
            Date
            <ArrowUpDown
              className={`ml-2 h-3 w-3 ${sortField === "updatedAt" ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("appellant")}
            className={sortField === "appellant" ? "bg-primary/10" : ""}
          >
            Appellant
            <ArrowUpDown
              className={`ml-2 h-3 w-3 ${sortField === "appellant" ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("section")}
            className={sortField === "section" ? "bg-primary/10" : ""}
          >
            Section
            <ArrowUpDown
              className={`ml-2 h-3 w-3 ${sortField === "section" ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("assessment_year")}
            className={sortField === "assessment_year" ? "bg-primary/10" : ""}
          >
            Assessment Year
            <ArrowUpDown
              className={`ml-2 h-3 w-3 ${sortField === "assessment_year" ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("category_id")}
            className={sortField === "category_id" ? "bg-primary/10" : ""}
          >
            Category
            <ArrowUpDown
              className={`ml-2 h-3 w-3 ${sortField === "category_id" ? "text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedEntries.length > 0 ? (
          <div className="space-y-4">
            {paginatedEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-shadow dark:bg-gray-700">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {entry.appellant} vs {entry.respondent}
                        </h3>
                        {entry.category_id && (
                          <div className="mt-1">
                            {getCategoryById(entry.category_id) && (
                              <CategoryBadge category={getCategoryById(entry.category_id)!} />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPdf(entry)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEntry(entry)}
                          className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/30"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {entry.appeal_no && (
                        <div className="bg-slate-50 p-2 rounded text-sm dark:bg-gray-600">
                          <span className="font-medium text-primary dark:text-primary-foreground">Appeal No:</span>{" "}
                          {entry.appeal_no}
                        </div>
                      )}
                      {entry.section && (
                        <div className="bg-slate-50 p-2 rounded text-sm dark:bg-gray-600">
                          <span className="font-medium text-primary dark:text-primary-foreground">Section:</span>{" "}
                          {entry.section}
                        </div>
                      )}
                      {entry.assessment_year && (
                        <div className="bg-slate-50 p-2 rounded text-sm dark:bg-gray-600">
                          <span className="font-medium text-primary dark:text-primary-foreground">
                            Assessment Year:
                          </span>{" "}
                          {entry.assessment_year}
                        </div>
                      )}
                      {entry.order_result && (
                        <div className="bg-slate-50 p-2 rounded text-sm dark:bg-gray-600">
                          <span className="font-medium text-primary dark:text-primary-foreground">Result:</span>{" "}
                          {entry.order_result}
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-md text-sm dark:bg-gray-600">
                      {entry.judgment
                        ? entry.judgment.substring(0, 200) + (entry.judgment.length > 200 ? "..." : "")
                        : "No judgment available"}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.updatedAt).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-1">
                        {(entry.download || entry.pdfUrl) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={() => window.open(entry.download || entry.pdfUrl, "_blank")}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                          onClick={() => {
                            if (entry.pdfUrl || entry.download) {
                              const printWindow = window.open(entry.pdfUrl || entry.download, "_blank")
                              if (printWindow) {
                                printWindow.addEventListener("load", () => {
                                  printWindow.print()
                                })
                              } else {
                                toast({
                                  title: "Popup Blocked",
                                  description: "Please allow popups to print this document",
                                  variant: "destructive",
                                })
                              }
                            } else {
                              toast({
                                title: "No PDF Available",
                                description: "This entry doesn't have an associated PDF document to print",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          Print
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            toast({
                              title: "Link Copied",
                              description: "Link has been copied to clipboard",
                            })
                          }}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border dark:bg-gray-700">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4 dark:bg-gray-600">
              <Search className="h-6 w-6 text-slate-400 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No entries found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery ||
              filters.section ||
              filters.assessment_year ||
              filters.order_result ||
              filters.bench ||
              filters.category_id
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no library entries yet. Add your first entry using the 'Add New Entry' tab."}
            </p>
            {(searchQuery ||
              filters.section ||
              filters.assessment_year ||
              filters.order_result ||
              filters.bench ||
              filters.category_id) && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {actualTotalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center text-sm">
                <span className="font-medium">{currentPage}</span>
                <span className="mx-2 text-muted-foreground">of</span>
                <span className="font-medium">{actualTotalPages}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, actualTotalPages))}
                disabled={currentPage === actualTotalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedEntry && (
        <EditEntryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          entry={selectedEntry}
          onUpdate={fetchLibraryEntries}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
