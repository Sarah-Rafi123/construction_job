// Standard interfaces for job-related types

export interface JobService {
  _id: string
  service_name: string
  resource_count: number
  no_of_days?: number
}

export interface JobLocation {
  type: string
  coordinates: number[] // Using number[] instead of [number, number] for flexibility
}

export interface JobCreator {
  _id: string
  email?: string
  role?: string
  company_name?: string
  company_number?: string
}

export interface Job {
  _id: string
  job_title: string
  job_description?: string
  job_type: string
  target_user: string
  services?: JobService[]
  job_priority: boolean
  budget: number | null
  project_image: string | null
  job_location: JobLocation | null
  created_by: JobCreator | string | null
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
  success: boolean
  job: Job  // This is the key change - the API returns 'job' directly, not nested in 'data'
}

export interface UserPostedJobsResponse {
  success?: boolean
  data?: Job[]
  message?: string
}

export interface FeaturedJobsResponse {
  message: string
  jobs: Job[]
}

export interface UpdateJobRequest {
  job_title?: string
  description?: string
  job_type?: string
  target_user?: string
  job_location?: {
    coordinates: number[]
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

 export interface Category {
    title: string
    icon: string
    jobsAvailable: number
  }