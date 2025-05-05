import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for our requests and responses
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
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
  [key: string]: any // For additional fields based on role
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
    baseUrl: "http://localhost:9000/api/v0",
    credentials: "include", // This is important to send and receive cookies
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
