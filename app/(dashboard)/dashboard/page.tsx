"use client"

import { useAuthContext } from "@/components/auth-provider"
import { CreditDisplay } from "@/components/credit-system/credit-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Search, FileText, Scale, User, Coins } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthContext()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to E-Library</h1>
          <p className="mb-6">Please sign in to access the dashboard</p>
          <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Case Laws</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Access frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/case-laws")}
                  >
                    <Search className="h-6 w-6 mb-2" />
                    <span>Case Law Search</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/documents")}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Documents</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/valuation")}
                  >
                    <Scale className="h-6 w-6 mb-2" />
                    <span>Valuation</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <span>Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => router.push("/test-credits")}
                  >
                    <Coins className="h-6 w-6 mb-2" />
                    <span>Test Credits</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <CreditDisplay />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Searched for "Section 68"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Viewed document "Partnership Deed"</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">Added 50 credits</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
