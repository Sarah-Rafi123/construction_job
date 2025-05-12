import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for our requests and responses
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: any
  token: string
  user: {
    id: string
    email: string
    role: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  role: string
  [key: string]: any
}

export interface RegisterResponse {
  success: boolean
  message: string
}

export interface CheckEmailRequest {
  email: string
}

export interface CheckEmailResponse {
  success: boolean
  message: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface ResendVerificationResponse {
  success: boolean
  message: string
}

export interface VerifyEmailRequest {
  email: string
  token: string
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
}

// Create the API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    checkEmail: builder.mutation<CheckEmailResponse, CheckEmailRequest>({
      query: (data) => ({
        url: "/check-email",
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation<ResendVerificationResponse, ResendVerificationRequest>({
      query: (data) => ({
        url: "/resend-verification-email",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // Add an async onQueryStarted callback to handle the page refresh after logout
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          // Wait for the logout request to complete
          const result = await queryFulfilled

          // If logout was successful, force a page refresh
          if (result.data.success) {
            // Small delay to ensure the server has processed the logout
            setTimeout(() => {
              window.location.href = "/landing-page" // Redirect to landing page
              // Alternatively, use window.location.reload() to just refresh the current page
            }, 100)
          }
        } catch (error) {
          // Handle any errors if needed
          console.error("Logout failed:", error)
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useCheckEmailMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
} = authApi
