"use client"

import type React from "react"
import { createContext, useContext, useReducer } from "react"

interface LibraryEntry {
  id: string
  title: string
  author: string
  category: string
  description: string
  fileUrl: string
  tags: string[]
  createdAt: string
  updatedAt: string
  fileSize?: number
  pageCount?: number
  thumbnail?: string
  isFavorite?: boolean
  readingProgress?: number
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  count: number
}

interface AppState {
  entries: LibraryEntry[]
  categories: Category[]
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  error: string | null
  viewMode: "grid" | "list"
  sortBy: "title" | "author" | "date" | "category"
  sortOrder: "asc" | "desc"
  selectedEntry: LibraryEntry | null
  stats: {
    totalEntries: number
    totalCategories: number
    recentlyAdded: number
    favorites: number
  }
}

type AppAction =
  | { type: "SET_ENTRIES"; payload: LibraryEntry[] }
  | { type: "ADD_ENTRY"; payload: LibraryEntry }
  | { type: "UPDATE_ENTRY"; payload: LibraryEntry }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "SET_SORT"; payload: { sortBy: string; sortOrder: "asc" | "desc" } }
  | { type: "SET_SELECTED_ENTRY"; payload: LibraryEntry | null }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "UPDATE_STATS"; payload: Partial<AppState["stats"]> }

const initialState: AppState = {
  entries: [],
  categories: [
    { id: "1", name: "Constitutional Law", color: "blue", icon: "⚖️", count: 0 },
    { id: "2", name: "Criminal Law", color: "red", icon: "🔒", count: 0 },
    { id: "3", name: "Civil Law", color: "green", icon: "📋", count: 0 },
    { id: "4", name: "Corporate Law", color: "purple", icon: "🏢", count: 0 },
    { id: "5", name: "Family Law", color: "pink", icon: "👨‍👩‍👧‍👦", count: 0 },
    { id: "6", name: "Tax Law", color: "yellow", icon: "💰", count: 0 },
  ],
  searchQuery: "",
  selectedCategory: "",
  isLoading: false,
  error: null,
  viewMode: "grid",
  sortBy: "date",
  sortOrder: "desc",
  selectedEntry: null,
  stats: {
    totalEntries: 0,
    totalCategories: 6,
    recentlyAdded: 0,
    favorites: 0,
  },
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ENTRIES":
      const entries = Array.isArray(action.payload) ? action.payload : []
      return {
        ...state,
        entries,
        stats: {
          ...state.stats,
          totalEntries: entries.length,
          favorites: entries.filter((e) => e.isFavorite).length,
          recentlyAdded: entries.filter((e) => new Date(e.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .length,
        },
      }
    case "ADD_ENTRY":
      if (!action.payload || typeof action.payload !== "object") {
        return state
      }
      const newEntries = [action.payload, ...state.entries]
      return {
        ...state,
        entries: newEntries,
        stats: {
          ...state.stats,
          totalEntries: newEntries.length,
          recentlyAdded: state.stats.recentlyAdded + 1,
        },
      }
    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((entry) => (entry.id === action.payload.id ? action.payload : entry)),
      }
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.payload),
        stats: {
          ...state.stats,
          totalEntries: state.stats.totalEntries - 1,
        },
      }
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.payload ? { ...entry, isFavorite: !entry.isFavorite } : entry,
        ),
      }
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload }
    case "SET_SORT":
      return { ...state, sortBy: action.payload.sortBy as any, sortOrder: action.payload.sortOrder }
    case "SET_SELECTED_ENTRY":
      return { ...state, selectedEntry: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
