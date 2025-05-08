import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for our requests and responses
export interface PostJobRequest {
  job_title: string
  job_location: {
    coordinates: [number, number] // [longitude, latitude]
  }
  job_type: string
  target_user: string
  services: {
    service_name: string
    resource_count: number
    number_of_days: number
  }[]
  job_priority?: boolean
  budget?: number | null
  project_image?: string | null
  description?: string
}

export interface PostJobResponse {
  success: boolean
  message: string
  job?: {
    _id: string
    job_title: string
    // Other job fields that might be returned
  }
}

// Create the API slice
export const jobPostingApi = createApi({
  reducerPath: "jobPostingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include", 
  }),
  endpoints: (builder) => ({
    postJob: builder.mutation<PostJobResponse, PostJobRequest>({
      query: (jobData) => ({
        url: "/post-job",
        method: "POST",
        body: jobData,
      }),
      // Add this onError handler
      async onQueryStarted(jobData, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          console.error("API Error Response:", error)
          console.error("Request data that caused the error:", JSON.stringify(jobData, null, 2))
        }
      },
    }),
  }),
})

export const { usePostJobMutation } = jobPostingApi
