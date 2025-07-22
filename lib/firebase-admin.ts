import admin from "firebase-admin"

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  // For development, we'll use a simpler initialization
  // In production, you should use service account credentials
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (!projectId) {
    throw new Error("Firebase project ID is required")
  }

  try {
    admin.initializeApp({
      projectId: projectId,
      // For development/testing, we'll rely on Application Default Credentials
      // In production, you should add proper service account credentials
    })
    console.log("Firebase Admin initialized successfully")
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    throw error
  }
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
export default admin
