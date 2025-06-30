"use client"

import { useState } from "react"
import { useCaseLawService, type CaseLawSearchFilters } from "@/services/firebase-case-law-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClientCaseLawSearch() {
  const { loading, searchCaseLaws, getFilterOptions } = useCaseLawService()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<CaseLawSearchFilters>({})
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const filterOptions = getFilterOptions()

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const result = await searchCaseLaws({ ...filters, searchQuery })
      setResults(result.caseLaws)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Case Laws</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search by title, section, court..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Results ({results.length})</h2>
          {results.map((caseLaw) => (
            <Card key={caseLaw.id}>
              <CardHeader>
                <CardTitle>{caseLaw.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Court:</span> {caseLaw.court}
                  </p>
                  <p>
                    <span className="font-semibold">Section:</span> {caseLaw.section}
                  </p>
                  <p>
                    <span className="font-semibold">Decision:</span> {caseLaw.decision}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {caseLaw.decisionDate.toLocaleDateString()}
                  </p>
                  <p>{caseLaw.summary}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
