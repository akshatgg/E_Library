"use client"

import { useState, useEffect, useRef } from "react"
import { firebaseConfig, isFirebaseConfigValid } from "@/lib/firebase-config"

interface FirebaseServices {
  app: any
  auth: any
  db: any
  storage: any
  analytics: any | null
}

let firebaseInstance: FirebaseServices | null = null
let initializationPromise: Promise<FirebaseServices> | null = null

export function useFirebase() {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    async function initializeFirebase() {
      // Return existing instance if available
      if (firebaseInstance) {
        setFirebase(firebaseInstance)
        setLoading(false)
        return firebaseInstance
      }

      // Return existing promise if initialization is in progress
      if (initializationPromise) {
        try {
          const instance = await initializationPromise
          if (mounted.current) {
            setFirebase(instance)
            setLoading(false)
          }
          return instance
        } catch (err) {
          if (mounted.current) {
            setError(err instanceof Error ? err : new Error("Firebase initialization failed"))
            setLoading(false)
          }
          throw err
        }
      }

      // Start new initialization
      initializationPromise = (async () => {
        try {
          // Validate configuration
          if (!isFirebaseConfigValid()) {
            throw new Error("Firebase configuration is incomplete")
          }

          // Dynamic imports
          const [
            { initializeApp },
            { getAuth, connectAuthEmulator },
            { getFirestore, connectFirestoreEmulator },
            { getStorage, connectStorageEmulator },
          ] = await Promise.all([
            import("firebase/app"),
            import("firebase/auth"),
            import("firebase/firestore"),
            import("firebase/storage"),
          ])

          // Initialize Firebase app
          const app = initializeApp(firebaseConfig)

          // Initialize services
          const auth = getAuth(app)
          const db = getFirestore(app)
          const storage = getStorage(app)

          // Initialize Analytics only if measurement ID is provided
          let analytics = null
          if (firebaseConfig.measurementId) {
            try {
              const { getAnalytics, isSupported } = await import("firebase/analytics")
              const supported = await isSupported()
              if (supported) {
                analytics = getAnalytics(app)
              }
            } catch (analyticsError) {
              console.warn("Analytics initialization failed:", analyticsError)
            }
          }

          const instance: FirebaseServices = {
            app,
            auth,
            db,
            storage,
            analytics,
          }

          firebaseInstance = instance
          return instance
        } catch (err) {
          initializationPromise = null
          throw err
        }
      })()

      try {
        const instance = await initializationPromise
        if (mounted.current) {
          setFirebase(instance)
          setLoading(false)
        }
        return instance
      } catch (err) {
        if (mounted.current) {
          setError(err instanceof Error ? err : new Error("Firebase initialization failed"))
          setLoading(false)
        }
        throw err
      }
    }

    initializeFirebase().catch((err) => {
      console.error("Firebase initialization error:", err)
    })

    return () => {
      mounted.current = false
    }
  }, [])

  return {
    ...firebase,
    loading,
    error,
    initialized: !!firebase,
  }
}
