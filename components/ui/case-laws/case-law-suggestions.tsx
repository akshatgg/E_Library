"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Clock, Star } from "lucide-react"

interface CaseLawSuggestionsProps {
  searchQuery: string
}

export function CaseLawSuggestions({ searchQuery }: CaseLawSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Generate suggestions based on search query
      const newSuggestions = [
        "Section 14A disallowance cases",
        "Cash credit under Section 68",
        "Input Tax Credit denial",
        "Partnership deed disputes",
        "HUF taxation matters",
      ].filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))

      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const popularSearches = [
    { term: "Section 14A", count: "1,234 cases", trend: "+15%" },
    { term: "Cash Credits", count: "987 cases", trend: "+8%" },
    { term: "ITC Denial", count: "756 cases", trend: "+22%" },
    { term: "Partnership", count: "543 cases", trend: "+5%" },
  ]

  const recentTrends = [
    { title: "Supreme Court on Section 68", category: "Income Tax", date: "2024-01-15" },
    { title: "ITAT on ITC Reversal", category: "GST", date: "2024-01-14" },
    { title: "High Court on Partnership", category: "Corporate", date: "2024-01-13" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button key={index} variant="ghost" className="w-full justify-start text-sm">
                {suggestion}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

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
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{search.term}</p>
                <p className="text-xs text-muted-foreground">{search.count}</p>
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
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                <p className="font-medium text-sm">{trend.title}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {trend.category}
                </Badge>
                <span>{trend.date}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
