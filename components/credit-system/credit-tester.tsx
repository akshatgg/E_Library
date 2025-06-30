"use client"

import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import { useCreditService } from "@/services/credit-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Coins,
  ShoppingCart,
  Search,
  FileText,
  Download,
  FormInput,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

export function CreditTester() {
  const { user, isAuthenticated } = useAuthContext()
  const {
    hasEnoughCredits,
    spendCredits,
    purchaseCredits,
    getRemainingCredits,
    getCreditStatus,
    error,
    isSpending,
    isPurchasing,
    creditCosts,
  } = useCreditService()

  const [testResults, setTestResults] = useState<
    Array<{
      action: string
      success: boolean
      message: string
      timestamp: Date
    }>
  >([])

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to test the credit system</p>
        </CardContent>
      </Card>
    )
  }

  const creditStatus = getCreditStatus()
  const remainingCredits = getRemainingCredits()

  const addTestResult = (action: string, success: boolean, message: string) => {
    setTestResults((prev) => [
      {
        action,
        success,
        message,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ]) // Keep only last 10 results
  }

  const testPurchaseCredits = async (amount: number) => {
    const success = await purchaseCredits(amount)
    addTestResult(
      `Purchase ${amount} credits`,
      success,
      success ? `Successfully added ${amount} credits` : error || "Purchase failed",
    )
  }

  const testSpendCredits = async (amount: number, description: string) => {
    const success = await spendCredits(amount, description)
    addTestResult(description, success, success ? `Successfully spent ${amount} credits` : error || "Spending failed")
  }

  const clearTestResults = () => {
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      {/* Current Credit Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Credit System Tester</span>
            <div className="flex items-center gap-2">
              <Coins className={`h-5 w-5 text-${creditStatus.color}-500`} />
              <Badge variant="outline">{remainingCredits} Credits</Badge>
            </div>
          </CardTitle>
          <CardDescription>Test credit purchasing and spending functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{remainingCredits}</span>
              <span className="text-sm text-muted-foreground">available credits</span>
            </div>

            <Progress
              value={Math.min((remainingCredits / 100) * 100, 100)}
              className={`bg-${creditStatus.color}-100`}
            />

            <Alert variant={creditStatus.status === "critical" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Credit Status: {creditStatus.status.toUpperCase()}</AlertTitle>
              <AlertDescription>{creditStatus.message}</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Credits Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Test Credit Purchase
          </CardTitle>
          <CardDescription>Test purchasing different credit amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testPurchaseCredits(10)}
              disabled={isPurchasing}
            >
              <span className="text-xl font-bold">10</span>
              <span className="text-sm text-muted-foreground">Test Credits</span>
              <span className="text-xs">Free</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testPurchaseCredits(50)}
              disabled={isPurchasing}
            >
              <span className="text-xl font-bold">50</span>
              <span className="text-sm text-muted-foreground">credits</span>
              <span className="text-xs">₹499</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col border-2 border-blue-500"
              onClick={() => testPurchaseCredits(100)}
              disabled={isPurchasing}
            >
              <span className="text-xl font-bold">100</span>
              <span className="text-sm text-muted-foreground">credits</span>
              <span className="text-xs">₹899</span>
              <Badge variant="secondary" className="mt-1 text-xs">
                Best Value
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testPurchaseCredits(200)}
              disabled={isPurchasing}
            >
              <span className="text-xl font-bold">200</span>
              <span className="text-sm text-muted-foreground">credits</span>
              <span className="text-xs">₹1699</span>
            </Button>
          </div>
          {isPurchasing && (
            <div className="mt-4 text-center">
              <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
              Processing purchase...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spend Credits Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5" />
            Test Credit Spending
          </CardTitle>
          <CardDescription>Test spending credits on different actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testSpendCredits(creditCosts.CASE_LAW_SEARCH, "Case Law Search")}
              disabled={isSpending || !hasEnoughCredits(creditCosts.CASE_LAW_SEARCH)}
            >
              <Search className="h-6 w-6 mb-2" />
              <span className="font-medium">Search</span>
              <Badge variant="outline">{creditCosts.CASE_LAW_SEARCH} credit</Badge>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testSpendCredits(creditCosts.DOCUMENT_VIEW, "Document View")}
              disabled={isSpending || !hasEnoughCredits(creditCosts.DOCUMENT_VIEW)}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-medium">View Doc</span>
              <Badge variant="outline">{creditCosts.DOCUMENT_VIEW} credits</Badge>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testSpendCredits(creditCosts.DOCUMENT_DOWNLOAD, "Document Download")}
              disabled={isSpending || !hasEnoughCredits(creditCosts.DOCUMENT_DOWNLOAD)}
            >
              <Download className="h-6 w-6 mb-2" />
              <span className="font-medium">Download</span>
              <Badge variant="outline">{creditCosts.DOCUMENT_DOWNLOAD} credits</Badge>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={() => testSpendCredits(creditCosts.FORM_GENERATION, "Form Generation")}
              disabled={isSpending || !hasEnoughCredits(creditCosts.FORM_GENERATION)}
            >
              <FormInput className="h-6 w-6 mb-2" />
              <span className="font-medium">Generate</span>
              <Badge variant="outline">{creditCosts.FORM_GENERATION} credits</Badge>
            </Button>
          </div>
          {isSpending && (
            <div className="mt-4 text-center">
              <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
              Processing transaction...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Results</span>
            <Button variant="outline" size="sm" onClick={clearTestResults}>
              Clear Results
            </Button>
          </CardTitle>
          <CardDescription>Recent credit system test results</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No test results yet. Try purchasing or spending credits above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.action}</span>
                      <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
