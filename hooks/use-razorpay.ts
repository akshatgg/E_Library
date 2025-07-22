"use client"

import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentOptions {
  credits: number
  amount: number
}

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

export function useRazorpay() {
  const { user, refreshUserData, addCredits } = useAuthContext()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const makePayment = async ({ credits, amount }: PaymentOptions) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script")
      }

      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          credits,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order")
      }

      const orderData = await orderResponse.json()

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "E-Library Credits",
        description: `Purchase ${credits} credits`,
        order_id: orderData.orderId,
        prefill: {
          name: user.displayName || "User",
          email: user.email || "",
        },
        theme: {
          color: "#3B82F6",
        },
        handler: async function (response: any) {
          try {
            console.log("Payment success response:", response)
            
            // Try the main verification endpoint first, then fallback to simple storage
            let verifyResponse
            let verifyData
            
            try {
              // Try Firebase Admin verification first
              verifyResponse = await fetch("/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  credits,
                  amount,
                  userId: user.uid,
                }),
              })

              console.log("Verify response status:", verifyResponse.status)

              if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json()
                console.error("Firebase verification failed:", errorData)
                throw new Error("Firebase verification failed")
              }

              verifyData = await verifyResponse.json()
              console.log("Firebase verification successful:", verifyData)
            } catch (firebaseError) {
              console.log("Firebase verification failed, trying simple storage...")
              
              // Fallback to simple storage verification
              verifyResponse = await fetch("/api/payment/verify-simple", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  credits,
                  amount,
                  userId: user.uid,
                }),
              })

              if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json()
                console.error("Simple storage verification failed:", errorData)
                throw new Error(errorData.details || errorData.error || "Payment verification failed")
              }

              verifyData = await verifyResponse.json()
              console.log("Simple storage verification successful:", verifyData)
            }

            toast({
              title: "Payment Successful!",
              description: `${credits} credits have been added to your account`,
            })

            // Add credits using the auth provider function (this updates Firebase)
            try {
              console.log(`Adding ${credits} credits to user account via addCredits function...`)
              await addCredits(credits)
              console.log("Credits added successfully via addCredits function")
            } catch (creditError) {
              console.error("Failed to add credits via addCredits function:", creditError)
              // Fallback to refresh user data
              setTimeout(async () => {
                console.log("Fallback: Refreshing user data after payment success...")
                await refreshUserData()
              }, 1000)
            }
            
            return verifyData.transaction
          } catch (error) {
            console.error("Payment verification error:", error)
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            
            toast({
              title: "Payment Verification Failed",
              description: `Error: ${errorMessage}. Please contact support if credits were not added.`,
              variant: "destructive",
            })
          }
        },
        modal: {
          ondismiss: async function () {
            // Log failed/cancelled payment
            await fetch("/api/payment/failed", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: orderData.orderId,
                error_code: "USER_CANCELLED",
                error_description: "Payment cancelled by user",
                credits,
                amount,
                userId: user.uid,
              }),
            })

            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user",
              variant: "destructive",
            })
          },
        },
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on("payment.failed", async function (response: any) {
        // Log failed payment
        await fetch("/api/payment/failed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            error_code: response.error.code,
            error_description: response.error.description,
            credits,
            amount,
            userId: user.uid,
          }),
        })

        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment failed. Please try again.",
          variant: "destructive",
        })
      })

      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    makePayment,
    isLoading,
  }
}
