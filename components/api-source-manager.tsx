"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ApiSource, getEnabledApiSources, saveApiSourcePreferences } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { BarChart, RefreshCw, Settings, Info, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCaseLawStatistics } from "@/lib/api-service"

export function ApiSourceManager() {
  const { toast } = useToast()
  const [sources, setSources] = useState<ApiSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statistics, setStatistics] = useState<Record<string, any> | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [activeTab, setActiveTab] = useState("sources")

  useEffect(() => {
    loadSources()
  }, [])

  const loadSources = () => {
    try {
      setIsLoading(true)
      const enabledSources = getEnabledApiSources()
      setSources(enabledSources)
    } catch (error) {
      console.error("Error loading API sources:", error)
      toast({
        title: "Error",
        description: "Failed to load API sources",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    const updatedSources = sources.map((source) => (source.id === sourceId ? { ...source, enabled } : source))
    setSources(updatedSources)
    saveApiSourcePreferences(updatedSources)

    toast({
      title: enabled ? "Source Enabled" : "Source Disabled",
      description: `${sources.find((s) => s.id === sourceId)?.name} has been ${enabled ? "enabled" : "disabled"}`,
    })
  }

  const loadStatistics = async () => {
    try {
      setIsLoadingStats(true)
      const enabledSourceIds = sources.filter((s) => s.enabled).map((s) => s.id)
      const stats = await getCaseLawStatistics(enabledSourceIds)
      setStatistics(stats)
    } catch (error) {
      console.error("Error loading statistics:", error)
      toast({
        title: "Error",
        description: "Failed to load API statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (activeTab === "statistics" && !statistics && !isLoadingStats) {
      loadStatistics()
    }
  }, [activeTab, statistics, isLoadingStats])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Sources</h2>
          <p className="text-muted-foreground">Manage the legal databases and APIs used for case law search</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map((source) => (
                <Card key={source.id} className={source.enabled ? "" : "opacity-75"}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        {source.name}
                        {source.enabled && (
                          <Badge variant="outline" className="ml-2">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <Switch
                        checked={source.enabled}
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                      />
                    </div>
                    <CardDescription>{source.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>API ID: {source.id}</p>
                      {source.website && (
                        <p className="mt-1">
                          <a
                            href={source.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Visit Website <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" disabled={!source.enabled}>
                            <Info className="h-4 w-4 mr-2" />
                            API Info
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View detailed API information and documentation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" disabled={!source.enabled}>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Configure API settings and authentication</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={loadStatistics} disabled={isLoadingStats}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingStats ? "animate-spin" : ""}`} />
              Refresh Statistics
            </Button>
          </div>

          {isLoadingStats ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : statistics ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Total Documents by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {Object.entries(statistics.bySource).map(([sourceId, count]) => {
                      const source = sources.find((s) => s.id === sourceId)
                      if (!source) return null
                      const percentage = Math.round(((count as number) / statistics.total) * 100)

                      return (
                        <div key={sourceId} className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{source.name}</span>
                            <span>
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>By Document Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(statistics.byDocumentType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span>{type}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>By Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(statistics.byYear)
                        .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by year descending
                        .map(([year, count]) => (
                          <div key={year} className="flex justify-between items-center">
                            <span>{year}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <BarChart className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Statistics Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click the refresh button to load statistics for the enabled API sources.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
