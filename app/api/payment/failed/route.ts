import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      error_code,
      error_description,
      credits,
      amount,
      userId,
    } = await request.json()

    // Log failed payment transaction
    const transaction = {
      id: razorpay_payment_id || `failed_${Date.now()}`,
      orderId: razorpay_order_id,
      type: "purchase",
      credits: parseInt(credits),
      amount: amount,
      status: "failed",
      timestamp: new Date(),
      description: `Failed to purchase ${credits} credits`,
      error: {
        code: error_code,
        description: error_description,
      },
    }

    if (userId) {
      const userRef = adminDb.collection("users").doc(userId)
      const userDoc = await userRef.get()
      
      if (userDoc.exists) {
        const userData = userDoc.data()
        const currentTransactions = userData?.transactions || []
        
        await userRef.update({
          transactions: [...currentTransactions, transaction],
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Failed payment logged successfully",
      transaction,
    })
  } catch (error) {
    console.error("Error logging failed payment:", error)
    return NextResponse.json(
      { error: "Failed to log payment failure" },
      { status: 500 }
    )
  }
}
