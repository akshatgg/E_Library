"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Search, ArrowLeft, RefreshCw, BarChart, Tag } from "lucide-react"
import { CitationNetworkVisualization } from "@/components/citation-network-visualization"
import { TopicExplorer } from "@/components/topic-explorer"
import { CaseLawDetailView } from "@/components/case-law-detail"
import { getCitationNetwork, type CitationNode, type CitationNetworkData } from "@/lib/citation-network"

interface CitationNetworkPageProps {
  onViewPdf: (url: string) => void
  onBack?: () => void
}

export function CitationNetworkPage({ onViewPdf, onBack }: CitationNetworkPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [networkData, setNetworkData] = useState<CitationNetworkData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<CitationNode | null>(null)
  const [activeTab, setActiveTab] = useState("visualization")
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  useEffect(() => {
    const loadNetworkData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCitationNetwork()

        if (data && data.nodes && data.links) {
          setNetworkData(data)
        } else {
          setError("No citation network data available")
        }
      } catch (error) {
        console.error("Error loading citation network:", error)
        setError("Failed to load citation network data")
      } finally {
        setIsLoading(false)
      }
    }

    loadNetworkData()
  }, [])

  const handleSearch = () => {
    if (!networkData || !searchQuery.trim()) return

    const query = searchQuery.toLowerCase()
    const matchingNodes =
      networkData.nodes?.filter(
        (node) => node.title?.toLowerCase().includes(query) || node.id?.toLowerCase().includes(query),
      ) || []

    if (matchingNodes.length > 0) {
      setSelectedNode(matchingNodes[0])
      setActiveTab("details")
    }
  }

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
    const node = networkData?.nodes?.find((n) => n.id === caseId)
    if (node) {
      setSelectedNode(node)
    }
    setActiveTab("details")
  }

  // If we're in details view and have a selected case ID, show the case detail view
  if (activeTab === "details" && selectedCaseId) {
    return (
      <CaseLawDetailView
        id={selectedCaseId}
        networkData={networkData || undefined}
        onViewPdf={onViewPdf}
        onSelectCase={handleSelectCase}
        onBack={() => {
          setActiveTab("visualization")
          setSelectedCaseId(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-2xl font-bold">Citation Network Analysis</h2>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading citation network...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-2 text-center">
              <Network className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Error Loading Network</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="mt-6">
            <CitationNetworkVisualization network={networkData} onSelectCase={handleSelectCase} />
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            {networkData && (
              <TopicExplorer networkData={networkData} onSelectCase={handleSelectCase} onViewPdf={onViewPdf} />
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Citation Network Insights</CardTitle>
                <CardDescription>Analysis of the citation network</CardDescription>
              </CardHeader>
              <CardContent>
                {networkData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Cases</div>
                      <div className="text-2xl font-bold mt-1">{networkData.nodes?.length || 0}</div>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Citations</div>
                      <div className="text-2xl font-bold mt-1">{networkData.links?.length || 0}</div>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Topics</div>
                      <div className="text-2xl font-bold mt-1">{networkData.topics?.length || 0}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No network data available for analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
