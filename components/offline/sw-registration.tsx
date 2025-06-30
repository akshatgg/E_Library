"use client"

import { useEffect, useState } from "react"
import { registerMinimalServiceWorker } from "@/lib/service-worker-lite"

export function ServiceWorkerRegistration() {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    const register = async () => {
      try {
        const registration = await registerMinimalServiceWorker()
        if (registration) {
          setRegistered(true)
          console.log("Service worker registered")
        }
      } catch (error) {
        console.error("Failed to register service worker:", error)
      }
    }

    register()
  }, [])

  // This component doesn't render anything
  return null
}
