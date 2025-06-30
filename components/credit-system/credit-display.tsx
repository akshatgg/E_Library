"use client"

import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Coins, AlertTriangle, CreditCard } from "lucide-react"
import { useState } from "react"

export function CreditDisplay() {
  const { user, addCredits } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)

  if (!user) {
    return null
  }

  const creditStatus = user.credits > 50 ? "good" : user.credits > 10 ? "warning" : "critical"

  const handlePurchaseCredits = async (amount: number) => {
    setIsLoading(true)
    try {
      await addCredits(amount)
      setShowPurchase(false)
    } catch (error) {
      console.error("Error purchasing credits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Credit Balance</CardTitle>
            <Coins
              className={
                creditStatus === "good"
                  ? "text-green-500"
                  : creditStatus === "warning"
                    ? "text-amber-500"
                    : "text-red-500"
              }
            />
          </div>
          <CardDescription>Your available credits for searches and document access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{user.credits}</span>
              <span className="text-sm text-muted-foreground">credits</span>
            </div>

            <Progress
              value={(user.credits / 100) * 100}
              className={
                creditStatus === "good" ? "bg-green-100" : creditStatus === "warning" ? "bg-amber-100" : "bg-red-100"
              }
            />

            {creditStatus === "warning" && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Your credits are running low</span>
              </div>
            )}

            {creditStatus === "critical" && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Critical credit level! Add more credits to continue</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setShowPurchase(!showPurchase)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Add Credits
          </Button>
        </CardFooter>
      </Card>

      {showPurchase && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Purchase Credits</CardTitle>
            <CardDescription>Select a credit package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24"
                onClick={() => handlePurchaseCredits(50)}
                disabled={isLoading}
              >
                <span className="text-2xl font-bold">50</span>
                <span className="text-sm text-muted-foreground">₹499</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 border-2 border-blue-500"
                onClick={() => handlePurchaseCredits(100)}
                disabled={isLoading}
              >
                <span className="text-2xl font-bold">100</span>
                <span className="text-sm text-muted-foreground">₹899</span>
                <span className="text-xs text-blue-500">Best Value</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24"
                onClick={() => handlePurchaseCredits(200)}
                disabled={isLoading}
              >
                <span className="text-2xl font-bold">200</span>
                <span className="text-sm text-muted-foreground">₹1699</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setShowPurchase(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setShowPurchase(false)} disabled={isLoading}>
              Custom Amount
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
