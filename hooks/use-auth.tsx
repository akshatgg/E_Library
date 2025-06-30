"use client"

import { useState, useEffect } from "react"
import { SimpleAuth } from "@/lib/simple-auth"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const auth = SimpleAuth.getInstance()
    const currentState = auth.getAuthState()

    setAuthState({
      ...currentState,
      isLoading: false,
    })

    const unsubscribe = auth.subscribe((state) => {
      setAuthState({
        ...state,
        isLoading: false,
      })
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = SimpleAuth.getInstance()
    return await auth.signIn(email, password)
  }

  const signOut = () => {
    const auth = SimpleAuth.getInstance()
    auth.signOut()
  }

  return {
    ...authState,
    signIn,
    signOut,
  }
}
