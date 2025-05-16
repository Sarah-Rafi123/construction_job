import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define types for the API response
export interface JobService {
  _id: string
  service_name: string
  resource_count: number
  no_of_days: number
}

export interface JobLocation {
  type: string
  coordinates: number[]
}

export interface JobCreator {
  _id: string
  email: string
  role: string
  company_name: string
  company_number: string
}

export interface Job {
  _id: string
  project_image: string | null
  job_title: string
  job_description: string
  job_type: string
  target_user: string
  services: JobService[]
  job_priority: boolean
  budget: number | null
  job_location: JobLocation | null
  created_by: JobCreator | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface FeaturedJobsResponse {
  message: string
  jobs: Job[]
}


export const sampleJobsApi = createApi({
  reducerPath: "sampleJobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:  process.env.NEXT_PUBLIC_BASE_URL,
  }),
  endpoints: (builder) => ({
    getFeaturedJobs: builder.query<FeaturedJobsResponse, void>({
      query: () => "featured-jobs",
    }),
  }),
})

export const { useGetFeaturedJobsQuery } = sampleJobsApi
