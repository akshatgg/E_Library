"use client"

import { useState, useEffect } from "react"

export function useOffline() {
  const [isOffline, setIsOffline] = useState<boolean>(typeof window !== "undefined" ? !window.navigator.onLine : false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOffline
}
