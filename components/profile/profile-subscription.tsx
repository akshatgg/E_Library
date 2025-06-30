"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, CheckCircle, AlertCircle, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserData } from "@/lib/auth"
import { PaymentModal } from "@/components/payment/payment-modal"

interface ProfileSubscriptionProps {
  user: UserData
}

export function ProfileSubscription({ user }: ProfileSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const isActive = user.subscriptionStatus === "active"
  const isTrial = user.subscriptionStatus === "trial"
  const subscriptionExpiry = user.subscriptionExpiry
    ? new Date(user.subscriptionExpiry)
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) // Default to 14 days trial

  const daysRemaining = Math.ceil((subscriptionExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const handleSubscribe = () => {
    setShowPaymentModal(true)
  }

  const handleSubscriptionSuccess = async () => {
    try {
      setIsLoading(true)

      // In a real app, this would be handled by a webhook from a payment provider
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionStatus: "active",
          subscriptionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update subscription")
      }

      toast({
        title: "Subscription Activated",
        description: "Your subscription has been activated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowPaymentModal(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Current Subscription
              {isActive ? (
                <Badge variant="default" className="ml-2 bg-green-500">
                  Active
                </Badge>
              ) : isTrial ? (
                <Badge variant="default" className="ml-2 bg-blue-500">
                  Trial
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-2">
                  Inactive
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Manage your subscription details and payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="font-medium">Subscription Status</div>
                <div className="flex items-center">
                  {isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Active
                    </>
                  ) : isTrial ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Trial
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Inactive
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b">
                <div className="font-medium">Plan</div>
                <div className="flex items-center">{isActive ? "Premium" : isTrial ? "Trial" : "None"}</div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b">
                <div className="font-medium">Expiry Date</div>
                <div>
                  {subscriptionExpiry.toLocaleDateString()}
                  {daysRemaining > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">({daysRemaining} days remaining)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-medium">Payment Method</div>
                <div>
                  {isActive ? (
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                      •••• •••• •••• 4242
                    </div>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubscribe} disabled={isLoading || isActive} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isActive ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Subscribed
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isTrial ? "Upgrade to Premium" : "Subscribe Now"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Premium Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Full access to all legal documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Unlimited PDF downloads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Advanced search capabilities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Citation network analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI-powered document recommendations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="font-medium">Documents Viewed</div>
                  <div>43</div>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="font-medium">PDFs Downloaded</div>
                  <div>12</div>
                </div>
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="font-medium">Searches Performed</div>
                  <div>56</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">AI Recommendations</div>
                  <div>8</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handleSubscriptionSuccess}
        amount={5999}
        description="E-Library Premium Subscription (1 Year)"
      />
    </>
  )
}
