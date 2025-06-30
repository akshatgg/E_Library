"use client"

import { useState } from "react"
import { useCaseLawService, type CaseLawSearchFilters, type CaseLaw } from "@/services/case-law-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCreditService, CREDIT_COSTS } from "@/services/credit-service"
import { useAuthContext } from "@/components/auth-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Coins, Search, AlertTriangle, Lock } from "lucide-react"

export function CaseLawSearch() {
  const { searchCaseLaws, getFilterOptions } = useCaseLawService()
  const { user, isAuthenticated } = useAuthContext()
  const { spendCredits, hasEnoughCredits, error: creditError } = useCreditService()

  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<CaseLawSearchFilters>({})
  const [results, setResults] = useState<CaseLaw[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filterOptions = getFilterOptions()
  const searchCost = CREDIT_COSTS.CASE_LAW_SEARCH

  const handleSearch = async () => {
    setError(null)

    if (!isAuthenticated) {
      setError("Please sign in to search case laws")
      return
    }

    // Check if user has enough credits
    if (!hasEnoughCredits(searchCost)) {
      setError(`You need ${searchCost} credit to perform this search. Please add more credits.`)
      return
    }

    setIsSearching(true)

    try {
      // Spend credits for the search
      const creditSuccess = await spendCredits(searchCost, "Case Law Search")

      if (!creditSuccess) {
        throw new Error("Failed to process credits")
      }

      const result = await searchCaseLaws({ ...filters, searchQuery })
      setResults(result.caseLaws)
      setHasSearched(true)
    } catch (error: any) {
      setError(error.message || "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({})
    setResults([])
    setHasSearched(false)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Search Case Laws</span>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-1 text-amber-500" />
              <Badge variant="outline">{searchCost} Credit per Search</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search by title, section, court, summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(value) => setFilters({ ...filters, section: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({ ...filters, court: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Court" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.courts.map((court) => (
                    <SelectItem key={court} value={court}>
                      {court}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setFilters({ ...filters, decision: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Decision" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.decisions.map((decision) => (
                    <SelectItem key={decision} value={decision}>
                      {decision}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(error || creditError) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error || creditError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching || !isAuthenticated} className="flex-1">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Case Laws
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <Lock className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Please sign in to search case laws</p>
              </div>
            )}

            {isAuthenticated && user && user.credits < searchCost && (
              <div className="text-center p-4 border rounded-md bg-amber-50">
                <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-amber-600">
                  You don't have enough credits for this search.
                  <Button variant="link" className="p-0 h-auto text-amber-600 underline">
                    Add Credits
                  </Button>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results ({results.length})</h2>
            <Badge variant="outline">Showing sample data</Badge>
          </div>

          {results.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No case laws found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            results.map((caseLaw) => (
              <Card key={caseLaw.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{caseLaw.title}</CardTitle>
                    <Badge
                      variant={
                        caseLaw.decision === "Allowed"
                          ? "default"
                          : caseLaw.decision === "Dismissed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {caseLaw.decision}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Court:</span> {caseLaw.court}
                      </div>
                      <div>
                        <span className="font-semibold">Section:</span> {caseLaw.section}
                      </div>
                      <div>
                        <span className="font-semibold">Appeal No:</span> {caseLaw.appealNumber}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> {caseLaw.decisionDate.toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold">Ground of Appeal:</span>
                      <p className="text-sm text-gray-600 mt-1">{caseLaw.groundOfAppeal}</p>
                    </div>

                    <div>
                      <span className="font-semibold">Summary:</span>
                      <p className="text-sm text-gray-700 mt-1">{caseLaw.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {caseLaw.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
