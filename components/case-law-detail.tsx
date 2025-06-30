"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, ArrowLeft, ExternalLink, Copy, Check, Network, Tag } from "lucide-react"
import { type CaseLawDetail, getCaseLawDetail, apiSources } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { SimilarCases } from "@/components/similar-cases"
import type { CitationNetworkData } from "@/lib/citation-network"

interface CaseLawDetailViewProps {
  id: string
  networkData?: CitationNetworkData
  onViewPdf: (url: string) => void
  onSelectCase?: (caseId: string) => void
  onBack: () => void
}

export function CaseLawDetailView({ id, networkData, onViewPdf, onSelectCase, onBack }: CaseLawDetailViewProps) {
  const { toast } = useToast()
  const [caseDetail, setCaseDetail] = useState<CaseLawDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        setIsLoading(true)
        const detail = await getCaseLawDetail(id)
        setCaseDetail(detail)
      } catch (error) {
        console.error("Error fetching case detail:", error)
        toast({
          title: "Error",
          description: "Failed to load case details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCaseDetail()
    }
  }, [id, toast])

  const handleCopyText = () => {
    if (caseDetail) {
      navigator.clipboard.writeText(caseDetail.fullText)
      setCopySuccess(true)
      toast({
        title: "Copied",
        description: "Case text copied to clipboard",
      })
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const source = caseDetail ? apiSources.find((s) => s.id === caseDetail.source) : null

  // Find the corresponding node in the network data
  const caseNode = networkData?.nodes.find((node) => node.id === id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      ) : caseDetail ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{caseDetail.title}</CardTitle>
                {caseDetail.pdfUrl && (
                  <Button
                    variant="outline"
                    onClick={() => onViewPdf(caseDetail.pdfUrl!)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View PDF
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(caseDetail.date).toLocaleDateString()}
                </Badge>
                <Badge variant="outline">{caseDetail.court}</Badge>
                <Badge variant="outline">{caseDetail.documentType}</Badge>
                {source && (
                  <Badge variant="outline" className="bg-slate-100">
                    {source.name}
                  </Badge>
                )}
                {caseNode?.topicLabel && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: caseNode.topicColor ? `${caseNode.topicColor}20` : undefined,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: caseNode.topicColor }} />
                    {caseNode.topicLabel}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardContent className="pb-0">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Case Details</TabsTrigger>
                  {networkData && caseNode && (
                    <>
                      <TabsTrigger value="similar" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Similar Cases
                      </TabsTrigger>
                      <TabsTrigger value="network" className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Citation Network
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>
              </CardContent>

              <TabsContent value="details">
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Appellant</h3>
                      <p>{caseDetail.appellant || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Respondent</h3>
                      <p>{caseDetail.respondent || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Appeal No.</h3>
                      <p>{caseDetail.appealNo || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Bench</h3>
                      <p>{caseDetail.bench || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Section</h3>
                      <p>{caseDetail.section || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Assessment Year</h3>
                      <p>{caseDetail.assessmentYear || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Result</h3>
                      <p>{caseDetail.orderResult || "N/A"}</p>
                    </div>
                    {caseDetail.citations && caseDetail.citations.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Citations</h3>
                        <div className="flex flex-wrap gap-2">
                          {caseDetail.citations.map((citation, index) => (
                            <Badge key={index} variant="secondary">
                              {citation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Full Text</h3>
                      <Button variant="outline" size="sm" onClick={handleCopyText} className="flex items-center gap-1">
                        {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copySuccess ? "Copied" : "Copy Text"}
                      </Button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md text-sm whitespace-pre-line">{caseDetail.fullText}</div>
                  </div>
                </CardContent>
              </TabsContent>

              {networkData && caseNode && (
                <>
                  <TabsContent value="similar">
                    <CardContent>
                      <h3 className="text-lg font-medium mb-4">Similar Cases</h3>
                      <SimilarCases
                        caseNode={caseNode}
                        networkData={networkData}
                        onSelectCase={(caseId) => onSelectCase && onSelectCase(caseId)}
                        onViewPdf={onViewPdf}
                      />
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="network">
                    <CardContent>
                      <h3 className="text-lg font-medium mb-4">Citation Network</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Cited By</h4>
                          {networkData.links.filter((link) => link.target === caseNode.id).length ? (
                            <div className="space-y-2">
                              {networkData.links
                                .filter((link) => link.target === caseNode.id)
                                .map((link) => {
                                  const sourceNode = networkData.nodes.find((n) => n.id === link.source)
                                  if (!sourceNode) return null

                                  return (
                                    <div
                                      key={`${link.source}-${link.target}`}
                                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{sourceNode.title}</span>
                                        {sourceNode.topicLabel && (
                                          <Badge
                                            variant="outline"
                                            className="flex items-center gap-1"
                                            style={{
                                              backgroundColor: sourceNode.topicColor
                                                ? `${sourceNode.topicColor}20`
                                                : undefined,
                                            }}
                                          >
                                            <div
                                              className="w-2 h-2 rounded-full"
                                              style={{ backgroundColor: sourceNode.topicColor }}
                                            />
                                            {sourceNode.topicLabel}
                                          </Badge>
                                        )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={
                                          link.type === "followed"
                                            ? "bg-green-100 text-green-800"
                                            : link.type === "distinguished"
                                              ? "bg-amber-100 text-amber-800"
                                              : link.type === "overruled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                        }
                                      >
                                        {link.type}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No cases cite this case</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Cites</h4>
                          {networkData.links.filter((link) => link.source === caseNode.id).length ? (
                            <div className="space-y-2">
                              {networkData.links
                                .filter((link) => link.source === caseNode.id)
                                .map((link) => {
                                  const targetNode = networkData.nodes.find((n) => n.id === link.target)
                                  if (!targetNode) return null

                                  return (
                                    <div
                                      key={`${link.source}-${link.target}`}
                                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{targetNode.title}</span>
                                        {targetNode.topicLabel && (
                                          <Badge
                                            variant="outline"
                                            className="flex items-center gap-1"
                                            style={{
                                              backgroundColor: targetNode.topicColor
                                                ? `${targetNode.topicColor}20`
                                                : undefined,
                                            }}
                                          >
                                            <div
                                              className="w-2 h-2 rounded-full"
                                              style={{ backgroundColor: targetNode.topicColor }}
                                            />
                                            {targetNode.topicLabel}
                                          </Badge>
                                        )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={
                                          link.type === "followed"
                                            ? "bg-green-100 text-green-800"
                                            : link.type === "distinguished"
                                              ? "bg-amber-100 text-amber-800"
                                              : link.type === "overruled"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                        }
                                      >
                                        {link.type}
                                      </Badge>
                                    </div>
                                  )
                                })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">This case doesn't cite any other cases</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </>
              )}
            </Tabs>

            <CardFooter className="flex justify-between bg-slate-50 py-3">
              <div className="text-xs text-muted-foreground">ID: {caseDetail.id}</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                onClick={() => window.open(caseDetail.url, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Original
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Case Not Found</h3>
          <p className="text-muted-foreground">The requested case could not be found.</p>
        </div>
      )}
    </div>
  )
}
