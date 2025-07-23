"use client"

import { useAuthContext } from "@/components/auth-provider"
import { CreditDisplay } from "@/components/credit-system/credit-display"
import { TransactionDetailsDialog } from "@/components/transaction-details-dialog"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, CreditCard, History, Settings, IndianRupee, Clock, CheckCircle, XCircle, Loader2, RefreshCw, Eye } from "lucide-react"
import { useRazorpay } from "@/hooks/use-razorpay"
import { useTransactionHistory } from "@/hooks/use-transaction-history"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, isAuthenticated, signOut, refreshUserData } = useAuthContext()
  const router = useRouter()
  const { makePayment, isLoading: isPaymentLoading } = useRazorpay()
  const { transactions, loading: transactionsLoading, refetch } = useTransactionHistory()
  const { toast } = useToast()
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isAuthenticated, router])

  const handleCreditPurchase = async (credits: number, amount: number) => {
    try {
      await makePayment({ 
        credits, 
        amount,
        onSuccess: async (transaction) => {
          console.log("Payment success callback triggered:", transaction)
          // Refetch transactions and refresh user data after successful payment
          await Promise.all([
            refetch(),
            refreshUserData()
          ])
          console.log("Transaction history and user data refreshed")
        }
      })
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Please sign in to view your profile</p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/signin")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and credits</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="credits">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credits
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{user.displayName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                        <p className="capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                        <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credits">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Management</CardTitle>
                    <CardDescription>View and purchase credits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                          <p className="text-3xl font-bold">{user.credits} credits</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Credit Usage</p>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <span>Case Law Search: 1 credit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span>Document View: 2 credits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                            <span>Document Download: 5 credits</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                          variant="outline" 
                          className="h-auto py-4 flex flex-col hover:border-blue-500 transition-colors"
                          onClick={() => handleCreditPurchase(50, 499)}
                          disabled={isPaymentLoading}
                        >
                          {isPaymentLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <>
                              <span className="text-2xl font-bold">50</span>
                              <span className="text-sm text-muted-foreground">credits</span>
                              <span className="mt-2 font-medium flex items-center">
                                <IndianRupee className="h-4 w-4" />499
                              </span>
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-auto py-4 flex flex-col border-2 border-blue-500 hover:border-blue-600 transition-colors"
                          onClick={() => handleCreditPurchase(100, 899)}
                          disabled={isPaymentLoading}
                        >
                          {isPaymentLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <>
                              <span className="text-2xl font-bold">100</span>
                              <span className="text-sm text-muted-foreground">credits</span>
                              <span className="mt-2 font-medium flex items-center">
                                <IndianRupee className="h-4 w-4" />899
                              </span>
                              <span className="text-xs text-blue-500 mt-1">Best Value</span>
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-auto py-4 flex flex-col hover:border-blue-500 transition-colors"
                          onClick={() => handleCreditPurchase(200, 1699)}
                          disabled={isPaymentLoading}
                        >
                          {isPaymentLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <>
                              <span className="text-2xl font-bold">200</span>
                              <span className="text-sm text-muted-foreground">credits</span>
                              <span className="mt-2 font-medium flex items-center">
                                <IndianRupee className="h-4 w-4" />1699
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your credit purchase and usage history</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={refetch}
                        disabled={transactionsLoading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${transactionsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Loading transactions...</span>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No transaction history available yet</p>
                        <p className="text-sm mt-2">Purchase credits to see your transaction history here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            onClick={() => handleTransactionClick(transaction)}
                            className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                  {transaction.status === "success" && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {transaction.status === "failed" && (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  {transaction.status === "pending" && (
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium text-sm">{transaction.description}</h4>
                                    <Badge
                                      variant={
                                        transaction.status === "success"
                                          ? "default"
                                          : transaction.status === "failed"
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {transaction.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(transaction.timestamp).toLocaleDateString()} at{" "}
                                    {new Date(transaction.timestamp).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-sm font-semibold text-green-600">+{transaction.credits}</span>
                                    <span className="text-xs text-muted-foreground">credits</span>
                                  </div>
                                  <div className="flex items-center justify-end space-x-1">
                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">{transaction.amount}</span>
                                  </div>
                                </div>
                                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <CreditDisplay />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditProfileOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      />
    </div>
  )
}
