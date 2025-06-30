"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

interface SubscriptionContextType {
  isSubscribed: boolean
  trialSearchesLeft: number
  totalSearches: number
  showPaywall: boolean
  setShowPaywall: (show: boolean) => void
  decrementTrialSearches: () => void
  resetTrialSearches: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [trialSearchesLeft, setTrialSearchesLeft] = useState(3) // 3 free searches
  const [totalSearches, setTotalSearches] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    if (user) {
      // Check user subscription status
      setIsSubscribed(user.subscriptionStatus === "active")

      // Load trial searches from localStorage
      const savedSearches = localStorage.getItem(`trialSearches_${user.id}`)
      if (savedSearches) {
        const searches = Number.parseInt(savedSearches)
        setTrialSearchesLeft(Math.max(0, 3 - searches))
        setTotalSearches(searches)
      }
    }
  }, [user])

  const decrementTrialSearches = () => {
    if (!isSubscribed && trialSearchesLeft > 0) {
      const newSearches = totalSearches + 1
      setTotalSearches(newSearches)
      setTrialSearchesLeft(Math.max(0, 3 - newSearches))

      if (user) {
        localStorage.setItem(`trialSearches_${user.id}`, newSearches.toString())
      }

      // Show paywall after 2 searches (1 search left)
      if (newSearches >= 2) {
        setShowPaywall(true)
      }
    }
  }

  const resetTrialSearches = () => {
    setTrialSearchesLeft(3)
    setTotalSearches(0)
    if (user) {
      localStorage.removeItem(`trialSearches_${user.id}`)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        trialSearchesLeft,
        totalSearches,
        showPaywall,
        setShowPaywall,
        decrementTrialSearches,
        resetTrialSearches,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
