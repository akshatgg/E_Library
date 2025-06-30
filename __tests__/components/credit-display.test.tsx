import { render, screen } from "@testing-library/react"
import { CreditDisplay } from "@/components/credit-system/credit-display"

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
  useAuthContext: () => mockAuthContext,
}))

describe("CreditDisplay Component", () => {
  beforeEach(() => {
    mockAuthContext.user.credits = 50
  })

  it("should display credit balance correctly", () => {
    render(<CreditDisplay />)

    expect(screen.getByText("50")).toBeInTheDocument()
    expect(screen.getByText("Credits Available")).toBeInTheDocument()
  })

  it("should show good status for high credits", () => {
    mockAuthContext.user.credits = 100

    render(<CreditDisplay />)

    expect(screen.getByText("Good")).toBeInTheDocument()
    expect(screen.getByText("You have plenty of credits")).toBeInTheDocument()
  })

  it("should show warning status for medium credits", () => {
    mockAuthContext.user.credits = 25

    render(<CreditDisplay />)

    expect(screen.getByText("Low")).toBeInTheDocument()
    expect(screen.getByText("Your credits are running low")).toBeInTheDocument()
  })

  it("should show critical status for low credits", () => {
    mockAuthContext.user.credits = 5

    render(<CreditDisplay />)

    expect(screen.getByText("Critical")).toBeInTheDocument()
    expect(screen.getByText("Critical credit level! Add more credits to continue")).toBeInTheDocument()
  })

  it("should not render when user is not authenticated", () => {
    mockAuthContext.user = null as any
    mockAuthContext.isAuthenticated = false

    const { container } = render(<CreditDisplay />)

    expect(container.firstChild).toBeNull()
  })
})
