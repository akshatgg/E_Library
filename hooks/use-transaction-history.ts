"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/auth-provider"

interface Transaction {
  id: string
  orderId: string
  type: string
  credits: number
  amount: number
  status: "success" | "failed" | "pending"
  timestamp: Date
  description: string
  error?: {
    code: string
    description: string
  }
}

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, getTransactions } = useAuthContext()

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log("Fetching transactions for user:", user.uid)
      
      // Use the auth provider's getTransactions method which handles Firebase and fallback
      const userTransactions = await getTransactions()
      
      console.log("Fetched transactions:", userTransactions.length)
      
      // Sort transactions by timestamp (newest first)
      const sortedTransactions = userTransactions
        .map((transaction: any) => ({
          ...transaction,
          timestamp: transaction.timestamp instanceof Date ? 
            transaction.timestamp : 
            new Date(transaction.timestamp)
        }))
        .sort((a: Transaction, b: Transaction) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

      setTransactions(sortedTransactions)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user?.uid]) // Only depend on user ID, not the entire user object

  const refetch = () => {
    console.log("Manual transaction refetch triggered")
    fetchTransactions()
  }

  return {
    transactions,
    loading,
    error,
    refetch,
  }
}
