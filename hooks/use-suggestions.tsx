"use client"

import { useState, useEffect, useCallback } from "react"
import { suggestionEngine, type Suggestion, type UserContext } from "@/lib/suggestion-engine"

export function useSuggestions(initialContext: UserContext) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<UserContext>(initialContext)

  const refreshSuggestions = useCallback(async () => {
    setLoading(true)
    try {
      const newSuggestions = await suggestionEngine.generateSuggestions(context)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error("Failed to refresh suggestions:", error)
    } finally {
      setLoading(false)
    }
  }, [context])

  const updateContext = useCallback((updates: Partial<UserContext>) => {
    setContext((prev) => ({ ...prev, ...updates }))
  }, [])

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId))
  }, [])

  const getSuggestionsByType = useCallback(
    (type: string) => {
      return suggestions.filter((s) => s.type === type)
    },
    [suggestions],
  )

  const getUrgentSuggestions = useCallback(() => {
    return suggestions.filter((s) => s.priority === "urgent")
  }, [suggestions])

  useEffect(() => {
    refreshSuggestions()
  }, [refreshSuggestions])

  return {
    suggestions,
    loading,
    context,
    updateContext,
    refreshSuggestions,
    dismissSuggestion,
    getSuggestionsByType,
    getUrgentSuggestions,
  }
}
