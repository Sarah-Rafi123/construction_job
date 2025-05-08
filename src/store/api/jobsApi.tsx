import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { JobsResponse, JobDetailResponse } from "@/types/jobTypes"

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
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
