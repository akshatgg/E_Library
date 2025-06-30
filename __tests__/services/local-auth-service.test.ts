"use client"

import { renderHook, act } from "@testing-library/react"
import { useAuth } from "@/services/local-auth-service"

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
})

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe("Initial State", () => {
    it("should initialize with no user and loading false", async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for useEffect to complete
      })

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it("should load user from localStorage if available", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 100,
        lastLogin: new Date().toISOString(),
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for useEffect to complete
      })

      expect(result.current.user).toEqual(
        expect.objectContaining({
          id: "user-1",
          email: "test@example.com",
          displayName: "Test User",
        }),
      )
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe("Sign In", () => {
    it("should sign in successfully with valid credentials", async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        const user = await result.current.signIn("user@example.com", "password")
        expect(user).toEqual(
          expect.objectContaining({
            email: "user@example.com",
            displayName: "Demo User",
          }),
        )
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("auth_user", expect.stringContaining("user@example.com"))
    })

    it("should throw error for invalid credentials", async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await expect(result.current.signIn("invalid@example.com", "password")).rejects.toThrow("User not found")
      })

      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe("Sign Up", () => {
    it("should create new user successfully", async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        const user = await result.current.signUp("newuser@example.com", "password", "New User")
        expect(user).toEqual(
          expect.objectContaining({
            email: "newuser@example.com",
            displayName: "New User",
            credits: 50,
          }),
        )
      })

      expect(result.current.isAuthenticated).toBe(true)
    })

    it("should throw error if user already exists", async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await expect(result.current.signUp("user@example.com", "password", "Test User")).rejects.toThrow(
          "User already exists",
        )
      })
    })
  })

  describe("Credit Management", () => {
    it("should add credits successfully", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 50,
        lastLogin: new Date(),
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for initial load
      })

      await act(async () => {
        const updatedUser = await result.current.addCredits(25)
        expect(updatedUser.credits).toBe(75)
      })

      expect(result.current.user?.credits).toBe(75)
    })

    it("should use credits successfully when sufficient balance", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 50,
        lastLogin: new Date(),
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for initial load
      })

      await act(async () => {
        const updatedUser = await result.current.useCredits(10)
        expect(updatedUser.credits).toBe(40)
      })

      expect(result.current.user?.credits).toBe(40)
    })

    it("should throw error when insufficient credits", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 5,
        lastLogin: new Date(),
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for initial load
      })

      await act(async () => {
        await expect(result.current.useCredits(10)).rejects.toThrow("Insufficient credits")
      })

      expect(result.current.user?.credits).toBe(5) // Should remain unchanged
    })
  })

  describe("Sign Out", () => {
    it("should sign out successfully", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 50,
        lastLogin: new Date(),
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for initial load
      })

      expect(result.current.isAuthenticated).toBe(true)

      await act(async () => {
        await result.current.signOut()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_user")
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token")
    })
  })
})
