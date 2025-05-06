import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for our requests and responses
export interface UpdateUserProfileRequest {
  description?: string
  profile_picture?: File
}

export interface User {
  id: string
  email: string
  role: string
  verifyEmail: boolean
  description: string
  profile_picture: string
  company_name: string
  company_number: string
  admin_status: string
}

export interface UpdateUserProfileResponse {
  success: boolean
  message: string
  user: User
}

// Create the API slice
export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/v0",
    credentials: "include", // This is important to send and receive cookies
  }),
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<UpdateUserProfileResponse, UpdateUserProfileRequest>({
      query: (userData) => {
        // Create FormData for file upload
        const formData = new FormData()

        // Add description if provided
        if (userData.description !== undefined) {
          formData.append("description", userData.description)
        }

        // Add profile picture if provided
        if (userData.profile_picture) {
          formData.append("profile_picture", userData.profile_picture)
        }

        return {
          url: "/update-user-profile",
          method: "PATCH",
          body: formData,
        }
      },
      invalidatesTags: ["UserProfile"],
    }),
    getUserProfile: builder.query<{ data: User }, void>({
      query: () => "/get-me",
      providesTags: ["UserProfile"],
      // Add this for better debugging
      transformResponse: (response: { data: User }) => {
        console.log("Profile API response:", response)
        return response
      },
      // Add this for error handling
      transformErrorResponse: (response) => {
        console.error("Profile API error:", response)
        return response
      },
    }),
  }),
})

export const { useUpdateUserProfileMutation, useGetUserProfileQuery } = userProfileApi
