"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"

interface AppContextType {
  user: any
  setUser: (user: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState(null)

  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>
}
