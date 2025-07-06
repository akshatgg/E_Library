import { NextResponse } from "next/server"
import EmailService from "@/services/email-service"
export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, category, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    const result = await EmailService.sendContactForm({
      name,
      email,
      phone,
      subject,
      category,
      message,
    })

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
