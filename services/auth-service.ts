"use client"

import { useState, useEffect, useCallback } from "react"
import { useFirebase } from "@/hooks/use-firebase"

export interface User {
  uid: string
  email?: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
}

export interface UserProfile {
  uid: string
  email?: string
  phoneNumber?: string
  displayName: string
  photoURL?: string
  role: "admin" | "user"
  subscriptionStatus: "free" | "premium"
  createdAt: Date
  lastLogin: Date
  provider: "email" | "google" | "facebook" | "phone"
}

export function useAuth() {
  const { auth, db, loading: firebaseLoading, error: firebaseError } = useFirebase()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Listen for auth state changes
  useEffect(() => {
    if (firebaseLoading || !auth) return

    let unsubscribe: (() => void) | undefined

    try {
      const { onAuthStateChanged } = require("firebase/auth")

      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser: any) => {
          if (firebaseUser) {
            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
            }
            setUser(userData)

            // Try to get user profile from Firestore
            if (db) {
              try {
                const { doc, getDoc } = await import("firebase/firestore")
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
                if (userDoc.exists()) {
                  setUserProfile(userDoc.data() as UserProfile)
                }
              } catch (err) {
                console.error("Error fetching user profile:", err)
              }
            }
          } else {
            setUser(null)
            setUserProfile(null)
          }
          setLoading(false)
        },
        (err: Error) => {
          console.error("Auth state error:", err)
          setError(err)
          setLoading(false)
        },
      )
    } catch (err) {
      console.error("Error setting up auth listener:", err)
      setError(err instanceof Error ? err : new Error("Auth setup failed"))
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [auth, db, firebaseLoading])

  // Sign in with email and password
  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error("Firebase not initialized")

      try {
        const { signInWithEmailAndPassword } = await import("firebase/auth")
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
      } catch (err: any) {
        throw new Error(getErrorMessage(err.code))
      }
    },
    [auth],
  )

  // Sign up with email and password
  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!auth || !db) throw new Error("Firebase not initialized")

      try {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
        const { doc, setDoc } = await import("firebase/firestore")

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Update profile
        await updateProfile(user, { displayName })

        // Create user document in Firestore
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || undefined,
          displayName,
          role: "user",
          subscriptionStatus: "free",
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: "email",
        }

        await setDoc(doc(db, "users", user.uid), userProfile)
        return userCredential.user
      } catch (err: any) {
        throw new Error(getErrorMessage(err.code))
      }
    },
    [auth, db],
  )

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new GoogleAuthProvider()
      provider.addScope("email")
      provider.addScope("profile")

      const userCredential = await signInWithPopup(auth, provider)
      await createOrUpdateUserProfile(userCredential.user, "google")
      return userCredential.user
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }, [auth])

  // Sign out
  const signOut = useCallback(async () => {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      const { signOut: firebaseSignOut } = await import("firebase/auth")
      await firebaseSignOut(auth)
    } catch (err: any) {
      throw new Error(err.message)
    }
  }, [auth])

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      if (!auth) throw new Error("Firebase not initialized")

      try {
        const { sendPasswordResetEmail } = await import("firebase/auth")
        await sendPasswordResetEmail(auth, email)
      } catch (err: any) {
        throw new Error(getErrorMessage(err.code))
      }
    },
    [auth],
  )

  // Create or update user profile
  const createOrUpdateUserProfile = async (user: any, provider: "google" | "facebook" | "phone") => {
    if (!db) return

    try {
      const { doc, getDoc, setDoc, updateDoc } = await import("firebase/firestore")
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || undefined,
          phoneNumber: user.phoneNumber || undefined,
          displayName: user.displayName || "User",
          photoURL: user.photoURL || undefined,
          role: "user",
          subscriptionStatus: "free",
          createdAt: new Date(),
          lastLogin: new Date(),
          provider,
        }
        await setDoc(doc(db, "users", user.uid), userProfile)
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: new Date(),
        })
      }
    } catch (err) {
      console.error("Error creating/updating user profile:", err)
    }
  }

  // Get user-friendly error messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address."
      case "auth/wrong-password":
        return "Incorrect password."
      case "auth/email-already-in-use":
        return "An account with this email already exists."
      case "auth/weak-password":
        return "Password should be at least 6 characters."
      case "auth/invalid-email":
        return "Invalid email address."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      case "auth/network-request-failed":
        return "Network error. Please check your connection."
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed."
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled."
      default:
        return "An error occurred. Please try again."
    }
  }

  return {
    user,
    userProfile,
    loading: loading || firebaseLoading,
    error: error || firebaseError,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  }
}
