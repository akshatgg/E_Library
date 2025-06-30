import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import type { UserData, UserRole } from "./auth"

// In a real application, this would interact with a database
// For now, we'll use localStorage on the client side
interface User extends UserData {
  password: string
}

// Default admin user
const DEFAULT_ADMIN: User = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
  password: "$2a$10$GCxaV7.3hE5lTKIe5xGC3u.Nb8A0jbZvp8MuQpuXiuWVF4vJ7ucUC", // hashed 'password'
  subscriptionStatus: "active",
  subscriptionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year
}

// User management functions
export async function initUsers(): Promise<void> {
  if (typeof window !== "undefined") {
    const users = localStorage.getItem("elibrary_users")
    if (!users) {
      localStorage.setItem("elibrary_users", JSON.stringify([DEFAULT_ADMIN]))
    }
  }
}

export async function getUsers(): Promise<User[]> {
  if (typeof window !== "undefined") {
    await initUsers()
    const users = localStorage.getItem("elibrary_users")
    return users ? JSON.parse(users) : []
  }
  return []
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((user) => user.email === email) || null
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "viewer",
): Promise<UserData> {
  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    email,
    name,
    role,
    password: hashedPassword,
    subscriptionStatus: "trial",
    subscriptionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days trial
  }

  // Save user
  const users = await getUsers()
  users.push(newUser)
  if (typeof window !== "undefined") {
    localStorage.setItem("elibrary_users", JSON.stringify(users))
  }

  // Return user data without password
  const { password: _, ...userData } = newUser
  return userData
}

export async function updateUser(id: string, data: Partial<Omit<User, "id" | "password">>): Promise<UserData> {
  const users = await getUsers()
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user data
  const updatedUser = {
    ...users[userIndex],
    ...data,
  }

  users[userIndex] = updatedUser
  if (typeof window !== "undefined") {
    localStorage.setItem("elibrary_users", JSON.stringify(users))
  }

  // Return user data without password
  const { password: _, ...userData } = updatedUser
  return userData
}

export async function deleteUser(id: string): Promise<void> {
  const users = await getUsers()
  const updatedUsers = users.filter((user) => user.id !== id)
  if (typeof window !== "undefined") {
    localStorage.setItem("elibrary_users", JSON.stringify(updatedUsers))
  }
}

export async function verifyCredentials(email: string, password: string): Promise<UserData | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  // Return user data without password
  const { password: _, ...userData } = user
  return userData
}

export async function changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const user = await getUserById(id)
  if (!user) return false

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) return false

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const users = await getUsers()
  const userIndex = users.findIndex((u) => u.id === id)
  users[userIndex].password = hashedPassword

  if (typeof window !== "undefined") {
    localStorage.setItem("elibrary_users", JSON.stringify(users))
  }

  return true
}
