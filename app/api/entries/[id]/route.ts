import { type NextRequest, NextResponse } from "next/server"

// This would typically come from a database
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const entry = entries.find((e) => e.id === params.id)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching entry:", error)
    return NextResponse.json({ error: "Failed to fetch entry" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const entryIndex = entries.findIndex((e) => e.id === params.id)

    if (entryIndex === -1) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    entries[entryIndex] = {
      ...entries[entryIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(entries[entryIndex])
  } catch (error) {
    console.error("Error updating entry:", error)
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const entryIndex = entries.findIndex((e) => e.id === params.id)

    if (entryIndex === -1) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    entries.splice(entryIndex, 1)

    return NextResponse.json({ message: "Entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting entry:", error)
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
  }
}
