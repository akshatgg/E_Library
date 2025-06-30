"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Wand2, FileText, Clock, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface FormSuggestion {
  field: string
  suggestion: string
  confidence: number
  reason: string
  source: "ai" | "template" | "history"
}

interface FormSuggestionsProps {
  formType: string
  currentData: Record<string, any>
  onApplySuggestion: (field: string, value: string) => void
}

export function FormSuggestions({ formType, currentData, onApplySuggestion }: FormSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<FormSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateSuggestions()
  }, [formType, currentData])

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      // Simulate AI-powered form suggestions
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newSuggestions: FormSuggestion[] = []

      // Smart suggestions based on form type and current data
      if (formType === "partnership" && !currentData.registrationNumber) {
        newSuggestions.push({
          field: "registrationNumber",
          suggestion: "REG/PART/2024/001",
          confidence: 0.8,
          reason: "Based on current year and sequence",
          source: "ai",
        })
      }

      if (formType === "reply_letter" && currentData.noticeDate) {
        const noticeDate = new Date(currentData.noticeDate)
        const replyDate = new Date(noticeDate)
        replyDate.setDate(replyDate.getDate() + 30)

        newSuggestions.push({
          field: "replyDeadline",
          suggestion: replyDate.toISOString().split("T")[0],
          confidence: 0.9,
          reason: "Standard 30-day reply period",
          source: "template",
        })
      }

      if (formType === "valuation" && currentData.propertyType === "apartment") {
        newSuggestions.push({
          field: "amenities",
          suggestion: "Parking, Security, Elevator, Power Backup",
          confidence: 0.7,
          reason: "Common apartment amenities",
          source: "template",
        })
      }

      setSuggestions(newSuggestions)
    } catch (error) {
      console.error("Failed to generate suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (suggestion: FormSuggestion) => {
    onApplySuggestion(suggestion.field, suggestion.suggestion)
    setSuggestions((prev) => prev.filter((s) => s.field !== suggestion.field))
    toast.success("Suggestion applied successfully!")
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "ai":
        return <Wand2 className="h-3 w-3 text-purple-500" />
      case "template":
        return <FileText className="h-3 w-3 text-blue-500" />
      case "history":
        return <Clock className="h-3 w-3 text-green-500" />
      default:
        return <TrendingUp className="h-3 w-3 text-gray-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  if (suggestions.length === 0 && !loading) return null

  return (
    <Card className="border-dashed border-blue-300 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-blue-500" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSourceIcon(suggestion.source)}
                  <span className="text-sm font-medium capitalize">
                    {suggestion.field.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <span className={getConfidenceColor(suggestion.confidence)}>
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="mb-2">
                <Input value={suggestion.suggestion} readOnly className="text-sm bg-gray-50" />
              </div>

              <p className="text-xs text-gray-600 mb-3">{suggestion.reason}</p>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => applySuggestion(suggestion)} className="h-7 text-xs">
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSuggestions((prev) => prev.filter((s) => s.field !== suggestion.field))}
                  className="h-7 text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
