import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  success: boolean
}

export interface ResetPasswordRequest {
  email: string
  password: string
  token: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

export const passwordResetApi = createApi({
  reducerPath: "passwordResetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const { useForgotPasswordMutation, useResetPasswordMutation } = passwordResetApi
