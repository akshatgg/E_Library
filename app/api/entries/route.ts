import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration
const entries = [
  {
    id: "1",
    title: "Constitutional Law Basics",
    author: "John Smith",
    category: "1",
    description: "A comprehensive guide to constitutional law principles and applications.",
    fileUrl: "/documents/constitutional-law-basics.pdf",
    tags: ["constitutional", "law", "basics"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileSize: 2048576,
    pageCount: 150,
    thumbnail: "/placeholder.svg?height=200&width=150",
    isFavorite: false,
    readingProgress: 0,
  },
  {
    id: "2",
    title: "Criminal Procedure Manual",
    author: "Jane Doe",
    category: "2",
    description: "Step-by-step guide to criminal procedure and court processes.",
    fileUrl: "/documents/criminal-procedure-manual.pdf",
    tags: ["criminal", "procedure", "court"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    fileSize: 3145728,
    pageCount: 200,
    thumbnail: "/placeholder.svg?height=200&width=150",
    isFavorite: true,
    readingProgress: 25,
  },
  {
    id: "3",
    title: "Corporate Governance Guidelines",
    author: "Robert Johnson",
    category: "4",
    description: "Essential guidelines for corporate governance and compliance.",
    fileUrl: "/documents/corporate-governance.pdf",
    tags: ["corporate", "governance", "compliance"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    fileSize: 1572864,
    pageCount: 100,
    thumbnail: "/placeholder.svg?height=200&width=150",
    isFavorite: false,
    readingProgress: 75,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    let filteredEntries = [...entries]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchLower) ||
          entry.author.toLowerCase().includes(searchLower) ||
          entry.description.toLowerCase().includes(searchLower) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply category filter
    if (category && category !== "") {
      filteredEntries = filteredEntries.filter((entry) => entry.category === category)
    }

    // Apply sorting
    filteredEntries.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "author":
          aValue = a.author.toLowerCase()
          bValue = b.author.toLowerCase()
          break
        case "date":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return NextResponse.json(filteredEntries)
  } catch (error) {
    console.error("Error fetching entries:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newEntry = {
      id: Date.now().toString(),
      title: body.title || "",
      author: body.author || "",
      category: body.category || "",
      description: body.description || "",
      fileUrl: body.fileUrl || "",
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileSize: body.fileSize || 0,
      pageCount: body.pageCount || 0,
      thumbnail: body.thumbnail || "/placeholder.svg?height=200&width=150",
      isFavorite: false,
      readingProgress: 0,
    }

    entries.unshift(newEntry)

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    console.error("Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
