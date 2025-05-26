import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { JobsResponse, JobDetailResponse } from "@/types/jobTypes"

export interface JobsQueryParams {
  page?: number
  limit?: number
  jobType?: string
  latitude?: number
  longitude?: number
  serviceType?: string
  distanceInKm?: number
  searchTerm?: string
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:  process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, JobsQueryParams | void>({
      query: (params?: JobsQueryParams) => {
        // Use default parameters if params is undefined or void
        const page = params?.page ?? 1
        const limit = params?.limit ?? 10

        // Build query string with all available filters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        // Add optional filters if they exist
        if (params?.jobType && params.jobType !== "All Types") {
          queryParams.append("jobType", params.jobType)
        }

        if (params?.latitude !== undefined && params?.longitude !== undefined) {
          queryParams.append("latitude", params.latitude.toString())
          queryParams.append("longitude", params.longitude.toString())
        }

        if (params?.serviceType && params.serviceType !== "All Services") {
          queryParams.append("serviceType", params.serviceType)
        }

        if (params?.distanceInKm && params.distanceInKm > 0) {
          queryParams.append("distanceInKm", params.distanceInKm.toString())
        }

        return `jobs?${queryParams.toString()}`
      },
    }),
    getJobById: builder.query<JobDetailResponse, string>({
      query: (id) => `jobs/${id}`,
    }),
  }),
})

export const { useGetJobsQuery, useGetJobByIdQuery } = jobsApi
