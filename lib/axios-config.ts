import axios from "axios"

// Create a custom axios instance with the same name as in the original code
export const userbackAxios = axios.create({
  baseURL: "/api", // Adjust this based on your API endpoint structure
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to handle authentication if needed
userbackAxios.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
userbackAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error("API Error:", error.response.status, error.response.data)
    } else if (error.request) {
      // Request was made but no response
      console.error("Network Error:", error.request)
    } else {
      // Something else happened
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)
