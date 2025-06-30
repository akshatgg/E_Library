"use client"

import { useState } from "react"
import { Crown, Check, X, Zap, Shield, Search, Download, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentModal } from "@/components/payment/payment-modal"
import { useSubscription } from "@/lib/subscription-context"

interface SubscriptionPaywallProps {
  isOpen: boolean
  onClose: () => void
  searchesUsed: number
  totalSearches: number
}

export function SubscriptionPaywall({ isOpen, onClose, searchesUsed, totalSearches }: SubscriptionPaywallProps) {
  const [showPayment, setShowPayment] = useState(false)
  const { resetTrialSearches } = useSubscription()

  const handleSubscriptionSuccess = async () => {
    resetTrialSearches()
    onClose()
    // Refresh the page to update subscription status
    window.location.reload()
  }

  const features = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Unlimited Searches",
      description: "Search through our entire database without limits",
      free: "3 searches only",
      premium: "Unlimited",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Full Case Details",
      description: "Access complete case law documents and analysis",
      free: "Preview only",
      premium: "Full access",
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "PDF Downloads",
      description: "Download case laws and documents in PDF format",
      free: "Not available",
      premium: "Unlimited downloads",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Advanced Filters",
      description: "Use advanced search filters and sorting options",
      free: "Basic filters",
      premium: "All filters",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "AI Recommendations",
      description: "Get AI-powered case recommendations and insights",
      free: "Not available",
      premium: "Full AI features",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Priority Support",
      description: "Get priority customer support and assistance",
      free: "Community support",
      premium: "Priority support",
    },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Crown className="h-6 w-6 text-yellow-500" />
              Upgrade to Premium
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Usage Stats */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Your Trial Usage</h3>
                    <p className="text-muted-foreground">
                      You've used {searchesUsed} out of {totalSearches} free searches
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{searchesUsed}/3</div>
                    <div className="text-sm text-muted-foreground">Free searches</div>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(searchesUsed / 3) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* What You Get */}
            <div>
              <h3 className="text-xl font-semibold mb-4">See what you're missing with Premium</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-1">{feature.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Free:</span>
                              <span className="text-red-600">{feature.free}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Premium:</span>
                              <span className="text-green-600 font-medium">{feature.premium}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Premium Plan
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-4xl font-bold">₹5,999</div>
                  <div className="text-muted-foreground">per year</div>
                  <Badge variant="secondary" className="mt-2">
                    Save 50% vs monthly
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Unlimited case law searches</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Full document access & downloads</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>AI-powered recommendations</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Priority customer support</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => setShowPayment(true)}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>

                <p className="text-xs text-muted-foreground">30-day money-back guarantee • Cancel anytime</p>
              </CardContent>
            </Card>

            {/* Sample Content Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview: What Premium Users See</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-semibold">Sample Case: Income Tax vs. ABC Ltd.</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Section 143(3) - Assessment proceedings under Income Tax Act...
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline">Section 143(3)</Badge>
                      <Badge variant="outline">ITAT Mumbai</Badge>
                      <Badge variant="outline">2024</Badge>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Crown className="h-4 w-4" />
                        <span className="text-sm font-medium">Premium Content</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Full case details, judgment analysis, and downloadable PDF available with Premium
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Continue with Free
            </Button>
            <Button onClick={() => setShowPayment(true)} className="flex-1">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handleSubscriptionSuccess}
        amount={5999}
        description="E-Library Premium Subscription (1 Year)"
      />
    </>
  )
}
