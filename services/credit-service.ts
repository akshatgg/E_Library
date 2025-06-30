"use client"

import { useAuthContext } from "@/components/auth-provider"
import { useState, useCallback } from "react"

export const CREDIT_COSTS = {
  CASE_LAW_SEARCH: 1,
  DOCUMENT_VIEW: 2,
  DOCUMENT_DOWNLOAD: 5,
  FORM_GENERATION: 3,
  PREMIUM_FEATURE: 10,
}

export type CreditTransaction = {
  id: string
  userId: string
  amount: number
  type: "purchase" | "usage"
  description: string
  timestamp: Date
}

export function useCreditService() {
  const { user, useCredits, addCredits } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [isSpending, setIsSpending] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const hasEnoughCredits = useCallback(
    (amount: number) => {
      if (!user) return false
      return user.credits >= amount
    },
    [user],
  )

  const spendCredits = useCallback(
    async (amount: number, description: string) => {
      setError(null)

      if (!user) {
        setError("User not authenticated")
        return false
      }

      if (user.credits < amount) {
        setError(`Insufficient credits. You need ${amount} credits but have ${user.credits}.`)
        return false
      }

      setIsSpending(true)
      let success = false
      try {
        await useCredits(amount)
        console.log(`✅ Successfully spent ${amount} credits for: ${description}`)
        success = true
        return success
      } catch (err: any) {
        console.error(`❌ Failed to spend credits:`, err)
        setError(err.message || "Failed to process credits")
        return success
      } finally {
        setIsSpending(false)
      }
    },
    [user, useCredits],
  )

  const purchaseCredits = useCallback(
    async (amount: number) => {
      setError(null)
      setIsPurchasing(true)

      try {
        await addCredits(amount)
        console.log(`✅ Successfully purchased ${amount} credits`)
        return true
      } catch (err: any) {
        console.error(`❌ Failed to purchase credits:`, err)
        setError(err.message || "Failed to purchase credits")
        return false
      } finally {
        setIsPurchasing(false)
      }
    },
    [addCredits],
  )

  const getRemainingCredits = useCallback(() => {
    return user?.credits || 0
  }, [user])

  const getCreditStatus = useCallback(() => {
    const credits = getRemainingCredits()
    if (credits > 50) return { status: "good", color: "green", message: "You have plenty of credits" }
    if (credits > 10) return { status: "warning", color: "amber", message: "Your credits are running low" }
    return { status: "critical", color: "red", message: "Critical credit level! Add more credits to continue" }
  }, [getRemainingCredits])

  return {
    hasEnoughCredits,
    spendCredits,
    purchaseCredits,
    getRemainingCredits,
    getCreditStatus,
    error,
    isSpending,
    isPurchasing,
    creditCosts: CREDIT_COSTS,
  }
}
