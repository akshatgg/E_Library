"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  Grid,
  List,
  Table,
  Download,
  Eye,
  Calendar,
  Building,
  Hash,
  FileText,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { firebaseCaseLawService, type CaseLaw, type SearchFilters } from "@/services/firebase-case-law-service"
import type { DocumentSnapshot } from "firebase/firestore"
import { useSubscription } from "@/lib/subscription-context"
import { SubscriptionPaywall } from "@/components/paywall/subscription-paywall"

type ViewMode = "table" | "cards" | "list"

export function FirebaseCaseLawSearch() {
  const [caseLaws, setCaseLaws] = useState<CaseLaw[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [filterOptions, setFilterOptions] = useState({
    sections: [] as string[],
    subSections: [] as string[],
    courts: [] as string[],
    incomeTypes: [] as string[],
  })
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>()
  const [hasMore, setHasMore] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const { isSubscribed, trialSearchesLeft, totalSearches, showPaywall, setShowPaywall, decrementTrialSearches } =
    useSubscription()

  const { toast } = useToast()

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Initial search
  useEffect(() => {
    handleSearch(true)
  }, [])

  const loadFilterOptions = async () => {
    try {
      const options = await firebaseCaseLawService.getFilterOptions()
      setFilterOptions(options)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load filter options",
        variant: "destructive",
      })
    }
  }

  const handleSearch = useCallback(
    async (reset = false) => {
      // Check if user can perform search
      if (!isSubscribed && reset && trialSearchesLeft <= 0) {
        setShowPaywall(true)
        return
      }

      setLoading(true)
      try {
        // Decrement trial searches for free users on new searches
        if (!isSubscribed && reset) {
          decrementTrialSearches()
        }

        const result = await firebaseCaseLawService.searchCaseLaws(
          searchQuery || undefined,
          filters,
          20,
          reset ? undefined : lastDoc,
          isSubscribed,
        )

        if (reset) {
          setCaseLaws(result.caseLaws)
        } else {
          setCaseLaws((prev) => [...prev, ...result.caseLaws])
        }

        setLastDoc(result.lastDoc)
        setHasMore(result.hasMore)

        // Show paywall after showing results for free users
        if (!isSubscribed && result.premiumCount > 0 && totalSearches >= 1) {
          setTimeout(() => setShowPaywall(true), 2000) // Show paywall after 2 seconds
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [searchQuery, filters, lastDoc, isSubscribed, trialSearchesLeft, decrementTrialSearches, totalSearches, toast],
  )

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      handleSearch(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-semibold">Title</th>
            <th className="text-left p-4 font-semibold">Section</th>
            <th className="text-left p-4 font-semibold">Court</th>
            <th className="text-left p-4 font-semibold">Date</th>
            <th className="text-left p-4 font-semibold">Type</th>
            <th className="text-left p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {caseLaws.map((caseLaw) => (
            <tr key={caseLaw.id} className="border-b hover:bg-muted/30">
              <td className="p-4">
                <div className="font-medium">{caseLaw.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{caseLaw.summary}</div>
              </td>
              <td className="p-4">
                <Badge variant="outline">{caseLaw.section}</Badge>
                {caseLaw.subSection && (
                  <Badge variant="secondary" className="ml-1">
                    {caseLaw.subSection}
                  </Badge>
                )}
              </td>
              <td className="p-4 text-sm">{caseLaw.court}</td>
              <td className="p-4 text-sm">{formatDate(caseLaw.date)}</td>
              <td className="p-4">
                <Badge variant={caseLaw.incomeType === "income-tax" ? "default" : "secondary"}>
                  {caseLaw.incomeType.toUpperCase()}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseLaws.map((caseLaw) => (
        <Card key={caseLaw.id} className="hover:shadow-lg transition-shadow relative">
          {caseLaw.isPremium && !isSubscribed && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg line-clamp-2">{caseLaw.title}</CardTitle>
              <Badge variant={caseLaw.incomeType === "income-tax" ? "default" : "secondary"}>
                {caseLaw.incomeType.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">{caseLaw.summary}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>Section: {caseLaw.section}</span>
                {caseLaw.subSection && (
                  <Badge variant="outline" className="text-xs">
                    {caseLaw.subSection}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="line-clamp-1">{caseLaw.court}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(caseLaw.date)}</span>
              </div>

              {caseLaw.panNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>PAN: {caseLaw.panNumber}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {caseLaw.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {caseLaw.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{caseLaws.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {caseLaws.map((caseLaw) => (
        <Card key={caseLaw.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{caseLaw.title}</h3>
                  <Badge variant={caseLaw.incomeType === "income-tax" ? "default" : "secondary"}>
                    {caseLaw.incomeType.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-muted-foreground line-clamp-2">{caseLaw.summary}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {caseLaw.section}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {caseLaw.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(caseLaw.date)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="space-y-4">
        {/* Trial Indicator for Free Users */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Free Trial</h3>
                <p className="text-blue-700 text-sm">{trialSearchesLeft} free searches remaining</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPaywall(true)}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search case laws, sections, courts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === "Enter" && handleSearch(true)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button onClick={() => handleSearch(true)} disabled={loading}>
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Section</label>
                  <Select
                    value={filters.section || ""}
                    onValueChange={(value) => handleFilterChange("section", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {filterOptions.sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sub-section</label>
                  <Select
                    value={filters.subSection || ""}
                    onValueChange={(value) => handleFilterChange("subSection", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sub-sections</SelectItem>
                      {filterOptions.subSections.map((subSection) => (
                        <SelectItem key={subSection} value={subSection}>
                          {subSection}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Court</label>
                  <Select
                    value={filters.court || ""}
                    onValueChange={(value) => handleFilterChange("court", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courts</SelectItem>
                      {filterOptions.courts.map((court) => (
                        <SelectItem key={court} value={court}>
                          {court}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Income Type</label>
                  <Select
                    value={filters.incomeType || ""}
                    onValueChange={(value) => handleFilterChange("incomeType", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {filterOptions.incomeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">PAN Number</label>
                  <Input
                    placeholder="Enter PAN"
                    value={filters.panNumber || ""}
                    onChange={(e) => handleFilterChange("panNumber", e.target.value || undefined)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">GSTIN</label>
                  <Input
                    placeholder="Enter GSTIN"
                    value={filters.gstin || ""}
                    onChange={(e) => handleFilterChange("gstin", e.target.value || undefined)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date From</label>
                  <DatePicker date={filters.dateFrom} onDateChange={(date) => handleFilterChange("dateFrom", date)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date To</label>
                  <DatePicker date={filters.dateTo} onDateChange={(date) => handleFilterChange("dateTo", date)} />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleSearch(true)} disabled={loading}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{caseLaws.length} case laws found</div>
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "ghost"}
              onClick={() => setViewMode("table")}
              className="h-8 w-8 p-0"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "cards" ? "default" : "ghost"}
              onClick={() => setViewMode("cards")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && caseLaws.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          {viewMode === "table" && renderTableView()}
          {viewMode === "cards" && renderCardsView()}
          {viewMode === "list" && renderListView()}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-6">
              <Button onClick={loadMore} disabled={loading} variant="outline">
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {caseLaws.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No case laws found matching your criteria</div>
            </div>
          )}
        </>
      )}
      <SubscriptionPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        searchesUsed={totalSearches}
        totalSearches={3}
      />
    </div>
  )
}
