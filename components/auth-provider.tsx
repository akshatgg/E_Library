"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { setCookies, removeCookies } from "cookies-next"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export interface User {
  uid: string
  email: string
  displayName: string
  credits?: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  addCredits: (amount: number) => Promise<User>
  useCredits: (amount: number) => Promise<User>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.emailVerified) {
          const token = await getIdToken(firebaseUser)
          setCookies("token", token, { maxAge: 60 * 60 * 24 })

          const userRef = doc(db, "users", firebaseUser.uid)
          const docSnap = await getDoc(userRef)

          if (docSnap.exists()) {
            setUser(docSnap.data() as User)
          } else {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              credits: 0,
            }
            await setDoc(userRef, newUser)
            setUser(newUser)
          }
        } else {
          await removeCookies("token")
          setUser(null)
        }
      } catch (err: any) {
        setError(err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password)

    if (!res.user.emailVerified) {
      await firebaseSignOut(auth)
      throw new Error("Please verify your email before signing in.")
    }

    const token = await getIdToken(res.user)
    setCookies("token", token, { maxAge: 60 * 60 * 24 })

    const docSnap = await getDoc(doc(db, "users", res.user.uid))
    if (docSnap.exists()) {
      setUser(docSnap.data() as User)
    } else {
      const newUser: User = {
        uid: res.user.uid,
        email: res.user.email || "",
        displayName: res.user.displayName || "",
        credits: 0,
      }
      await setDoc(doc(db, "users", res.user.uid), newUser)
      setUser(newUser)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const uid = res.user.uid

    const userData: User = {
      uid,
      email,
      displayName,
      credits: 0,
    }

    await setDoc(doc(db, "users", uid), userData)
    await sendEmailVerification(res.user)

    // Sign out immediately after registration to prevent access before verification
    await firebaseSignOut(auth)
    removeCookies("token")

    setUser(null)
    throw new Error("Verification email sent. Please check your inbox and verify your email.")
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    removeCookies("token")
    setUser(null)
  }

  const addCredits = async (amount: number) => {
    if (!user) throw new Error("Not authenticated")
    const updated = {
      ...user,
      credits: (user.credits || 0) + amount,
    }
    await setDoc(doc(db, "users", user.uid), updated)
    setUser(updated)
    return updated
  }

  const useCredits = async (amount: number) => {
    if (!user) throw new Error("Not authenticated")
    if ((user.credits || 0) < amount) throw new Error("Insufficient credits")
    const updated = {
      ...user,
      credits: (user.credits || 0) - amount,
    }
    await setDoc(doc(db, "users", user.uid), updated)
    setUser(updated)
    return updated
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    addCredits,
    useCredits,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-red-600 mb-4">Application Error</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

export const useAuth = useAuthContext
