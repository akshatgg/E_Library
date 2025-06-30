"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ApiTestingService, type ApiTestResult } from "@/lib/api-testing"
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Activity } from "lucide-react"

export function ApiStatusDashboard() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([])
  const [rateLimits, setRateLimits] = useState<{ [service: string]: any }>({})
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const [results, limits] = await Promise.all([
        ApiTestingService.testAllApis(),
        ApiTestingService.checkRateLimits(),
      ])
      setTestResults(results)
      setRateLimits(limits)
    } catch (error) {
      console.error("Failed to run API tests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Connected
          </Badge>
        )
      case "warning":
        return <Badge variant="secondary">Not Configured</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Status Dashboard</h2>
          <p className="text-muted-foreground">Monitor the status of all legal database APIs</p>
        </div>
        <Button onClick={runTests} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Testing..." : "Test All APIs"}
        </Button>
      </div>

      <div className="grid gap-4">
        {testResults.map((result) => (
          <Card key={result.service}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <CardTitle className="text-lg">{result.service.replace("_API_KEY", "").replace("_", " ")}</CardTitle>
                </div>
                {getStatusBadge(result.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{result.message}</p>

                {result.responseTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Response Time:</span>
                    <Badge variant="outline">{result.responseTime}ms</Badge>
                  </div>
                )}

                {rateLimits[result.service] && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rate Limit Usage</span>
                      <span>
                        {rateLimits[result.service].remaining} / {rateLimits[result.service].limit}
                      </span>
                    </div>
                    <Progress
                      value={(rateLimits[result.service].remaining / rateLimits[result.service].limit) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Resets: {new Date(rateLimits[result.service].resetTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
