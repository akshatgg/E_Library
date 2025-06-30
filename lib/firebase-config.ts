// Firebase configuration - NO INITIALIZATION HERE
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate configuration
export const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { getAnalytics, type Analytics } from "firebase/analytics"

// Initialize Firebase app
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

// Only initialize on client side
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Initialize Analytics only if measurement ID is provided
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app)
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Export functions that safely return Firebase services
export const getFirebaseAuth = () => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used on the client side")
  }
  if (!auth) {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
  }
  return auth
}

export const getFirebaseDb = () => {
  if (typeof window === "undefined") {
    throw new Error("Firestore can only be used on the client side")
  }
  if (!db) {
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  }
  return db
}

export const getFirebaseStorage = () => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage can only be used on the client side")
  }
  if (!storage) {
    const app = initializeApp(firebaseConfig)
    storage = getStorage(app)
  }
  return storage
}

export const getFirebaseAnalytics = () => {
  if (typeof window === "undefined") {
    return null
  }
  if (!analytics && firebaseConfig.measurementId) {
    const app = initializeApp(firebaseConfig)
    analytics = getAnalytics(app)
  }
  return analytics
}

// Legacy exports for backward compatibility (will be removed)
export { auth, db, storage, analytics }
