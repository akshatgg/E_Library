"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuggestionPanel } from "@/components/suggestions/suggestion-panel"
import { InlineSuggestions } from "@/components/suggestions/inline-suggestions"
import { useSuggestions } from "@/hooks/use-suggestions"
import { FileText, Scale, Calculator, Bell, Settings, User, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import type { UserContext } from "@/lib/suggestion-engine"

const mockUserContext: UserContext = {
  recentDocuments: ["partnership-deed-1", "reply-letter-2"],
  activeProjects: ["tax-consultation", "legal-review"],
  userRole: "tax_consultant",
  preferences: { notifications: true, autoSave: true },
  searchHistory: ["section 14A", "GST input credit", "partnership deed"],
  documentTypes: ["partnership", "reply_letter", "valuation"],
  deadlines: [
    { date: "2024-01-20", type: "ITR Filing" },
    { date: "2024-01-25", type: "GST Return" },
  ],
}

export function EnhancedDashboard() {
  const { suggestions, loading, context, updateContext, refreshSuggestions, dismissSuggestion, getUrgentSuggestions } =
    useSuggestions(mockUserContext)

  const [activeTab, setActiveTab] = useState("overview")
  const urgentSuggestions = getUrgentSuggestions()

  const handleSuggestionAccept = (suggestionId: string) => {
    console.log("Accepting suggestion:", suggestionId)
    // Handle suggestion acceptance
  }

  const stats = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Cases",
      value: "23",
      change: "+5%",
      icon: Scale,
      color: "text-green-600",
    },
    {
      title: "Pending Actions",
      value: urgentSuggestions.length.toString(),
      change: "urgent",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Completed Today",
      value: "8",
      change: "+3",
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              {urgentSuggestions.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {urgentSuggestions.length} urgent
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Urgent Suggestions */}
            {urgentSuggestions.length > 0 && (
              <InlineSuggestions
                suggestions={urgentSuggestions}
                onAccept={(suggestion) => handleSuggestionAccept(suggestion.id)}
                onDismiss={dismissSuggestion}
                maxVisible={2}
              />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stat.change.startsWith("+") ? (
                            <span className="text-green-600">{stat.change}</span>
                          ) : stat.change === "urgent" ? (
                            <span className="text-red-600">Needs attention</span>
                          ) : (
                            <span>{stat.change}</span>
                          )}
                        </p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Dashboard Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Partnership Deed Created</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Scale className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Case Law Search Completed</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calculator className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm font-medium">Valuation Report Generated</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {context.deadlines.map((deadline, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-orange-500" />
                              <div>
                                <p className="text-sm font-medium">{deadline.type}</p>
                                <p className="text-xs text-gray-500">{new Date(deadline.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {Math.ceil(
                                (new Date(deadline.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                              days
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Document management interface would go here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cases">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Case management interface would go here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Analytics interface would go here...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1">
            <SuggestionPanel
              userContext={context}
              onSuggestionDismiss={dismissSuggestion}
              onSuggestionAccept={handleSuggestionAccept}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
