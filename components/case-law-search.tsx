"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BackButton } from "@/components/ui/back-button"
import { CaseLawDatabase, type CaseLaw } from "@/lib/case-law-database"
import { DailyScheduler } from "@/lib/daily-scheduler"
import {
  Search,
  Calendar,
  Scale,
  FileText,
  ExternalLink,
  Download,
  Loader2,
  Database,
  RefreshCw,
  Clock,
  Wifi,
} from "lucide-react"
import { toast } from "sonner"

export function CaseLawSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<CaseLaw[]>([])
  const [loading, setLoading] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [totalCases, setTotalCases] = useState(0)
  const [filters, setFilters] = useState({
    court: "",
    year: "",
    source: "",
    section: "",
  })

  useEffect(() => {
    // Initialize database and scheduler
    const initializeSystem = async () => {
      try {
        const cases = await CaseLawDatabase.getAllCases()
        setTotalCases(cases.length)
        setLastUpdate(new Date(localStorage.getItem("lastScrapingUpdate") || Date.now()))

        // Start daily scheduler
        DailyScheduler.start()

        // Listen for scraping updates
        window.addEventListener("scrapingUpdate", handleScrapingUpdate)

        return () => {
          window.removeEventListener("scrapingUpdate", handleScrapingUpdate)
        }
      } catch (error) {
        console.error("Failed to initialize system:", error)
      }
    }

    initializeSystem()
  }, [])

  const handleScrapingUpdate = (event: any) => {
    const { totalCases: newTotal, lastUpdate: newUpdate } = event.detail
    setTotalCases(newTotal)
    setLastUpdate(new Date(newUpdate))
    toast.success(`Database updated! ${newTotal} cases available`)
  }

  const handleManualScrape = async () => {
    setScraping(true)
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manual: true }),
      })

      const data = await response.json()

      if (data.success) {
        setTotalCases(data.totalCases)
        setLastUpdate(new Date())
        toast.success(`Scraped ${data.newCases} new cases!`)
      } else {
        toast.error("Scraping failed")
      }
    } catch (error) {
      toast.error("Scraping failed")
      console.error("Scraping error:", error)
    } finally {
      setScraping(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setLoading(true)
    try {
      const searchResults = await CaseLawDatabase.searchCases(query, filters)
      setResults(searchResults)
      toast.success(`Found ${searchResults.length} cases`)
    } catch (error) {
      toast.error("Search failed. Please try again.")
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return "Never"
    const now = new Date()
    const diff = now.getTime() - lastUpdate.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    }
    return `${minutes}m ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton href="/" />
              <div>
                <h1 className="text-2xl font-bold">Case Law Search</h1>
                <p className="text-sm text-muted-foreground">E-Library by iTax Easy - Real-time Legal Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Live Scraping
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Database className="h-3 w-3 mr-1" />
                {totalCases} Cases
              </Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeSinceUpdate()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5" />
                  <span>Real-time Updates</span>
                </CardTitle>
                <CardDescription>
                  Automatic daily scraping from ITAT, Supreme Court, High Courts, and IndianKanoon
                </CardDescription>
              </div>
              <Button
                onClick={handleManualScrape}
                disabled={scraping}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span>{scraping ? "Scraping..." : "Manual Update"}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ITAT: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Supreme Court: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>High Courts: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>IndianKanoon: Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Legal Database</span>
            </CardTitle>
            <CardDescription>Search through {totalCases} real-time updated legal cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Search */}
            <div className="flex space-x-2">
              <Input
                placeholder="Enter case name, section, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Court"
                value={filters.court}
                onChange={(e) => setFilters({ ...filters, court: e.target.value })}
              />
              <Input
                placeholder="Year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              />
              <Input
                placeholder="Source"
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              />
              <Input
                placeholder="Section"
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Results ({results.length} cases found)</h2>
              <Badge variant="secondary">Real-time Database</Badge>
            </div>

            {results.map((caseData) => (
              <Card key={caseData.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{caseData.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center">
                          <Scale className="h-4 w-4 mr-1" />
                          {caseData.court}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(caseData.date).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">{caseData.source}</Badge>
                        {caseData.isNew && (
                          <Badge variant="default" className="bg-green-600">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{caseData.summary}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium">Parties:</span>
                        <span className="text-sm">
                          {caseData.appellant} vs {caseData.respondent}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Citation:</span>
                        <Badge variant="secondary">{caseData.citation}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View Full Text
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(caseData.url, "_blank")}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Source
                      </Button>
                    </div>
                  </div>

                  {caseData.keywords.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Keywords:</span>
                        <div className="flex flex-wrap gap-1">
                          {caseData.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <Card>
            <CardContent className="text-center py-12">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Legal Database</h3>
              <p className="text-muted-foreground">
                Search through {totalCases} cases updated daily from government sources
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Last update: {lastUpdate ? lastUpdate.toLocaleString() : "Never"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Copyright © 2025 iTax Easy Private Limited. All rights reserved.</p>
            <p className="mt-1">Contact: elibrary@itaxeasy.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
