import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    console.log("Creating Razorpay order...")
    
    // Check environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not found")
      return NextResponse.json(
        { error: "Server configuration error - Razorpay credentials missing" },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const { amount, currency = "INR", credits } = await request.json()

    console.log("Order request data:", { amount, currency, credits })

    if (!amount || !credits) {
      return NextResponse.json(
        { error: "Amount and credits are required" },
        { status: 400 }
      )
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    console.log("Creating order with options:", options)

    const order = await razorpay.orders.create(options)

    console.log("Order created successfully:", order.id)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      credits,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error details:", errorMessage)
    
    return NextResponse.json(
      { 
        error: "Failed to create payment order", 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
