"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lightbulb, BadgePercent, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getDocumentRecommendations, type DocumentRecommendation } from "@/lib/ai-service"

interface DocumentRecommendationsProps {
  documentId: string
  onViewDocument: (id: string) => void
}

export function DocumentRecommendations({ documentId, onViewDocument }: DocumentRecommendationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<DocumentRecommendation[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (documentId) {
      loadRecommendations()
    }
  }, [documentId])

  const loadRecommendations = async () => {
    try {
      setIsLoading(true)
      const result = await getDocumentRecommendations(documentId)
      setRecommendations(result)
    } catch (error: any) {
      toast({
        title: "Recommendations Failed",
        description: error.message || "Could not load recommendations",
        variant: "destructive",
      })
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Finding similar documents and related resources</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Finding similar documents and related resources</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No recommendations available for this document</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={loadRecommendations}>
              Refresh Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Documents you might find relevant based on AI analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {recommendations.map((rec) => (
              <CarouselItem key={rec.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-none shadow-none hover:bg-accent transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2" variant="outline">
                        {rec.category}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        {Math.round(rec.relevanceScore * 100)}%
                      </Badge>
                    </div>
                    <CardTitle className="text-md">{rec.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{rec.reason}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {rec.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDocument(rec.id)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Document
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardContent>
    </Card>
  )
}
