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

async function writeUsers(users: any) {
  try {
    // Ensure directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error writing users file:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, credits } = await request.json()

    if (!userId || !credits) {
      return NextResponse.json(
        { error: "User ID and credits are required" },
        { status: 400 }
      )
    }

    console.log(`Adding ${credits} credits to user ${userId} via simple storage`)

    // Read current user data
    const users = await readUsers()
    
    if (!users[userId]) {
      users[userId] = { credits: 0, transactions: [] }
    }

    const currentCredits = users[userId].credits || 0
    const newCredits = currentCredits + parseInt(credits)

    // Update user credits
    users[userId].credits = newCredits

    // Save to file
    await writeUsers(users)

    console.log(`Credits updated successfully: ${currentCredits} → ${newCredits}`)

    return NextResponse.json({
      success: true,
      message: "Credits added successfully",
      userId,
      addedCredits: credits,
      newBalance: newCredits,
    })
  } catch (error) {
    console.error("Error in add credits endpoint:", error)
    return NextResponse.json(
      { 
        error: "Failed to process credit addition", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
