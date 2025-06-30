"use client"

import { useState, useEffect } from "react"

// User types
export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: "admin" | "user"
  credits: number
  lastLogin: Date
}

// Mock user database
const MOCK_USERS: Record<string, User> = {
  "user-1": {
    id: "user-1",
    email: "user@example.com",
    displayName: "Demo User",
    role: "user",
    credits: 100,
    lastLogin: new Date(),
  },
  "admin-1": {
    id: "admin-1",
    email: "admin@example.com",
    displayName: "Admin User",
    role: "admin",
    credits: 999,
    lastLogin: new Date(),
  },
}

// Local storage keys
const AUTH_USER_KEY = "auth_user"
const AUTH_TOKEN_KEY = "auth_token"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize auth state from local storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY)
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (err) {
      console.error("Error loading auth state:", err)
      setError(err instanceof Error ? err : new Error("Failed to load auth state"))
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Simple mock authentication
      const mockUser = Object.values(MOCK_USERS).find((u) => u.email === email)

      if (!mockUser) {
        throw new Error("User not found")
      }

      // In a real app, we would validate the password here
      // For demo purposes, any password works

      // Update last login
      mockUser.lastLogin = new Date()

      // Store in local storage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser))
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${mockUser.id}`)

      setUser(mockUser)
      return mockUser
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Authentication failed"))
      throw err
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      // Check if user already exists
      if (Object.values(MOCK_USERS).some((u) => u.email === email)) {
        throw new Error("User already exists")
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        displayName,
        role: "user",
        credits: 50, // New users get 50 credits
        lastLogin: new Date(),
      }

      // Add to mock database
      MOCK_USERS[newUser.id] = newUser

      // Store in local storage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser))
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${newUser.id}`)

      setUser(newUser)
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Registration failed"))
      throw err
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"))
      throw err
    }
  }

  // Add credits to user account
  const addCredits = async (amount: number) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      const updatedUser = { ...user, credits: user.credits + amount }
      MOCK_USERS[user.id] = updatedUser
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add credits"))
      throw err
    }
  }

  // Use credits for a service
  const useCredits = async (amount: number) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    if (user.credits < amount) {
      throw new Error("Insufficient credits")
    }

    try {
      const updatedUser = { ...user, credits: user.credits - amount }
      MOCK_USERS[user.id] = updatedUser
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to use credits"))
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    addCredits,
    useCredits,
    isAuthenticated: !!user,
  }
}
