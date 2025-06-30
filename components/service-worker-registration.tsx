"use client"

import { useEffect, useState } from "react"
import { registerServiceWorker, isServiceWorkerActive } from "@/lib/service-worker"
import { useToast } from "@/hooks/use-toast"

export function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const register = async () => {
      try {
        // Check if service worker is already active
        const isActive = await isServiceWorkerActive()

        if (isActive) {
          console.log("Service worker is already active")
          setIsRegistered(true)
          return
        }

        // Register service worker
        const registration = await registerServiceWorker()

        if (registration) {
          setIsRegistered(true)
          toast({
            title: "Offline Mode Enabled",
            description: "You can now access PDFs even when offline.",
            duration: 5000,
          })
        }
      } catch (error) {
        console.error("Failed to register service worker:", error)
        toast({
          title: "Offline Mode Not Available",
          description: "Your browser may not support offline functionality.",
          variant: "destructive",
          duration: 5000,
        })
      }
    }

    register()
  }, [toast])

  return null // This component doesn't render anything
}
