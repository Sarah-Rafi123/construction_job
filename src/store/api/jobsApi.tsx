import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define the types based on the API response
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

export interface Job {
  _id: string
  job_title: string
  job_type: string
  target_user: string
  services: JobService[]
  job_priority: boolean
  budget: number | null
  project_image: string | null
  job_location: JobLocation
  created_by: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface JobsResponse {
  message: string
  data: {
    jobs: Job[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface JobDetailResponse {
  message: string
  job: Job
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/v0/",
    credentials: "include", // This is important to send cookies with requests
  }),
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, void>({
      query: () => "jobs",
    }),
    getJobById: builder.query<JobDetailResponse, string>({
      query: (id) => `jobs/${id}`,
    }),
  }),
})

export const { useGetJobsQuery, useGetJobByIdQuery } = jobsApi
