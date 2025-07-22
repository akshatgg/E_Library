import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return empty object
    return {}
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    console.log("Fetching user data for:", userId)

    const users = await readUsers()
    const userData = users[userId] || { credits: 0, transactions: [] }

    console.log("User data found:", userData)

    return NextResponse.json({
      success: true,
      credits: userData.credits,
      transactions: userData.transactions,
    })
  } catch (error) {
    console.error("Error reading user data:", error)
    return NextResponse.json(
      { 
        error: "Failed to read user data", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
