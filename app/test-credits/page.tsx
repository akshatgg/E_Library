"use client"

import { CreditTester } from "@/components/credit-system/credit-tester"
import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TestCreditsPage() {
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Credit System Testing</h1>
          <p className="mb-6">Please sign in to test the credit system</p>
          <Button onClick={() => router.push("/auth/signin")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Credit System Testing</h1>
          <p className="text-muted-foreground">Test the complete credit purchase and spending functionality</p>
        </div>

        <CreditTester />
      </div>
    </div>
  )
}
