"use client"

import { useState } from "react"
import { Search, X, Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchWithinPdf } from "@/lib/ai-service"

interface PdfSearchProps {
  pdfUrl: string
  onSearchResults?: (pages: number[]) => void
  onNavigateToPage?: (page: number) => void
}

export function PdfSearch({ pdfUrl, onSearchResults, onNavigateToPage }: PdfSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<{
    matches: number
    pages: number[]
    snippets: string[]
  } | null>(null)
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)

      const searchResults = await searchWithinPdf(pdfUrl, searchQuery)
      setResults(searchResults)

      if (searchResults.pages.length > 0) {
        setSelectedResultIndex(0)
        onSearchResults?.(searchResults.pages)
        onNavigateToPage?.(searchResults.pages[0])
      }
    } catch (error) {
      console.error("Error searching PDF:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setResults(null)
    setSelectedResultIndex(0)
  }

  const navigateToResult = (direction: "next" | "prev") => {
    if (!results || results.pages.length === 0) return

    let newIndex
    if (direction === "next") {
      newIndex = (selectedResultIndex + 1) % results.pages.length
    } else {
      newIndex = (selectedResultIndex - 1 + results.pages.length) % results.pages.length
    }

    setSelectedResultIndex(newIndex)
    onNavigateToPage?.(results.pages[newIndex])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {results && results.matches > 0 && (
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {results.matches} {results.matches === 1 ? "result" : "results"} found
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => navigateToResult("prev")}
                disabled={results.pages.length <= 1}
              >
                <ArrowUpCircle className="h-4 w-4" />
              </Button>
              <div className="text-xs">
                {selectedResultIndex + 1} of {results.pages.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => navigateToResult("next")}
                disabled={results.pages.length <= 1}
              >
                <ArrowDownCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs bg-background border rounded-sm p-2 max-h-24 overflow-y-auto">
            <div className="font-medium mb-1">Page {results.pages[selectedResultIndex]}:</div>
            <div className="text-muted-foreground">{results.snippets[selectedResultIndex]}</div>
          </div>
        </div>
      )}

      {results && results.matches === 0 && (
        <div className="bg-muted/50 p-3 rounded-md text-sm text-center">No results found for "{searchQuery}"</div>
      )}
    </div>
  )
}
