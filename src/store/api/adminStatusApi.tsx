import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for our responses
export interface AdminStatusResponse {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    role: string
    verifyEmail: boolean
    description: string
    profile_picture: string
    company_name: string
    company_number: string
    admin_status: string
    trade: string
  }
}

// Create the API slice
export const adminStatusApi = createApi({
  reducerPath: "adminStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["AdminStatus"],
  endpoints: (builder) => ({
    getAdminStatus: builder.query<AdminStatusResponse, void>({
      query: () => "/get-me",
      providesTags: ["AdminStatus"],
      // Add this for better debugging
      transformResponse: (response: AdminStatusResponse) => {
        console.log("Admin Status API response:", response)
        return response
      },
      // Add this for error handling
      transformErrorResponse: (response) => {
        console.error("Admin Status API error:", response)
        return response
      },
    }),
  }),
})

export const { useGetAdminStatusQuery } = adminStatusApi
