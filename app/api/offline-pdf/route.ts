import { NextResponse } from "next/server"
import { generateOfflinePdf } from "@/lib/generate-offline-pdf"

export async function GET() {
  try {
    const pdfBlob = generateOfflinePdf()
    const buffer = await pdfBlob.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="offline.pdf"',
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    })
  } catch (error) {
    console.error("Error generating offline PDF:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to generate offline PDF" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
