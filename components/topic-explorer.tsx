"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Tag, BarChart4, Hash, ArrowRight } from "lucide-react"
import { type CitationNetworkData, type CitationNode, getCasesByTopic } from "@/lib/citation-network"
import { findSimilarTopics } from "@/lib/similarity-service"

interface TopicExplorerProps {
  networkData: CitationNetworkData
  onSelectCase: (caseId: string) => void
  onViewPdf: (url: string) => void
}

export function TopicExplorer({ networkData, onSelectCase, onViewPdf }: TopicExplorerProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  if (!networkData || !networkData.topics || networkData.topics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No topics available</h3>
          <p className="text-muted-foreground mt-2">There are not enough cases to generate meaningful topics.</p>
        </CardContent>
      </Card>
    )
  }

  const topics = networkData.topics
  const selectedTopic = selectedTopicId ? topics.find((t) => t.id === selectedTopicId) : null
  const casesInTopic = selectedTopic ? getCasesByTopic(networkData, selectedTopic.id) : []
  const similarTopics = selectedTopic ? findSimilarTopics(selectedTopic.id, networkData) : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Topics</CardTitle>
          <CardDescription>
            {topics.length} topics identified across {networkData.nodes.length} cases
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="px-4 py-2 space-y-2">
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopicId === topic.id ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: topic.color }} />
                    <div className="text-left">
                      <div className="font-medium">{topic.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{topic.cases.length} cases</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {topic.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedTopic ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTopic.color }} />
                {selectedTopic.label}
              </div>
            ) : (
              "Select a topic to view cases"
            )}
          </CardTitle>
          <CardDescription>{selectedTopic ? `${casesInTopic.length} cases in this topic` : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTopic ? (
            <Tabs defaultValue="cases">
              <TabsList className="mb-4">
                <TabsTrigger value="cases" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Cases
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Keywords
                </TabsTrigger>
                <TabsTrigger value="similar" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Similar Topics
                </TabsTrigger>
                <TabsTrigger value="distribution" className="flex items-center gap-2">
                  <BarChart4 className="h-4 w-4" />
                  Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cases">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {casesInTopic.map((caseNode) => (
                      <CaseCard
                        key={caseNode.id}
                        caseNode={caseNode}
                        onSelect={() => onSelectCase(caseNode.id)}
                        onViewPdf={() => caseNode.pdfUrl && onViewPdf(caseNode.pdfUrl)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="keywords">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-3">Key Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.keywords.map((keyword) => (
                      <Badge key={keyword} className="text-sm py-1.5 px-3">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-medium mt-6 mb-3">Related Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* In a real implementation, these would be additional related terms */}
                    {["legal", "precedent", "judgment", "ruling", "statute", "regulation", "compliance"].map((term) => (
                      <Badge key={term} variant="outline" className="text-sm py-1.5 px-3">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="similar">
                <div className="space-y-4">
                  <h3 className="font-medium">Similar Topics</h3>
                  {similarTopics.length > 0 ? (
                    <div className="space-y-3">
                      {similarTopics.map(({ topic, similarity }) => (
                        <div key={topic.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                              <h4 className="font-medium">{topic.label}</h4>
                            </div>
                            <Badge variant="secondary">{Math.round(similarity * 100)}% similar</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {topic.keywords.map((keyword) => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTopicId(topic.id)}
                              className="flex items-center gap-1"
                            >
                              View Topic
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No similar topics found</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="distribution">
                <div className="space-y-4">
                  <h3 className="font-medium">Court Distribution</h3>
                  {renderDistributionChart(casesInTopic, "court")}

                  <h3 className="font-medium mt-4">Year Distribution</h3>
                  {renderYearDistribution(casesInTopic)}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Tag className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No topic selected</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Select a topic from the list to view related cases and insights
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface CaseCardProps {
  caseNode: CitationNode
  onSelect: () => void
  onViewPdf: () => void
}

function CaseCard({ caseNode, onSelect, onViewPdf }: CaseCardProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="flex justify-between">
        <h4 className="font-medium">{caseNode.title}</h4>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onSelect} className="h-6 w-6">
            <Tag className="h-3.5 w-3.5" />
          </Button>
          {caseNode.pdfUrl && (
            <Button variant="ghost" size="icon" onClick={onViewPdf} className="h-6 w-6">
              <FileText className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="outline">{caseNode.court}</Badge>
        <span className="text-xs text-muted-foreground">{caseNode.year}</span>
        <Badge variant="secondary">{caseNode.citationCount} citations</Badge>
      </div>
      {caseNode.summary && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{caseNode.summary}</p>}
    </div>
  )
}

function renderDistributionChart(cases: CitationNode[], field: "court" | "year") {
  // Count occurrences
  const counts: Record<string, number> = {}
  cases.forEach((c) => {
    const value = String(c[field])
    counts[value] = (counts[value] || 0) + 1
  })

  // Sort by count
  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1])

  // Calculate max for scaling
  const max = Math.max(...Object.values(counts))

  return (
    <div className="space-y-2">
      {sortedEntries.map(([value, count]) => (
        <div key={value} className="flex items-center gap-2">
          <div className="w-24 text-sm truncate">{value}</div>
          <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <div className="w-8 text-sm text-right">{count}</div>
        </div>
      ))}
    </div>
  )
}

function renderYearDistribution(cases: CitationNode[]) {
  // Group by year
  const yearCounts: Record<number, number> = {}
  cases.forEach((c) => {
    yearCounts[c.year] = (yearCounts[c.year] || 0) + 1
  })

  // Get min and max years
  const years = Object.keys(yearCounts).map(Number)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  // Create a continuous range of years
  const yearRange: number[] = []
  for (let year = minYear; year <= maxYear; year++) {
    yearRange.push(year)
  }

  // Calculate max for scaling
  const max = Math.max(...Object.values(yearCounts))

  return (
    <div className="h-40 flex items-end gap-1">
      {yearRange.map((year) => (
        <div key={year} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-primary rounded-t-sm"
            style={{
              height: `${((yearCounts[year] || 0) / max) * 100}%`,
              minHeight: yearCounts[year] ? "4px" : "0",
            }}
          />
          <div className="text-xs mt-1 rotate-45 origin-top-left translate-x-2">{year}</div>
        </div>
      ))}
    </div>
  )
}
