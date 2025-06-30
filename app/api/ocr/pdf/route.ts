import { type NextRequest, NextResponse } from "next/server"
import { PDFExtract } from "pdf.js-extract"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const pdfExtract = new PDFExtract()

    return new Promise((resolve) => {
      pdfExtract.extractBuffer(buffer, {}, (err, data) => {
        if (err) {
          resolve(NextResponse.json({ error: "PDF extraction failed" }, { status: 500 }))
          return
        }

        const text = data?.pages?.map((page) => page.content.map((item) => item.str).join(" ")).join("\n") || ""

        resolve(NextResponse.json({ text }))
      })
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
