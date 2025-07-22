"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [apiTest, setApiTest] = useState<any>(null)
  const [orderTest, setOrderTest] = useState<any>(null)
  const [verifyTest, setVerifyTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setApiTest({ status: response.status, data })
    } catch (error) {
      setApiTest({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testCreateOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 499,
          credits: 50,
        }),
      })
      const data = await response.json()
      setOrderTest({ status: response.status, data })
    } catch (error) {
      setOrderTest({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testVerifyPayment = async () => {
    setLoading(true)
    try {
      // Mock payment verification data
      const mockData = {
        razorpay_order_id: "order_test123",
        razorpay_payment_id: "pay_test123",
        razorpay_signature: "test_signature",
        credits: 50,
        amount: 499,
        userId: "test_user_123",
      }

      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      })
      const data = await response.json()
      setVerifyTest({ status: response.status, data })
    } catch (error) {
      setVerifyTest({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const testSimpleVerification = async () => {
    setLoading(true)
    try {
      // Mock payment verification data
      const mockData = {
        razorpay_order_id: "order_test123",
        razorpay_payment_id: "pay_test123",
        razorpay_signature: "test_signature",
        credits: 50,
        amount: 499,
        userId: "test_user_123",
      }

      const response = await fetch("/api/payment/verify-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      })
      const data = await response.json()
      setVerifyTest({ status: response.status, data: { ...data, endpoint: "simple" } })
    } catch (error) {
      setVerifyTest({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">API Debug Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoint</CardTitle>
            <CardDescription>Test if the API is working and environment variables are loaded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testAPI} disabled={loading}>
              Test API
            </Button>
            {apiTest && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Create Order</CardTitle>
            <CardDescription>Test Razorpay order creation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testCreateOrder} disabled={loading}>
              Test Create Order
            </Button>
            {orderTest && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(orderTest, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Payment Verification</CardTitle>
            <CardDescription>Test payment verification endpoints (with mock data)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testVerifyPayment} disabled={loading}>
                Test Firebase Verification
              </Button>
              <Button onClick={testSimpleVerification} disabled={loading} variant="outline">
                Test Simple Verification
              </Button>
            </div>
            {verifyTest && (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(verifyTest, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
