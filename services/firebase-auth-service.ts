"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "@/hooks/use-firebase"
import type {
  User,
  UserCredential,
  ConfirmationResult,
  RecaptchaVerifier as FirebaseRecaptchaVerifier,
} from "firebase/auth"

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
  const { auth, db, loading: firebaseLoading } = useFirebase()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<FirebaseRecaptchaVerifier | null>(null)

  // Listen for auth state changes
  useEffect(() => {
    if (firebaseLoading || !auth) return

    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: User | null) => {
        setUser(firebaseUser)

        if (firebaseUser) {
          try {
            // Get user profile from Firestore
            const userDoc = await db.doc(`users/${firebaseUser.uid}`).get()
            if (userDoc.exists) {
              setUserProfile(userDoc.data() as UserProfile)
            }
          } catch (err) {
            console.error("Error fetching user profile:", err)
          }
        } else {
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

    return () => unsubscribe()
  }, [auth, db, firebaseLoading])

  // Initialize reCAPTCHA verifier
  const initRecaptcha = (containerId: string) => {
    if (!auth) return null

    try {
      const { RecaptchaVerifier } = require("firebase/auth")
      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
      })
      setRecaptchaVerifier(verifier)
      return verifier
    } catch (err) {
      console.error("Error initializing reCAPTCHA:", err)
      return null
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    if (!auth || !db) throw new Error("Firebase not initialized")

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
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

      await db.doc(`users/${user.uid}`).set(userProfile)
      return userCredential
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Sign in with Google
  const signInWithGoogle = async (): Promise<UserCredential> => {
    if (!auth || !db) throw new Error("Firebase not initialized")

    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new GoogleAuthProvider()
      provider.addScope("email")
      provider.addScope("profile")

      const userCredential = await signInWithPopup(auth, provider)
      await createOrUpdateUserProfile(userCredential.user, "google")
      return userCredential
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Sign in with Facebook
  const signInWithFacebook = async (): Promise<UserCredential> => {
    if (!auth || !db) throw new Error("Firebase not initialized")

    try {
      const { FacebookAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new FacebookAuthProvider()
      provider.addScope("email")

      const userCredential = await signInWithPopup(auth, provider)
      await createOrUpdateUserProfile(userCredential.user, "facebook")
      return userCredential
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Send SMS verification code
  const sendSMSVerification = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!auth || !recaptchaVerifier) throw new Error("Firebase or reCAPTCHA not initialized")

    try {
      const { signInWithPhoneNumber } = await import("firebase/auth")
      return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Verify SMS code
  const verifySMSCode = async (confirmationResult: ConfirmationResult, code: string): Promise<UserCredential> => {
    try {
      const userCredential = await confirmationResult.confirm(code)
      await createOrUpdateUserProfile(userCredential.user, "phone")
      return userCredential
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
    }
  }

  // Create or update user profile
  const createOrUpdateUserProfile = async (user: User, provider: "google" | "facebook" | "phone") => {
    if (!db) throw new Error("Firebase not initialized")

    try {
      const userDoc = await db.doc(`users/${user.uid}`).get()

      if (!userDoc.exists) {
        // Create new user document
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
        await db.doc(`users/${user.uid}`).set(userProfile)
      } else {
        await db.doc(`users/${user.uid}`).update({
          lastLogin: new Date(),
        })
      }
    } catch (err) {
      console.error("Error creating/updating user profile:", err)
    }
  }

  // Sign out
  const signOut = async (): Promise<void> => {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      await auth.signOut()
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        setRecaptchaVerifier(null)
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      const { sendPasswordResetEmail } = await import("firebase/auth")
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      throw new Error(getErrorMessage(err.code))
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
      case "auth/invalid-phone-number":
        return "Invalid phone number format."
      case "auth/invalid-verification-code":
        return "Invalid verification code."
      case "auth/code-expired":
        return "Verification code has expired."
      default:
        return "An error occurred. Please try again."
    }
  }

  return {
    user,
    userProfile,
    loading: loading || firebaseLoading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    initRecaptcha,
    sendSMSVerification,
    verifySMSCode,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  }
}
