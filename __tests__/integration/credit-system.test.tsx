import type React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CreditTester } from "@/components/credit-system/credit-tester"
import { AuthProvider } from "@/components/auth-provider"

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
})

describe("Credit System Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 50,
        lastLogin: new Date().toISOString(),
      }),
    )
  })

  const renderWithAuth = (component: React.ReactElement) => {
    return render(<AuthProvider>{component}</AuthProvider>)
  }

  it("should display current credit balance", async () => {
    renderWithAuth(<CreditTester />)

    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument()
      expect(screen.getByText("Credits")).toBeInTheDocument()
    })
  })

  it("should allow purchasing credits", async () => {
    const user = userEvent.setup()
    renderWithAuth(<CreditTester />)

    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument()
    })

    const purchaseButton = screen.getByRole("button", { name: /10.*Test Credits/i })
    await user.click(purchaseButton)

    await waitFor(() => {
      expect(screen.getByText("60")).toBeInTheDocument()
    })
  })

  it("should allow spending credits", async () => {
    const user = userEvent.setup()
    renderWithAuth(<CreditTester />)

    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument()
    })

    const searchButton = screen.getByRole("button", { name: /Search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("49")).toBeInTheDocument()
    })
  })

  it("should prevent spending when insufficient credits", async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        id: "user-1",
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        credits: 2,
        lastLogin: new Date().toISOString(),
      }),
    )

    const user = userEvent.setup()
    renderWithAuth(<CreditTester />)

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument()
    })

    const downloadButton = screen.getByRole("button", { name: /Download/i })
    expect(downloadButton).toBeDisabled()
  })

  it("should show test results", async () => {
    const user = userEvent.setup()
    renderWithAuth(<CreditTester />)

    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument()
    })

    const searchButton = screen.getByRole("button", { name: /Search/i })
    await user.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText("Case Law Search")).toBeInTheDocument()
      expect(screen.getByText("Successfully spent 1 credits")).toBeInTheDocument()
    })
  })
})
