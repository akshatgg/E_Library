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
import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
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

export interface Transaction {
  id: string;
  orderId: string;
  type: "purchase" | "usage" | "refund";
  credits: number;
  amount?: number;
  status: "success" | "failed" | "pending";
  timestamp: Date;
  description: string;
  userId: string;
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
  addCredits: (amount: number, transaction?: Partial<Transaction>) => Promise<User>;
  useCredits: (amount: number) => Promise<User>;
  refreshUserData: () => Promise<void>;
  getTransactions: () => Promise<Transaction[]>;
  addTransaction: (transaction: Omit<Transaction, 'userId'>) => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'displayName'>>) => Promise<void>;
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

          // Try Firebase first, then simple storage fallback
          let userData: User | null = null;
          
          try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
              userData = docSnap.data() as User;
              // Update last login
              const updatedUserData = {
                ...userData,
                lastLogin: new Date(),
              };
              await setDoc(userRef, updatedUserData);
              setUser(updatedUserData);
            } else {
              // User doesn't exist in Firebase, create new user
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
          } catch (firebaseError) {
            console.log("Firebase user fetch failed, trying simple storage:", firebaseError);
            
            // Fallback to simple storage API
            try {
              const response = await fetch(`/api/user/transactions?userId=${firebaseUser.uid}`);
              if (response.ok) {
                const data = await response.json();
                userData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  displayName: firebaseUser.displayName || "",
                  credits: data.credits || 0,
                  role: "user" as const,
                  createdAt: new Date(),
                  lastLogin: new Date(),
                };
                setUser(userData);
              } else {
                // Create new user if simple storage also fails
                const newUser: User = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || "",
                  displayName: firebaseUser.displayName || "",
                  credits: 0,
                  role: "user",
                  createdAt: new Date(),
                  lastLogin: new Date(),
                };
                setUser(newUser);
              }
            } catch (apiError) {
              console.log("Simple storage user fetch failed:", apiError);
              // Create new user as last resort
              const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "",
                credits: 0,
                role: "user",
                createdAt: new Date(),
                lastLogin: new Date(),
              };
              setUser(newUser);
            }
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

  const refreshUserData = async () => {
    if (!user) {
      console.log("No user to refresh");
      return;
    }
    
    console.log("Refreshing user data for:", user.uid);
    
    // Try to fetch updated data from Firebase client SDK first
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Firebase client refresh - old credits:", user.credits, "new credits:", userData.credits);
        setUser({ ...user, credits: userData.credits });
        return;
      }
    } catch (firebaseError) {
      console.log("Firebase client refresh failed, trying simple storage:", firebaseError);
    }

    // Fallback to simple storage API
    try {
      console.log("Trying simple storage refresh...");
      const response = await fetch(`/api/user/transactions?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Simple storage refresh - old credits:", user.credits, "new credits:", data.credits);
        setUser({ ...user, credits: data.credits || 0 });
      } else {
        console.log("Simple storage API response not ok:", response.status);
      }
    } catch (apiError) {
      console.log("Simple storage refresh failed:", apiError);
    }
  };

  const addCredits = async (amount: number, transaction?: Partial<Transaction>) => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before making changes
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    console.log(`Adding ${amount} credits to user ${user.uid} - current: ${user.credits || 0}`);
    
    const updated = {
      ...user,
      credits: (user.credits || 0) + amount,
    };
    
    // Try Firebase client SDK first
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updated);
      console.log("Credits updated successfully via Firebase client SDK");
      
      // If transaction data is provided, store it in Firebase
      if (transaction) {
        const transactionData: Transaction = {
          userId: user.uid,
          timestamp: new Date(),
          type: "purchase",
          status: "success",
          credits: amount,
          ...transaction,
        } as Transaction;
        
        await addDoc(collection(db, "transactions"), transactionData);
        console.log("Transaction stored in Firebase:", transactionData);
      }
      
      setUser(updated);
      return updated;
    } catch (firebaseError) {
      console.log("Firebase client addCredits failed, trying simple storage API:", firebaseError);
      
      // Fallback to simple storage API
      try {
        const response = await fetch("/api/user/add-credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            credits: amount,
          }),
        });
        
        if (response.ok) {
          console.log("Credits added successfully via simple storage API");
          setUser(updated);
          return updated;
        } else {
          throw new Error("Simple storage API failed");
        }
      } catch (apiError) {
        console.error("Both Firebase and simple storage addCredits failed:", apiError);
        throw new Error("Failed to add credits");
      }
    }
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

  const getTransactions = async (): Promise<Transaction[]> => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before fetching data
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    try {
      // Try Firebase client SDK first
      const transactionsRef = collection(db, "transactions");
      const q = query(
        transactionsRef,
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
        } as Transaction);
      });
      
      console.log("Transactions fetched from Firebase client SDK:", transactions.length);
      return transactions;
    } catch (firebaseError) {
      console.log("Firebase client transactions fetch failed, trying simple storage API:", firebaseError);
      
      // Fallback to simple storage API
      try {
        const response = await fetch(`/api/user/transactions?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          return data.transactions || [];
        } else {
          throw new Error("Simple storage API failed");
        }
      } catch (apiError) {
        console.error("Both Firebase and simple storage transactions fetch failed:", apiError);
        return [];
      }
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'userId'>) => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before making changes
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    try {
      const transactionData: Transaction = {
        ...transaction,
        userId: user.uid,
        timestamp: transaction.timestamp || new Date(),
      };
      
      // Try Firebase first
      await addDoc(collection(db, "transactions"), transactionData);
      console.log("Transaction added to Firebase:", transactionData);
    } catch (firebaseError) {
      console.log("Firebase transaction add failed:", firebaseError);
      // Note: Simple storage doesn't have a direct transaction add endpoint
      // Transactions are handled via the payment verification endpoints
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'displayName'>>) => {
    if (!user) throw new Error("Not authenticated");
    
    // Check token integrity before making changes
    if (!checkTokenIntegrity()) {
      throw new Error("Authentication expired");
    }
    
    try {
      const updatedUser = {
        ...user,
        ...updates,
      };
      
      // Try Firebase client SDK first
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedUser);
      console.log("Profile updated successfully via Firebase client SDK");
      
      setUser(updatedUser);
    } catch (firebaseError) {
      console.error("Firebase profile update failed:", firebaseError);
      throw new Error("Failed to update profile");
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
    refreshUserData,
    getTransactions,
    addTransaction,
    updateProfile,
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