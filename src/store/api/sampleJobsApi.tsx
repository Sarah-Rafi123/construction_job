import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// In your API files (e.g., jobsApi.ts, userPostedJobsApi.ts)
import { 
  Job, 
} from '@/types/jobTypes';

// Then use these imported types instead of redefining them
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
