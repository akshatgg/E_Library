import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// API functions - Fixed export name to match import
export const libraryApi = {
  // Get all entries
  getEntries: async () => {
    try {
      const response = await api.get("/entries")
      return response.data
    } catch (error) {
      console.error("Error fetching entries:", error)
      return []
    }
  },

  // Get single entry
  getEntry: async (id: string) => {
    try {
      const response = await api.get(`/entries/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching entry:", error)
      return null
    }
  },

  // Create new entry
  createEntry: async (entry: any) => {
    try {
      const response = await api.post("/entries", entry)
      return response.data
    } catch (error) {
      console.error("Error creating entry:", error)
      throw error
    }
  },

  // Update entry
  updateEntry: async (id: string, entry: any) => {
    try {
      const response = await api.put(`/entries/${id}`, entry)
      return response.data
    } catch (error) {
      console.error("Error updating entry:", error)
      throw error
    }
  },

  // Delete entry
  deleteEntry: async (id: string) => {
    try {
      await api.delete(`/entries/${id}`)
      return true
    } catch (error) {
      console.error("Error deleting entry:", error)
      throw error
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get("/categories")
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  },

  // Create category
  createCategory: async (category: any) => {
    try {
      const response = await api.post("/categories", category)
      return response.data
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },

  // Upload file
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return response.data
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  },

  // Search entries
  searchEntries: async (query: string) => {
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error("Error searching entries:", error)
      return []
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get("/stats")
      return response.data
    } catch (error) {
      console.error("Error fetching stats:", error)
      return {
        totalEntries: 0,
        totalCategories: 0,
        recentlyAdded: 0,
        favorites: 0,
      }
    }
  },
}

export default api
