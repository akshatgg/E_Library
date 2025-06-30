"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  Clock,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
  Star,
  TrendingUp,
  Calendar,
  Zap,
} from "lucide-react"
import { suggestionEngine, type Suggestion, type UserContext } from "@/lib/suggestion-engine"
import { toast } from "sonner"

interface SuggestionPanelProps {
  userContext: UserContext
  onSuggestionDismiss?: (suggestionId: string) => void
  onSuggestionAccept?: (suggestionId: string) => void
}

export function SuggestionPanel({ userContext, onSuggestionDismiss, onSuggestionAccept }: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadSuggestions()
  }, [userContext])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const newSuggestions = await suggestionEngine.generateSuggestions(userContext)
      setSuggestions(newSuggestions.filter((s) => !dismissedSuggestions.has(s.id)))
    } catch (error) {
      console.error("Failed to load suggestions:", error)
      toast.error("Failed to load suggestions")
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions((prev) => new Set([...prev, suggestionId]))
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestionId))
    onSuggestionDismiss?.(suggestionId)
    toast.success("Suggestion dismissed")
  }

  const handleAccept = (suggestion: Suggestion) => {
    onSuggestionAccept?.(suggestion.id)
    if (suggestion.actionUrl) {
      window.open(suggestion.actionUrl, "_blank")
    }
    toast.success("Opening suggested action...")
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "case_law":
        return <Scale className="h-4 w-4" />
      case "deadline":
        return <Calendar className="h-4 w-4" />
      case "action":
        return <Zap className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50"
      case "high":
        return "border-l-orange-500 bg-orange-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (activeTab === "all") return true
    if (activeTab === "urgent") return suggestion.priority === "urgent"
    if (activeTab === "today") return suggestion.dueDate && new Date(suggestion.dueDate) <= new Date()
    return suggestion.type === activeTab
  })

  const urgentCount = suggestions.filter((s) => s.priority === "urgent").length
  const todayCount = suggestions.filter((s) => s.dueDate && new Date(s.dueDate) <= new Date()).length

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Smart Suggestions
          </div>
          <Badge variant="secondary">{suggestions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-3">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs">
                Urgent{" "}
                {urgentCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {urgentCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="today" className="text-xs">
                Today{" "}
                {todayCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {todayCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="document" className="text-xs">
                Docs
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-96">
            <div className="px-6 pb-6">
              <TabsContent value={activeTab} className="mt-0">
                {filteredSuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">All caught up!</h3>
                    <p className="text-sm text-gray-500">No suggestions at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(suggestion.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(suggestion.type)}
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(suggestion.priority)}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDismiss(suggestion.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                          {suggestion.estimatedTime && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {suggestion.estimatedTime}
                            </Badge>
                          )}
                          {suggestion.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(suggestion.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Why this suggestion:</p>
                          <p className="text-xs text-gray-700">{suggestion.reason}</p>
                        </div>

                        {suggestion.benefits.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Benefits:</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {suggestion.benefits.slice(0, 2).map((benefit, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAccept(suggestion)} className="flex-1 h-8 text-xs">
                            Take Action
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismiss(suggestion.id)}
                            className="h-8 text-xs"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
