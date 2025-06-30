"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Calendar, Scale } from "lucide-react"
import { useCaseLawStore } from "@/store/case-law-store"
import { Skeleton } from "@/components/ui/skeleton"

interface CaseLawSearchProps {
  onSearch: (query: string) => void
}

export function CaseLawSearch({ onSearch }: CaseLawSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  const { cases, loading, totalResults, searchCases, loadMoreCases } = useCaseLawStore()

  const handleSearch = () => {
    const filters: any = {}
    if (selectedCategory !== "all") filters.category = selectedCategory
    if (selectedYear !== "all") filters.year = selectedYear

    searchCases(searchQuery, filters)
    onSearch(searchQuery)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      ITAT: "bg-blue-100 text-blue-800",
      GST: "bg-green-100 text-green-800",
      INCOME_TAX: "bg-purple-100 text-purple-800",
      HIGH_COURT: "bg-orange-100 text-orange-800",
      SUPREME_COURT: "bg-red-100 text-red-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getOutcomeColor = (outcome: string) => {
    const colors = {
      allowed: "bg-green-100 text-green-800",
      dismissed: "bg-red-100 text-red-800",
      partly_allowed: "bg-yellow-100 text-yellow-800",
    }
    return colors[outcome as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search case laws, sections, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ITAT">ITAT</SelectItem>
                <SelectItem value="GST">GST/CESTAT</SelectItem>
                <SelectItem value="INCOME_TAX">Income Tax</SelectItem>
                <SelectItem value="HIGH_COURT">High Court</SelectItem>
                <SelectItem value="SUPREME_COURT">Supreme Court</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-32">
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

            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {loading && cases.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cases.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {totalResults} case{totalResults !== 1 ? "s" : ""}
            </p>
          </div>

          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{caseItem.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(caseItem.category)}>{caseItem.category}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(caseItem.dateOfJudgment).toLocaleDateString()}
                      </Badge>
                      <Badge className={getOutcomeColor(caseItem.outcome)}>
                        {caseItem.outcome.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{caseItem.court}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(caseItem.url, "_blank")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {caseItem.pdfUrl && (
                      <Button size="sm" variant="outline" onClick={() => window.open(caseItem.pdfUrl, "_blank")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{caseItem.summary}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Case Number:</p>
                    <p className="text-sm">{caseItem.caseNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Parties:</p>
                    <p className="text-sm">
                      {caseItem.parties.appellant} vs {caseItem.parties.respondent}
                    </p>
                  </div>

                  {caseItem.relevantSections.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Relevant Sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.relevantSections.map((section, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {caseItem.keywords.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.keywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {caseItem.keywords.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{caseItem.keywords.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {caseItem.legalPoints.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Key Legal Points:</p>
                      <ul className="text-sm space-y-1">
                        {caseItem.legalPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More Button */}
          {cases.length < totalResults && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMoreCases} disabled={loading}>
                {loading ? "Loading..." : "Load More Cases"}
              </Button>
            </div>
          )}
        </div>
      ) : searchQuery ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters to find relevant case laws.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search Case Laws</h3>
            <p className="text-gray-600">Enter keywords to search through ITAT, GST, and Income Tax case databases.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
