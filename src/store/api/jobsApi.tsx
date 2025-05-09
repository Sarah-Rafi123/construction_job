import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { JobsResponse, JobDetailResponse } from "@/types/jobTypes"

export interface PaginationParams {
  page?: number
  limit?: number
}

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, PaginationParams | void>({
      query: (params = { page: 1, limit: 10 }) => {
        const { page = 1, limit = 10 } = params
        return `jobs?page=${page}&limit=${limit}`
      },
    }),
    getJobById: builder.query<JobDetailResponse, string>({
      query: (id) => `jobs/${id}`,
    }),
  }),
})

export const { useGetJobsQuery, useGetJobByIdQuery } = jobsApi
