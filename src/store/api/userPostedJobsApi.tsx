import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
  job_location: JobLocation | null
  created_by: string
  createdAt: string
  updatedAt: string
  __v: number
  job_description?: string
}

export interface UserPostedJobsResponse {
  success?: boolean
  data?: Job[]
  message?: string
}

export interface UpdateJobRequest {
  job_title?: string
  description?: string
  job_type?: string
  target_user?: string
  job_location?: {
    coordinates: number[] // [longitude, latitude]
    type: string
  }
  services?: {
    service_name: string
    resource_count: number
    number_of_days: number
  }[]
  job_priority?: boolean
  budget?: number | null
}

export const userPostedJobsApi = createApi({
  reducerPath: "userPostedJobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000/api/v0",
    credentials: "include",
  }),
  tagTypes: ["UserJobs"],
  endpoints: (builder) => ({
    getUserPostedJobs: builder.query<Job[], void>({
      query: () => "user-posted-jobs",
      transformResponse: (response: UserPostedJobsResponse | Job[]) => {
        // Handle both response formats (array or object with data property)
        if (Array.isArray(response)) {
          return response
        }
        return response.data || []
      },
      providesTags: ["UserJobs"],
    }),

    getJobById: builder.query<Job, string>({
      query: (id) => `jobs/${id}`,
      transformResponse: (response: { message: string; job: Job }) => {
        // Extract the job data from the response
        return response.job
      },
      providesTags: (result, error, id) => [{ type: "UserJobs", id }],
    }),

    updateJob: builder.mutation<any, { jobId: string; jobData: UpdateJobRequest }>({
      query: ({ jobId, jobData }) => ({
        url: `update-job/${jobId}`,
        method: "PATCH",
        body: jobData,
      }),
      invalidatesTags: ["UserJobs"],
    }),

    deleteJob: builder.mutation<any, string>({
      query: (jobId) => ({
        url: `delete-job/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserJobs"],
    }),
  }),
})

export const { useGetUserPostedJobsQuery, useGetJobByIdQuery, useUpdateJobMutation, useDeleteJobMutation } =
  userPostedJobsApi
