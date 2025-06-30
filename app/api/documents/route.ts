import { type NextRequest, NextResponse } from "next/server"
import { type LegalDocument, DocumentType, LegalCategory } from "@/models/legal-document"

// Mock database - replace with actual database
const documents: LegalDocument[] = [
  {
    id: "1",
    title: "ABC Partnership Deed",
    type: DocumentType.PARTNERSHIP_DEED,
    category: LegalCategory.COMMERCIAL,
    fileUrl: "/uploads/partnership_deed_1.pdf",
    uploadDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    fileSize: 1024000,
    pageCount: 15,
    tags: ["partnership", "business", "legal"],
    metadata: {
      author: "Legal Team",
      panNumber: "ABCDE1234F",
    },
    status: "completed" as any,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as DocumentType
    const category = searchParams.get("category") as LegalCategory
    const year = searchParams.get("year")

    let filteredDocuments = [...documents]

    if (type) {
      filteredDocuments = filteredDocuments.filter((doc) => doc.type === type)
    }

    if (category) {
      filteredDocuments = filteredDocuments.filter((doc) => doc.category === category)
    }

    if (year) {
      filteredDocuments = filteredDocuments.filter((doc) => new Date(doc.uploadDate).getFullYear().toString() === year)
    }

    return NextResponse.json(filteredDocuments)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newDocument: LegalDocument = {
      id: Date.now().toString(),
      title: data.title,
      type: data.type,
      category: data.category,
      fileUrl: data.fileUrl || "",
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      fileSize: data.fileSize || 0,
      pageCount: data.pageCount,
      tags: data.tags || [],
      metadata: data.metadata || {},
      status: data.status || "draft",
    }

    documents.unshift(newDocument)

    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}
