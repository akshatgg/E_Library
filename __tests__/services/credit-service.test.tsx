import { renderHook } from "@testing-library/react"
import { useCreditService } from "@/services/credit-service"
import { AuthProvider } from "@/components/auth-provider"
import type { ReactNode } from "react"

// Mock the auth context
const mockAuthContext = {
  user: {
    id: "user-1",
    email: "test@example.com",
    displayName: "Test User",
    role: "user" as const,
    credits: 50,
    lastLogin: new Date(),
  },
  loading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  addCredits: jest.fn(),
  useCredits: jest.fn(),
  isAuthenticated: true,
}

jest.mock("@/components/auth-provider", () => ({
  ...jest.requireActual("@/components/auth-provider"),
  useAuthContext: () => mockAuthContext,
}))

describe("useCreditService Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthContext.user.credits = 50
  })

  const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

  describe("hasEnoughCredits", () => {
    it("should return true when user has enough credits", () => {
      const { result } = renderHook(() => useCreditService(), { wrapper })

      expect(result.current.hasEnoughCredits(25)).toBe(true)
      expect(result.current.hasEnoughCredits(50)).toBe(true)
    })

    it("should return false when user does not have enough credits", () => {
      const { result } = renderHook(() => useCreditService(), { wrapper })

      expect(result.current.hasEnoughCredits(75)).toBe(false)
      expect(result.current.hasEnoughCredits(100)).toBe(false)
    })

    it("should return false when user is not authenticated", () => {
      mockAuthContext.user = null as any
      mockAuthContext.isAuthenticated = false

      const { result } = renderHook(() => useCreditService(), { wrapper })

      expect(result.current.hasEnoughCredits(10)).toBe(false)
    })
  })

  describe("spendCredits", () => {
    it("should spend credits successfully when user has enough", async () => {
      mockAuthContext.useCredits.mockResolvedValue({
        ...mockAuthContext.user,
        credits: 40,
      })

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.spendCredits(10, "Test Action")

      expect(success).toBe(true)
      expect(mockAuthContext.useCredits).toHaveBeenCalledWith(10)
      expect(result.current.error).toBeNull()
    })

    it("should fail when user does not have enough credits", async () => {
      mockAuthContext.user.credits = 5

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.spendCredits(10, "Test Action")

      expect(success).toBe(false)
      expect(result.current.error).toContain("Insufficient credits")
      expect(mockAuthContext.useCredits).not.toHaveBeenCalled()
    })

    it("should fail when user is not authenticated", async () => {
      mockAuthContext.user = null as any
      mockAuthContext.isAuthenticated = false

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.spendCredits(10, "Test Action")

      expect(success).toBe(false)
      expect(result.current.error).toContain("User not authenticated")
    })

    it("should handle useCredits errors", async () => {
      mockAuthContext.useCredits.mockRejectedValue(new Error("Transaction failed"))

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.spendCredits(10, "Test Action")

      expect(success).toBe(false)
      expect(result.current.error).toContain("Transaction failed")
    })
  })

  describe("purchaseCredits", () => {
    it("should purchase credits successfully", async () => {
      mockAuthContext.addCredits.mockResolvedValue({
        ...mockAuthContext.user,
        credits: 100,
      })

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.purchaseCredits(50)

      expect(success).toBe(true)
      expect(mockAuthContext.addCredits).toHaveBeenCalledWith(50)
    })

    it("should handle purchase errors", async () => {
      mockAuthContext.addCredits.mockRejectedValue(new Error("Payment failed"))

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const success = await result.current.purchaseCredits(50)

      expect(success).toBe(false)
      expect(result.current.error).toContain("Payment failed")
    })
  })

  describe("getCreditStatus", () => {
    it("should return good status for high credits", () => {
      mockAuthContext.user.credits = 100

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const status = result.current.getCreditStatus()

      expect(status.status).toBe("good")
      expect(status.color).toBe("green")
    })

    it("should return warning status for medium credits", () => {
      mockAuthContext.user.credits = 25

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const status = result.current.getCreditStatus()

      expect(status.status).toBe("warning")
      expect(status.color).toBe("amber")
    })

    it("should return critical status for low credits", () => {
      mockAuthContext.user.credits = 5

      const { result } = renderHook(() => useCreditService(), { wrapper })

      const status = result.current.getCreditStatus()

      expect(status.status).toBe("critical")
      expect(status.color).toBe("red")
    })
  })
})
