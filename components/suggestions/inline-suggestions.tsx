"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, X, Sparkles } from "lucide-react"
import type { Suggestion } from "@/lib/suggestion-engine"

interface InlineSuggestionsProps {
  suggestions: Suggestion[]
  onAccept: (suggestion: Suggestion) => void
  onDismiss: (suggestionId: string) => void
  maxVisible?: number
}

export function InlineSuggestions({ suggestions, onAccept, onDismiss, maxVisible = 3 }: InlineSuggestionsProps) {
  const [visibleSuggestions, setVisibleSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    setVisibleSuggestions(suggestions.slice(0, maxVisible))
  }, [suggestions, maxVisible])

  if (visibleSuggestions.length === 0) return null

  return (
    <div className="space-y-2">
      {visibleSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{suggestion.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onAccept(suggestion)} className="h-6 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDismiss(suggestion.id)} className="h-6 text-xs">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onDismiss(suggestion.id)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
