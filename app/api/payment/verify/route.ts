import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    console.log("Payment verification started")
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      credits,
      amount,
      userId,
    } = await request.json()

    console.log("Payment verification data:", {
      razorpay_order_id,
      razorpay_payment_id,
      credits,
      amount,
      userId,
    })

    // Check if environment variables are available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET not found in environment variables")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    console.log("Signature verification:", {
      expectedSignature,
      receivedSignature: razorpay_signature,
      isAuthentic,
    })

    if (!isAuthentic) {
      return NextResponse.json(
        { error: "Payment verification failed - Invalid signature" },
        { status: 400 }
      )
    }

    // Payment is verified, return success (credits will be added by client-side addCredits function)
    const transaction = {
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      type: "purchase",
      credits: parseInt(credits),
      amount: amount,
      status: "success",
      timestamp: new Date(),
      description: `Purchased ${credits} credits`,
    }

    console.log("Payment verification completed successfully, transaction:", transaction)

    // Don't update credits here - let the client-side addCredits function handle it
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      transaction,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : "No stack trace"
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
    })
    
    return NextResponse.json(
      { 
        error: "Payment verification failed", 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
