"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookies, removeCookies, getCookie } from "cookies-next";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  getIdToken,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  credits?: number;
  createdAt: Date;
  lastLogin: Date;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  addCredits: (amount: number) => Promise<User>;
  useCredits: (amount: number) => Promise<User>;
  isAuthenticated: boolean;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Check if token is expired
  const isTokenExpired = () => {
    if (!tokenExpiry) return false;
    return Date.now() > tokenExpiry;
  };

  // Set token with expiry tracking
  const setTokenWithExpiry = async (firebaseUser: any) => {
    const token = await getIdToken(firebaseUser);
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    
    setCookies("token", token, { 
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      httpOnly: false, // Allow client-side access for manual deletion check
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Store expiry time in localStorage to track it
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    setTokenExpiry(expiryTime);
  };

  // Check for manual token deletion
  const checkTokenIntegrity = () => {
    const cookie = getCookie('token');
    const storedExpiry = localStorage.getItem('tokenExpiry');
    
    // If cookie was manually deleted but we still have user state
    if (!cookie && user && storedExpiry) {
      console.log('Token manually deleted, signing out...');
      handleSignOut();
      return false;
    }
    
    // If token expired
    if (storedExpiry && Date.now() > parseInt(storedExpiry)) {
      console.log('Token expired, signing out...');
      handleSignOut();
      return false;
    }
    
    return true;
  };

  // Clean sign out
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
    
    removeCookies("token");
    localStorage.removeItem('tokenExpiry');
    setTokenExpiry(null);
    setUser(null);
  };

  useEffect(() => {
    // Check token integrity on mount
    const storedExpiry = localStorage.getItem('tokenExpiry');
    if (storedExpiry) {
      setTokenExpiry(parseInt(storedExpiry));
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.emailVerified) {
          // Check if we should respect the user's manual token deletion
          const cookie = getCookie('token');
          const storedExpiry = localStorage.getItem('tokenExpiry');
          
          // If cookie was manually deleted, don't restore the session
          if (!cookie && storedExpiry && user) {
            console.log('Respecting manual token deletion');
            await handleSignOut();
            setLoading(false);
            return;
          }

          // If token expired, don't restore the session
          if (storedExpiry && Date.now() > parseInt(storedExpiry)) {
            console.log('Token expired, not restoring session');
            await handleSignOut();
            setLoading(false);
            return;
          }

          // Set/refresh token only if we don't have one or if it's valid
          if (!cookie || !storedExpiry) {
            await setTokenWithExpiry(firebaseUser);
          }

          const userRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            // Update last login
            const updatedUserData = {
              ...userData,
              lastLogin: new Date(),
            };
            await setDoc(userRef, updatedUserData);
            setUser(updatedUserData);
          } else {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              credits: 0,
              role: "user",
              createdAt: new Date(),
              lastLogin: new Date(),
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } else {
          await handleSignOut();
        }
      } catch (err: any) {
        console.error('Auth state change error:', err);
        setError(err);
        await handleSignOut();
      } finally {
        setLoading(false);
      }
    });

    // Set up token integrity checker
    const tokenCheckInterval = setInterval(() => {
      if (user) {
        checkTokenIntegrity();
      }
    }, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(tokenCheckInterval);
    };
  }, [user]); // Add user as dependency to handle manual deletions

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("Please verify your email before signing in.");
      }

      await setTokenWithExpiry(res.user);

      const userRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data() as User;
        const updatedUserData = {
          ...userData,
          lastLogin: new Date(),
        };
        await setDoc(userRef, updatedUserData);
        setUser(updatedUserData);
      } else {
        const newUser: User = {
          uid: res.user.uid,
          email: res.user.email || "",
          displayName: res.user.displayName || "",
          credits: 0,
          role: "user",
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userData: User = {
        uid,
        email,
        displayName,
        credits: 0,
        role: "user",
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await setDoc(doc(db, "users", uid), userData);
      await sendEmailVerification(res.user);

      // Sign out immediately after registration to prevent access before verification
      await handleSignOut();

      throw new Error(
        "Verification email sent. Please check your inbox and verify your email."
      );
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await handleSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const addCredits = async (amount: number) => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before making changes
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    const updated = {
      ...user,
      credits: (user.credits || 0) + amount,
    };
    await setDoc(doc(db, "users", user.uid), updated);
    setUser(updated);
    return updated;
  };

  const useCredits = async (amount: number) => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before making changes
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    if ((user.credits || 0) < amount) throw new Error("Insufficient credits");
    
    const updated = {
      ...user,
      credits: (user.credits || 0) - amount,
    };
    await setDoc(doc(db, "users", user.uid), updated);
    setUser(updated);
    return updated;
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    addCredits,
    useCredits,
    isAuthenticated: !!user && !isTokenExpired(),
    resetPassword,
  };

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
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Application Error
            </h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
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
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export const useAuth = useAuthContext;