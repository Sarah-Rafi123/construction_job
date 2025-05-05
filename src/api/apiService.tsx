import axios from "axios"

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: "http://localhost:9000/api/v0",
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
      // Redirect to login if needed
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
