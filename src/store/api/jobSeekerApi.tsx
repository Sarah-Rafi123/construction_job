import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import apiClient from "@/api/apiService"

// Define the job seeker registration request with file uploads
export interface JobSeekerRegisterRequest {
  formData: FormData
}

export interface JobSeekerRegisterResponse {
  success: boolean
  message: string
}

export const jobSeekerApi = createApi({
  reducerPath: "jobSeekerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // We'll use custom axios calls
  endpoints: (builder) => ({
    registerJobSeeker: builder.mutation<JobSeekerRegisterResponse, JobSeekerRegisterRequest>({
      queryFn: async ({ formData }) => {
        try {
          // For FormData, we need to use different headers
          const response = await apiClient.post("/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          return { data: response.data }
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status,
              data: error.response?.data || { message: "Job seeker registration failed" },
            },
          }
        }
      },
    }),
  }),
})

export const { useRegisterJobSeekerMutation } = jobSeekerApi
