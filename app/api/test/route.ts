import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const hasRazorpayKeyId = !!process.env.RAZORPAY_KEY_ID
    const hasRazorpayKeySecret = !!process.env.RAZORPAY_KEY_SECRET
    
    return NextResponse.json({
      status: "API is working",
      environment: {
        hasRazorpayKeyId,
        hasRazorpayKeySecret,
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      { error: "Test API failed" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      status: "POST request received",
      receivedData: body,
      environment: {
        hasRazorpayKeyId: !!process.env.RAZORPAY_KEY_ID,
        hasRazorpayKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test API POST error:", error)
    return NextResponse.json(
      { error: "Test API POST failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
