"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
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
  const { user } = useAuthContext()

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Try Firebase first
      try {
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          const userData = userDoc.data()
          const userTransactions = userData.transactions || []
          
          if (userTransactions.length > 0) {
            // Sort transactions by timestamp (newest first)
            const sortedTransactions = userTransactions
              .map((transaction: any) => ({
                ...transaction,
                timestamp: transaction.timestamp?.toDate ? 
                  transaction.timestamp.toDate() : 
                  transaction.timestamp?.seconds ? 
                    new Date(transaction.timestamp.seconds * 1000) :
                    new Date(transaction.timestamp)
              }))
              .sort((a: Transaction, b: Transaction) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )

            setTransactions(sortedTransactions)
            return
          }
        }
      } catch (firebaseError) {
        console.log("Firebase fetch failed, trying simple storage:", firebaseError)
      }

      // Fallback to simple storage API
      try {
        const response = await fetch(`/api/user/transactions?userId=${user.uid}`)
        if (response.ok) {
          const data = await response.json()
          const userTransactions = data.transactions || []
          
          // Sort transactions by timestamp (newest first)
          const sortedTransactions = userTransactions
            .map((transaction: any) => ({
              ...transaction,
              timestamp: new Date(transaction.timestamp)
            }))
            .sort((a: Transaction, b: Transaction) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )

          setTransactions(sortedTransactions)
          return
        }
      } catch (apiError) {
        console.log("Simple storage API failed:", apiError)
      }

      // If both fail, set empty array
      setTransactions([])
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to fetch transaction history")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user?.uid]) // Only depend on user ID, not the entire user object

  const refetch = () => {
    fetchTransactions()
  }

  return {
    transactions,
    loading,
    error,
    refetch,
  }
}
