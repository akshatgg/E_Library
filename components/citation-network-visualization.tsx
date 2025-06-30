"use client"

import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, ZoomIn, ZoomOut, RefreshCw, Info, ArrowUpRight, ArrowDownRight, Network } from "lucide-react"
import {
  type CitationNetwork,
  type CitationNode,
  getMostInfluentialCases,
  getCitingCases,
  getCitedCases,
} from "@/lib/citation-network"

interface CitationNetworkVisualizationProps {
  network?: CitationNetwork | null
  onSelectCase?: (caseId: string) => void
}

export function CitationNetworkVisualization({ network, onSelectCase }: CitationNetworkVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<CitationNode | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNetwork, setFilteredNetwork] = useState<CitationNetwork | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [yearRange, setYearRange] = useState<[number, number]>([1950, new Date().getFullYear()])
  const [courtFilter, setCourtFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("network")
  const [highlightMode, setHighlightMode] = useState<"none" | "citing" | "cited">("none")
  const [clusterByTopic, setClusterByTopic] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize filtered network when network prop changes
  useEffect(() => {
    if (network && network.nodes && network.links) {
      setFilteredNetwork(network)
      // Update year range based on available data
      const years = network.nodes.map((n) => n.year).filter(Boolean)
      if (years.length > 0) {
        setYearRange([Math.min(...years), Math.max(...years)])
      }
      setError(null)
    } else {
      setFilteredNetwork(null)
      if (network === undefined) {
        setError("Network data is not available")
      }
    }
  }, [network])

  // Filter network when search or filters change
  useEffect(() => {
    if (!network || !network.nodes || !network.links) {
      setFilteredNetwork(null)
      return
    }

    try {
      const filtered = { ...network }

      // Filter by search term
      if (searchTerm) {
        filtered.nodes = network.nodes.filter(
          (node) =>
            node.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.court?.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        const nodeIds = new Set(filtered.nodes.map((node) => node.id))
        filtered.links = network.links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target))
      }

      // Filter by year range
      filtered.nodes = filtered.nodes.filter((node) => {
        const nodeYear = node.year || new Date().getFullYear()
        return nodeYear >= yearRange[0] && nodeYear <= yearRange[1]
      })

      const nodeIds = new Set(filtered.nodes.map((node) => node.id))
      filtered.links = filtered.links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target))

      // Filter by court
      if (courtFilter !== "all") {
        filtered.nodes = filtered.nodes.filter((node) => node.court?.toLowerCase().includes(courtFilter.toLowerCase()))

        const nodeIds = new Set(filtered.nodes.map((node) => node.id))
        filtered.links = filtered.links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target))
      }

      setFilteredNetwork(filtered)
    } catch (err) {
      console.error("Error filtering network:", err)
      setError("Error filtering network data")
    }
  }, [network, searchTerm, yearRange, courtFilter])

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoomLevel(1)
    setSearchTerm("")
    setCourtFilter("all")
    setHighlightMode("none")
    setSelectedNode(null)
  }

  // Get influential cases for the insights tab
  const influentialCases = filteredNetwork ? getMostInfluentialCases(filteredNetwork, 5) : []

  // Get citing and cited cases for the selected node
  const citingCases = selectedNode && filteredNetwork ? getCitingCases(filteredNetwork, selectedNode.id) : []
  const citedCases = selectedNode && filteredNetwork ? getCitedCases(filteredNetwork, selectedNode.id) : []

  // Simple network visualization component
  function NetworkVisualization({ data }: { data: CitationNetwork }) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
      if (!svgRef.current || !data?.nodes?.length) return

      const updateDimensions = () => {
        if (svgRef.current) {
          const { width, height } = svgRef.current.getBoundingClientRect()
          setDimensions({ width: width || 800, height: height || 600 })
        }
      }

      updateDimensions()
      window.addEventListener("resize", updateDimensions)
      return () => window.removeEventListener("resize", updateDimensions)
    }, [data])

    useEffect(() => {
      if (!svgRef.current || !data?.nodes?.length || dimensions.width === 0) return

      // Clear previous visualization
      d3.select(svgRef.current).selectAll("*").remove()

      const svg = d3.select(svgRef.current)
      const width = dimensions.width
      const height = dimensions.height

      // Create a group for the graph
      const g = svg.append("g")

      // Create simple static layout for nodes
      const nodes = data.nodes.map((node, i) => ({
        ...node,
        x: (width / (data.nodes.length + 1)) * (i + 1),
        y: height / 2 + (Math.random() - 0.5) * 200,
      }))

      // Create links
      const link = g
        .append("g")
        .selectAll("line")
        .data(data.links || [])
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)

      // Create nodes
      const node = g
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => 5 + Math.sqrt((d.influence || 0) + 1) * 2)
        .attr("fill", "#69b3a2")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          setSelectedNode(d)
          if (onSelectCase) onSelectCase(d.id)
        })

      // Add labels
      const label = g
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("font-size", 10)
        .attr("dx", 8)
        .attr("dy", ".35em")
        .text((d) => (d.title && d.title.length > 30 ? d.title.substring(0, 30) + "..." : d.title || "Untitled"))
        .style("pointer-events", "none")
        .style("opacity", 0.7)

      // Position elements
      link
        .attr("x1", (d: any) => {
          const sourceNode = nodes.find((n) => n.id === d.source)
          return sourceNode?.x || 0
        })
        .attr("y1", (d: any) => {
          const sourceNode = nodes.find((n) => n.id === d.source)
          return sourceNode?.y || 0
        })
        .attr("x2", (d: any) => {
          const targetNode = nodes.find((n) => n.id === d.target)
          return targetNode?.x || 0
        })
        .attr("y2", (d: any) => {
          const targetNode = nodes.find((n) => n.id === d.target)
          return targetNode?.y || 0
        })

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)

      // Add tooltips
      node.append("title").text((d) => `${d.title}\nCourt: ${d.court}\nYear: ${d.year}`)
    }, [data, dimensions, selectedNode])

    return <svg ref={svgRef} width="100%" height="100%" />
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading citation network...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
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
    )
  }

  // No data state
  if (!network || !network.nodes || network.nodes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2 text-center">
            <Network className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Citation Data</h3>
            <p className="text-muted-foreground">
              No citation network data is available. Add cases with citations to build the network.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Network className="h-5 w-5" />
              Citation Network
            </CardTitle>
            <div className="flex gap-2">
              <Select value={highlightMode} onValueChange={(value: any) => setHighlightMode(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Highlight Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Highlighting</SelectItem>
                  <SelectItem value="citing">Highlight Citing Cases</SelectItem>
                  <SelectItem value="cited">Highlight Cited Cases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="details">Case Details</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      <Search className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="space-y-2 flex-1">
                      <Label>Year Range</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{yearRange[0]}</span>
                        <Slider
                          value={yearRange}
                          min={1950}
                          max={new Date().getFullYear()}
                          step={1}
                          onValueChange={(value) => setYearRange(value as [number, number])}
                          className="flex-1"
                        />
                        <span className="text-sm">{yearRange[1]}</span>
                      </div>
                    </div>

                    <div className="space-y-2 w-[200px]">
                      <Label>Court Filter</Label>
                      <Select value={courtFilter} onValueChange={setCourtFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select court" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courts</SelectItem>
                          <SelectItem value="supreme">Supreme Court</SelectItem>
                          <SelectItem value="high">High Courts</SelectItem>
                          <SelectItem value="itat">ITAT</SelectItem>
                          <SelectItem value="commissioner">Commissioner</SelectItem>
                          <SelectItem value="ao">Assessing Officer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="relative border rounded-md" style={{ height: "500px" }}>
                    {filteredNetwork && filteredNetwork.nodes.length > 0 ? (
                      <NetworkVisualization data={filteredNetwork} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Network className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No cases match the current filters</p>
                          <Button variant="outline" onClick={handleReset} className="mt-2">
                            Reset Filters
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white/80 p-2 rounded-md shadow-sm">
                      <Button variant="outline" size="icon" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    Showing {filteredNetwork?.nodes?.length || 0} cases and {filteredNetwork?.links?.length || 0}{" "}
                    citations
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Most Influential Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {influentialCases.length > 0 ? (
                        influentialCases.map((caseItem, index) => (
                          <div key={caseItem.id} className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div
                                className="text-sm font-medium hover:underline cursor-pointer"
                                onClick={() => {
                                  setSelectedNode(caseItem)
                                  setActiveTab("details")
                                }}
                              >
                                {caseItem.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {caseItem.court}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{caseItem.year}</span>
                                <Badge variant="secondary" className="text-xs">
                                  Cited {caseItem.influence} times
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No cases found with the current filters
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Citation Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Cases</div>
                          <div className="text-2xl font-bold mt-1">{filteredNetwork?.nodes?.length || 0}</div>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Citations</div>
                          <div className="text-2xl font-bold mt-1">{filteredNetwork?.links?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details">
              {selectedNode ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedNode.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{selectedNode.court}</Badge>
                        <Badge variant="outline">{selectedNode.year}</Badge>
                        <Badge variant="secondary">Cited {selectedNode.influence} times</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => onSelectCase && onSelectCase(selectedNode.id)}
                        className="w-full"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        View Full Case Details
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ArrowUpRight className="h-4 w-4" />
                          Cases Citing This Case
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {citingCases.length > 0 ? (
                          <div className="space-y-3">
                            {citingCases.map((caseItem) => (
                              <div key={caseItem.id} className="flex items-start gap-2">
                                <div
                                  className="text-sm hover:underline cursor-pointer"
                                  onClick={() => setSelectedNode(caseItem)}
                                >
                                  {caseItem.title}
                                </div>
                                <div className="flex items-center gap-1 ml-auto">
                                  <Badge variant="outline" className="text-xs">
                                    {caseItem.year}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">No cases cite this case</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ArrowDownRight className="h-4 w-4" />
                          Cases Cited by This Case
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {citedCases.length > 0 ? (
                          <div className="space-y-3">
                            {citedCases.map((caseItem) => (
                              <div key={caseItem.id} className="flex items-start gap-2">
                                <div
                                  className="text-sm hover:underline cursor-pointer"
                                  onClick={() => setSelectedNode(caseItem)}
                                >
                                  {caseItem.title}
                                </div>
                                <div className="flex items-center gap-1 ml-auto">
                                  <Badge variant="outline" className="text-xs">
                                    {caseItem.year}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            This case doesn't cite any other cases
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <Info className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Case Selected</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Click on a node in the network view to see detailed information about a case.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
