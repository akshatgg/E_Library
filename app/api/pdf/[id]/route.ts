import { type NextRequest, NextResponse } from "next/server"
import { createMinimalPdf } from "@/lib/mock-pdf-generator"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Generate a more detailed PDF with case ID as content
    const content = `
    Case ID: ${id}
    
    This is a mock PDF document generated for demonstration purposes.
    
    In a production environment, this would be a real legal document retrieved from a database or external API.
    
    The document would contain the full text of the case, including headnotes, judgment, and any other relevant information.
    
    For now, this placeholder serves to demonstrate the PDF viewer functionality.
    `

    const pdf = createMinimalPdf(content)

    // Return the PDF with appropriate headers
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${id}.pdf"`,
        // Add cache control headers to prevent caching issues
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
