"use client"

import { useState, useEffect } from "react"

export function useOfflineStatus() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Default to online if not in browser
  const [isOffline, setIsOffline] = useState(!isBrowser ? false : !navigator.onLine)

  useEffect(() => {
    if (!isBrowser) return

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isBrowser])

  return isOffline
}
