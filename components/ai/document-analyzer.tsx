"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Brain, FileText, TextSearch, Sparkles, AlertTriangle, ThumbsUp, Meh, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { analyzeDocument, type AIAnalysisResult } from "@/lib/ai-service"

interface DocumentAnalyzerProps {
  documentId: string
  documentText: string
  documentTitle: string
}

export function DocumentAnalyzer({ documentId, documentText, documentTitle }: DocumentAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)

      const result = await analyzeDocument(documentText)
      setAnalysis(result)

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed by AI",
      })
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze document",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-5 w-5 text-green-500" />
      case "negative":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return <Meh className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Document Analysis
        </CardTitle>
        <CardDescription>Analyze this document with AI to extract key information and insights</CardDescription>
      </CardHeader>

      <CardContent>
        {!analysis ? (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Analyze "{documentTitle}"</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI can extract key points, summarize the content, and identify related cases
            </p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Document
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center">
                <TextSearch className="mr-2 h-4 w-4" />
                Summary
              </h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">{analysis.summary}</p>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Key Points</h3>
              <ul className="space-y-2">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="mr-2 bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Similarly Cited Cases</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.similarlyCitedCases.map((caseItem, index) => (
                  <Badge key={index} variant="secondary">
                    {caseItem}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.relatedTopics.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Sentiment Analysis</h3>
              <div className="flex items-center bg-muted/50 p-3 rounded">
                {getSentimentIcon(analysis.sentimentAnalysis.sentiment)}
                <div className="ml-2">
                  <div className="capitalize">{analysis.sentimentAnalysis.sentiment}</div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round(analysis.sentimentAnalysis.confidenceScore * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {analysis && (
        <CardFooter className="border-t pt-4">
          <div className="flex items-center text-xs text-muted-foreground w-full">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>
              AI analysis is for informational purposes only and may not be 100% accurate. Always verify information
              before making legal decisions.
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
