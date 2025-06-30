"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  Download,
  Share2,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Lightbulb,
  Sparkles,
  Scale,
} from "lucide-react"
import { AdvancedFilters } from "./advanced-filters"

export function CaseLawSearchView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    court: "all",
    year: "all",
    status: "all",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({})

  useEffect(() => {
    if (searchQuery.length > 2) {
      const allSuggestions = [
        "Section 14A disallowance cases",
        "Cash credit under Section 68",
        "Input Tax Credit denial",
        "Partnership deed disputes",
        "HUF taxation matters",
        "Capital gains exemption under Section 54",
        "TDS provisions Section 194",
        "Assessment proceedings under Section 143",
        "Penalty under Section 271",
        "Appeal procedures ITAT",
        "GST registration cancellation",
        "ITC reversal mechanism",
        "Place of supply rules",
        "Valuation under GST",
        "Export benefits",
      ]

      const filtered = allSuggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)

      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call with filtering
    setTimeout(() => {
      const mockResults = featuredCases.filter((caseItem) => {
        const matchesQuery =
          caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caseItem.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caseItem.sections.some((section) => section.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || caseItem.category === selectedCategory
        const matchesCourt =
          selectedCourt === "all" || caseItem.court.toLowerCase().includes(selectedCourt.toLowerCase())
        const matchesYear = selectedYear === "all" || caseItem.date.includes(selectedYear)

        return matchesQuery && matchesCategory && matchesCourt && matchesYear
      })

      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }

  const popularSearches = [
    { term: "Section 14A", count: "1,234 cases", trend: "+15%", category: "Income Tax" },
    { term: "Cash Credits", count: "987 cases", trend: "+8%", category: "Income Tax" },
    { term: "ITC Denial", count: "756 cases", trend: "+22%", category: "GST" },
    { term: "Partnership", count: "543 cases", trend: "+5%", category: "Corporate" },
  ]

  const recentTrends = [
    {
      title: "Supreme Court clarifies Section 68 provisions",
      category: "Income Tax",
      date: "2024-01-15",
      court: "Supreme Court",
      impact: "High",
    },
    {
      title: "ITAT ruling on ITC reversal mechanism",
      category: "GST",
      date: "2024-01-14",
      court: "ITAT",
      impact: "Medium",
    },
    {
      title: "High Court judgment on partnership taxation",
      category: "Corporate",
      date: "2024-01-13",
      court: "Delhi High Court",
      impact: "Medium",
    },
  ]

  const featuredCases = [
    {
      title: "Commissioner of Income Tax vs. ABC Industries Ltd.",
      court: "ITAT Delhi",
      date: "2024-01-15",
      category: "ITAT",
      status: "ALLOWED",
      sections: ["Section 14A", "Rule 8D"],
      summary:
        "The case deals with disallowance under section 14A of the Income Tax Act. The ITAT held that when no exempt income is earned during the year, no disallowance under section 14A can be made.",
      caseNumber: "ITA No. 1234/Del/2023",
      impact: "High",
    },
    {
      title: "XYZ Pvt Ltd vs. Commissioner of GST",
      court: "CESTAT Mumbai",
      date: "2024-01-12",
      category: "GST",
      status: "PARTLY ALLOWED",
      sections: ["Section 16", "Rule 36"],
      summary:
        "Appeal against denial of Input Tax Credit. CESTAT held that ITC can be claimed if the supplier has paid tax, even if returns are filed late.",
      caseNumber: "Appeal No. 5678/Mum/2023",
      impact: "Medium",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Case Law Database
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Search and analyze legal precedents from multiple courts</p>
          </div>
        </div>

        <div className="flex justify-center space-x-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-500">Total Cases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">15+</div>
            <div className="text-gray-500">Courts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">Daily</div>
            <div className="text-gray-500">Updates</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Case Law Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cases, sections, keywords, case numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      <Lightbulb className="inline w-3 h-3 mr-2 text-yellow-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleSearch} size="lg" className="px-8">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
                <SelectItem value="GST">GST/CESTAT</SelectItem>
                <SelectItem value="ITAT">ITAT</SelectItem>
                <SelectItem value="HIGH_COURT">High Court</SelectItem>
                <SelectItem value="SUPREME_COURT">Supreme Court</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger>
                <SelectValue placeholder="Court" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courts</SelectItem>
                <SelectItem value="supreme">Supreme Court</SelectItem>
                <SelectItem value="delhi_hc">Delhi High Court</SelectItem>
                <SelectItem value="mumbai_hc">Mumbai High Court</SelectItem>
                <SelectItem value="itat_delhi">ITAT Delhi</SelectItem>
                <SelectItem value="cestat">CESTAT</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setShowAdvancedFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>

            <Button variant="outline">Clear All</Button>
          </div>
          {/* Active Filters Display */}
          {(selectedCategory !== "all" || selectedCourt !== "all" || selectedYear !== "all") && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:bg-gray-200 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCourt !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCourt}
                  <button onClick={() => setSelectedCourt("all")} className="ml-1 hover:bg-gray-200 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedYear}
                  <button onClick={() => setSelectedYear("all")} className="ml-1 hover:bg-gray-200 rounded-full">
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedCourt("all")
                  setSelectedYear("all")
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions and Trends */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Popular Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Popular Searches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{search.term}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{search.count}</span>
                    <Badge variant="outline" className="text-xs">
                      {search.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-green-600">
                  {search.trend}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTrends.map((trend, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm leading-tight">{trend.title}</h4>
                  <Badge
                    variant={trend.impact === "High" ? "default" : "secondary"}
                    className="text-xs ml-2 flex-shrink-0"
                  >
                    {trend.impact}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {trend.category}
                  </Badge>
                  <span>{trend.court}</span>
                  <span>•</span>
                  <span>{trend.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Featured Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Landmark Judgment</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Supreme Court ruling on Section 68 cash credits - Major impact on assessment proceedings
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  Supreme Court
                </Badge>
                <span>Jan 15, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Search Results</TabsTrigger>
          <TabsTrigger value="recent">Recent Cases</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {isSearching ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching case laws...</p>
              </CardContent>
            </Card>
          ) : searchResults.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {searchResults.length} cases for "{searchQuery}"
                </p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="court">Court</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {searchResults.map((caseItem, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{caseItem.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {caseItem.category}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {caseItem.date}
                          </Badge>
                          <Badge
                            className={
                              caseItem.status === "ALLOWED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }
                          >
                            {caseItem.status}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {caseItem.court}
                          </Badge>
                          <Badge
                            variant={caseItem.impact === "High" ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            <TrendingUp className="h-3 w-3" />
                            {caseItem.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{caseItem.summary}</p>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Case Number:</p>
                        <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {caseItem.caseNumber}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Relevant Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.sections.map((section, sectionIndex) => (
                            <Badge key={sectionIndex} variant="secondary" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Quick Actions:</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Similar Cases
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Cite This
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : searchQuery ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No cases found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          ) : (
            // Show featured cases when no search
            featuredCases.map((caseItem, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{caseItem.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {caseItem.category}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {caseItem.date}
                        </Badge>
                        <Badge
                          className={
                            caseItem.status === "ALLOWED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }
                        >
                          {caseItem.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {caseItem.court}
                        </Badge>
                        <Badge
                          variant={caseItem.impact === "High" ? "default" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          <TrendingUp className="h-3 w-3" />
                          {caseItem.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{caseItem.summary}</p>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Case Number:</p>
                      <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {caseItem.caseNumber}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Relevant Sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.sections.map((section, sectionIndex) => (
                          <Badge key={sectionIndex} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">Quick Actions:</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Similar Cases
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Cite This
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Recent cases will be displayed here based on your search history</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Trending cases and legal developments will be shown here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">Your bookmarked cases will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={(filters) => {
          setAdvancedFilters(filters)
          handleSearch()
        }}
      />
    </div>
  )
}
