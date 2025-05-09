export interface Job {
  _id: string
  job_title: string
  job_type: string
  target_user: string
  services?: Array<{
    _id: string
    service_name: string
    resource_count: number
    no_of_days?: number
  }>
  job_priority: boolean
  budget: number | null
  project_image: string | null
  job_location: {
    type: string
    coordinates: number[]
  } | null
  job_description: string
  created_by: any | null
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
  data: {
    job: Job
  }
}
