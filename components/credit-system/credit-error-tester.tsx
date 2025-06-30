"use client"

import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import { useCreditService } from "@/services/credit-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, AlertTriangle, XCircle, CheckCircle, RefreshCw, Zap, ShieldAlert, TestTube } from "lucide-react"

export function CreditErrorTester() {
  const { user, isAuthenticated } = useAuthContext()
  const { hasEnoughCredits, spendCredits, getRemainingCredits, error, isSpending } = useCreditService()

  const [customAmount, setCustomAmount] = useState<number>(0)
  const [testResults, setTestResults] = useState<
    Array<{
      test: string
      expectedResult: string
      actualResult: string
      success: boolean
      timestamp: Date
      error?: string
    }>
  >([])

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to test error handling</p>
        </CardContent>
      </Card>
    )
  }

  const remainingCredits = getRemainingCredits()

  const addTestResult = (
    test: string,
    expectedResult: string,
    actualResult: string,
    success: boolean,
    error?: string,
  ) => {
    setTestResults((prev) => [
      {
        test,
        expectedResult,
        actualResult,
        success,
        timestamp: new Date(),
        error,
      },
      ...prev.slice(0, 9),
    ])
  }

  // Test spending more credits than available
  const testInsufficientCredits = async () => {
    const amountToSpend = remainingCredits + 10 // Try to spend 10 more than available
    const expectedResult = "Should fail with insufficient credits error"

    console.log(`🧪 Testing: Attempting to spend ${amountToSpend} credits when only ${remainingCredits} available`)

    const success = await spendCredits(amountToSpend, "Insufficient Credits Test")

    const actualResult = success
      ? "❌ Unexpectedly succeeded"
      : `✅ Failed as expected: ${error || "Insufficient credits"}`

    addTestResult(
      `Spend ${amountToSpend} credits (have ${remainingCredits})`,
      expectedResult,
      actualResult,
      !success, // Success means the error handling worked (transaction failed)
      error || undefined,
    )
  }

  // Test spending exactly available credits
  const testExactCredits = async () => {
    if (remainingCredits === 0) {
      addTestResult(
        "Spend exact credits",
        "Should fail - no credits available",
        "❌ Cannot test - no credits available",
        false,
      )
      return
    }

    const expectedResult = "Should succeed - spending exact amount"
    console.log(`🧪 Testing: Attempting to spend exactly ${remainingCredits} credits`)

    const success = await spendCredits(remainingCredits, "Exact Credits Test")

    const actualResult = success ? "✅ Succeeded as expected" : `❌ Failed unexpectedly: ${error}`

    addTestResult(`Spend exact ${remainingCredits} credits`, expectedResult, actualResult, success, error || undefined)
  }

  // Test spending custom amount
  const testCustomAmount = async () => {
    if (customAmount <= 0) {
      addTestResult(
        "Custom amount test",
        "Should validate input",
        "❌ Invalid amount entered",
        false,
        "Amount must be greater than 0",
      )
      return
    }

    const hasEnough = hasEnoughCredits(customAmount)
    const expectedResult = hasEnough ? "Should succeed - sufficient credits" : "Should fail - insufficient credits"

    console.log(`🧪 Testing: Attempting to spend ${customAmount} credits (have ${remainingCredits})`)

    const success = await spendCredits(customAmount, `Custom Amount Test (${customAmount} credits)`)

    const actualResult = success ? "✅ Transaction succeeded" : `❌ Transaction failed: ${error}`

    addTestResult(
      `Spend ${customAmount} credits (have ${remainingCredits})`,
      expectedResult,
      actualResult,
      hasEnough ? success : !success, // If we have enough, success should be true; if not, success should be false
      error || undefined,
    )
  }

  // Test zero credits
  const testZeroCredits = async () => {
    const expectedResult = "Should fail - cannot spend zero credits"
    console.log(`🧪 Testing: Attempting to spend 0 credits`)

    const success = await spendCredits(0, "Zero Credits Test")

    const actualResult = success ? "❌ Unexpectedly succeeded" : `✅ Failed as expected: ${error || "Invalid amount"}`

    addTestResult("Spend 0 credits", expectedResult, actualResult, !success, error || undefined)
  }

  // Test negative credits
  const testNegativeCredits = async () => {
    const expectedResult = "Should fail - cannot spend negative credits"
    console.log(`🧪 Testing: Attempting to spend -5 credits`)

    const success = await spendCredits(-5, "Negative Credits Test")

    const actualResult = success ? "❌ Unexpectedly succeeded" : `✅ Failed as expected: ${error || "Invalid amount"}`

    addTestResult("Spend -5 credits", expectedResult, actualResult, !success, error || undefined)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="mr-2 h-5 w-5" />
            Credit Error Handling Tests
          </CardTitle>
          <CardDescription>Test various error scenarios to verify proper credit system behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Current Balance:</span>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {remainingCredits} Credits
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Error Test Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Insufficient Credits Test */}
            <Button
              variant="destructive"
              className="h-auto py-4 flex flex-col"
              onClick={testInsufficientCredits}
              disabled={isSpending}
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="font-medium">Test Insufficient Credits</span>
              <span className="text-xs opacity-80">Try to spend {remainingCredits + 10} credits</span>
            </Button>

            {/* Exact Credits Test */}
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={testExactCredits}
              disabled={isSpending || remainingCredits === 0}
            >
              <Zap className="h-6 w-6 mb-2" />
              <span className="font-medium">Test Exact Amount</span>
              <span className="text-xs text-muted-foreground">Spend exactly {remainingCredits} credits</span>
            </Button>

            {/* Zero Credits Test */}
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={testZeroCredits}
              disabled={isSpending}
            >
              <XCircle className="h-6 w-6 mb-2" />
              <span className="font-medium">Test Zero Credits</span>
              <span className="text-xs text-muted-foreground">Try to spend 0 credits</span>
            </Button>

            {/* Negative Credits Test */}
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col"
              onClick={testNegativeCredits}
              disabled={isSpending}
            >
              <XCircle className="h-6 w-6 mb-2" />
              <span className="font-medium">Test Negative Credits</span>
              <span className="text-xs text-muted-foreground">Try to spend -5 credits</span>
            </Button>
          </div>

          {/* Custom Amount Test */}
          <div className="mt-6 p-4 border rounded-lg">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Custom Amount Test
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount to test"
                value={customAmount || ""}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="flex-1"
              />
              <Button onClick={testCustomAmount} disabled={isSpending} variant="outline">
                Test Amount
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Enter any amount to test spending behavior</p>
          </div>

          {isSpending && (
            <div className="mt-4 text-center">
              <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
              Running test...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Results</span>
            <Button variant="outline" size="sm" onClick={clearResults}>
              Clear Results
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No test results yet. Run some error tests above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{result.test}</span>
                        <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium text-blue-600">Expected:</span> {result.expectedResult}
                        </div>
                        <div>
                          <span className="font-medium text-purple-600">Actual:</span> {result.actualResult}
                        </div>
                        {result.error && (
                          <div>
                            <span className="font-medium text-red-600">Error:</span> {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Current Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
