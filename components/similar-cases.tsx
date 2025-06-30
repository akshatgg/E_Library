"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ArrowRight } from "lucide-react"
import type { CitationNode, CitationNetworkData } from "@/lib/citation-network"
import { type SimilarCase, findSimilarCases } from "@/lib/similarity-service"

interface SimilarCasesProps {
  caseNode: CitationNode
  networkData: CitationNetworkData
  onSelectCase: (caseId: string) => void
  onViewPdf: (url: string) => void
  limit?: number
}

export function SimilarCases({ caseNode, networkData, onSelectCase, onViewPdf, limit = 5 }: SimilarCasesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([])

  // Find similar cases when the component mounts or when the case changes
  useState(() => {
    setIsLoading(true)
    try {
      const similar = findSimilarCases(caseNode, networkData, limit)
      setSimilarCases(similar)
    } catch (error) {
      console.error("Error finding similar cases:", error)
    } finally {
      setIsLoading(false)
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (similarCases.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No similar cases found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="space-y-3">
        {similarCases.map((similar) => (
          <div key={similar.node.id} className="p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{similar.node.title}</h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline">{similar.node.court}</Badge>
                  <span className="text-xs text-muted-foreground">{similar.node.year}</span>
                  {similar.node.topicLabel && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                      style={{
                        backgroundColor: similar.node.topicColor ? `${similar.node.topicColor}20` : undefined,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: similar.node.topicColor }} />
                      {similar.node.topicLabel}
                    </Badge>
                  )}
                  <Badge variant="secondary">{Math.round(similar.similarityScore * 100)}% similar</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onSelectCase(similar.node.id)} className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {similar.node.pdfUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewPdf(similar.node.pdfUrl!)}
                    className="h-8 w-8"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {similar.similarityReasons.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Similarity factors:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {similar.similarityReasons.map((reason, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
