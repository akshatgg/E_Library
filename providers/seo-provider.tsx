"use client"

import type { ReactNode } from "react"
import { createContext, useContext } from "react"

interface SEOContextType {
  updateMeta: (meta: any) => void
}

const SEOContext = createContext<SEOContextType | undefined>(undefined)

export function useSEO() {
  const context = useContext(SEOContext)
  if (!context) {
    throw new Error("useSEO must be used within SEOProvider")
  }
  return context
}

interface SEOProviderProps {
  children: ReactNode
}

export function SEOProvider({ children }: SEOProviderProps) {
  const updateMeta = (meta: any) => {
    // Update document meta tags
    if (typeof document !== "undefined") {
      if (meta.title) {
        document.title = meta.title
      }
    }
  }

  return <SEOContext.Provider value={{ updateMeta }}>{children}</SEOContext.Provider>
}
