"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  Zap,
  Scale,
  MessageSquare,
  Gavel,
  Globe,
  Building,
} from "lucide-react"
import { ADRAIService, type ADRSuggestion, type CaseAnalysis } from "@/lib/adr-ai-service"

export default function ADRSuggestions() {
  const [caseDetails, setCaseDetails] = useState("")
  const [analysis, setAnalysis] = useState<CaseAnalysis>({
    caseType: "",
    complexity: "Medium",
    disputeValue: "",
    urgency: "Medium",
    relationshipImportance: "Medium",
  })
  const [suggestions, setSuggestions] = useState<ADRSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!caseDetails.trim() || !analysis.caseType) {
      alert("Please provide case details and select case type")
      return
    }

    setLoading(true)
    try {
      const results = await ADRAIService.analyzeCaseForADR(caseDetails, analysis)
      setSuggestions(results)
    } catch (error) {
      console.error("Error analyzing case:", error)
      alert("Error analyzing case. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Mediation":
        return <MessageSquare className="h-6 w-6" />
      case "Arbitration":
        return <Gavel className="h-6 w-6" />
      case "Conciliation":
        return <Users className="h-6 w-6" />
      case "Lok Adalat":
        return <Scale className="h-6 w-6" />
      case "Online Dispute Resolution (ODR)":
        return <Globe className="h-6 w-6" />
      default:
        return <Building className="h-6 w-6" />
    }
  }

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered ADR Suggestions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get intelligent recommendations for Alternative Dispute Resolution methods based on your case analysis
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Case Analysis
          </CardTitle>
          <CardDescription>Provide details about your case to get personalized ADR recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="case-details">Case Details</Label>
            <Textarea
              id="case-details"
              placeholder="Describe your legal dispute, including key facts, parties involved, and main issues..."
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="case-type">Case Type</Label>
              <Select
                value={analysis.caseType}
                onValueChange={(value) => setAnalysis({ ...analysis, caseType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial">Commercial Dispute</SelectItem>
                  <SelectItem value="Contract">Contract Dispute</SelectItem>
                  <SelectItem value="Employment">Employment Dispute</SelectItem>
                  <SelectItem value="Family">Family Dispute</SelectItem>
                  <SelectItem value="Property">Property Dispute</SelectItem>
                  <SelectItem value="Consumer">Consumer Dispute</SelectItem>
                  <SelectItem value="Motor Accident">Motor Accident</SelectItem>
                  <SelectItem value="E-commerce">E-commerce Dispute</SelectItem>
                  <SelectItem value="Public Utility">Public Utility</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Case Complexity</Label>
              <Select
                value={analysis.complexity}
                onValueChange={(value: any) => setAnalysis({ ...analysis, complexity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dispute-value">Dispute Value</Label>
              <Select
                value={analysis.disputeValue}
                onValueChange={(value) => setAnalysis({ ...analysis, disputeValue: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select value range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low (Under ₹5 Lakh)">Under ₹5 Lakh</SelectItem>
                  <SelectItem value="Medium (₹5 Lakh - ₹1 Crore)">₹5 Lakh - ₹1 Crore</SelectItem>
                  <SelectItem value="High (Above ₹1 Crore)">Above ₹1 Crore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                value={analysis.urgency}
                onValueChange={(value: any) => setAnalysis({ ...analysis, urgency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={loading || !caseDetails.trim() || !analysis.caseType}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Case...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Get ADR Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Recommended ADR Methods</h2>
            <p className="text-muted-foreground">Based on your case analysis, here are the most suitable options:</p>
          </div>

          <div className="grid gap-6">
            {suggestions.map((suggestion, index) => (
              <Card key={suggestion.method} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">{getMethodIcon(suggestion.method)}</div>
                      <div>
                        <CardTitle className="text-xl">{suggestion.method}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? "Best Match" : `Option ${index + 1}`}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{suggestion.suitability}% suitable</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={suggestion.suitability} className="w-24 mb-1" />
                      <div
                        className={`w-3 h-3 rounded-full ${getSuitabilityColor(suggestion.suitability)} mx-auto`}
                      ></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{suggestion.description}</p>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="process">Process</TabsTrigger>
                      <TabsTrigger value="cost">Cost & Time</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Advantages
                          </h4>
                          <ul className="space-y-1">
                            {suggestion.pros.map((pro, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Considerations</h4>
                          <ul className="space-y-1">
                            {suggestion.cons.map((con, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="process">
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Step-by-Step Process
                        </h4>
                        <div className="space-y-2">
                          {suggestion.process.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                {i + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cost">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Estimated Cost
                          </h4>
                          <p className="text-2xl font-bold text-green-600">{suggestion.cost}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Expected Timeframe
                          </h4>
                          <p className="text-2xl font-bold text-blue-600">{suggestion.timeframe}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Prerequisites & Requirements</h4>
                        <div className="grid gap-2">
                          {suggestion.requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
