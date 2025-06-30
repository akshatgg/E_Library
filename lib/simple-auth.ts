interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Simple in-memory user store for demo
const users: User[] = [
  { id: "1", email: "admin@itaxeasy.com", name: "Admin User", role: "admin" },
  { id: "2", email: "user@itaxeasy.com", name: "Regular User", role: "user" },
  { id: "3", email: "demo@itaxeasy.com", name: "Demo User", role: "user" },
]

const passwords: Record<string, string> = {
  "admin@itaxeasy.com": "admin123",
  "user@itaxeasy.com": "user123",
  "demo@itaxeasy.com": "demo123",
}

export class SimpleAuth {
  private static instance: SimpleAuth
  private authState: AuthState = { user: null, isAuthenticated: false }
  private listeners: Array<(state: AuthState) => void> = []

  static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth()
    }
    return SimpleAuth.instance
  }

  constructor() {
    // Check for existing session in localStorage
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("auth_user")
      if (savedUser) {
        try {
          this.authState = {
            user: JSON.parse(savedUser),
            isAuthenticated: true,
          }
        } catch (error) {
          localStorage.removeItem("auth_user")
        }
      }
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const user = users.find((u) => u.email === email)

    if (!user || passwords[email] !== password) {
      return { success: false, error: "Invalid credentials" }
    }

    this.authState = { user, isAuthenticated: true }

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user))
    }

    this.notifyListeners()
    return { success: true }
  }

  signOut(): void {
    this.authState = { user: null, isAuthenticated: false }

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
    }

    this.notifyListeners()
  }

  getAuthState(): AuthState {
    return this.authState
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.authState))
  }
}
