import axios from "axios"
import { clearCurrentUser } from "@/store/slices/userSlice" // Import the action to clear user state
import { store } from "@/store" // Import your Redux store

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // This is important to send and receive cookies
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // No need to manually add the token as it will be sent automatically in cookies
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 unauthorized, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log("Unauthorized access detected, redirecting to landing page")

      // Clear user data from Redux store
      store.dispatch(clearCurrentUser())

      // Clear any local storage items related to authentication if you have any
      localStorage.removeItem("userType")

      // Redirect to landing page
      if (typeof window !== "undefined") {
        // Check if we're in the browser environment
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Add the login function
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/login", {
      email,
      password,
    })

    // The cookie will be automatically stored by the browser
    // We just need to return the user data
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export default apiClient
