"use client"
// In your API files (e.g., jobsApi.ts, userPostedJobsApi.ts)
import { 
  Job
} from '@/types/jobTypes';

// Then use these imported types instead of redefining them
import type { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Define a more accurate Job type that matches your actual data structure
interface JobService {
  _id: string
  service_name: string
  resource_count: number
}

interface JobLocation {
  type: string
  coordinates: number[]
}

// Update the JobCardProps interface to include an optional onViewDetails function
interface JobCardProps {
  job: Job
  router: ReturnType<typeof useRouter>
  onViewDetails?: (jobId: string) => void
}

// Update the JobCard component to use the provided onViewDetails function if available
export default function JobCard({ job, router, onViewDetails }: JobCardProps) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(job._id)
    } else {
      router.push(`/apply/${job._id}`)
    }
  }

  // Format the creation date
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-semibold text-gray-800 truncate max-w-[70%]" title={job.job_title}>
          {job.job_title.length > 20 ? `${job.job_title.substring(0, 20)}...` : job.job_title}
        </h3>
        <span className="text-sm text-gray-400 flex items-center flex-shrink-0 ml-2">
          <Clock className="h-3 w-3 mr-1" />
          {timeAgo}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3">
        {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-pink-100 text-pink-600 rounded">
          {job.job_type}
        </span>
        {job.services &&
          job.services.slice(0, 2).map((service) => (
            <span
              key={service._id}
              className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
            >
              {service.service_name}
              {service.resource_count > 0 && ` (${service.resource_count})`}
            </span>
          ))}
        {job.services && job.services.length > 2 && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            +{job.services.length - 2} more
          </span>
        )}
      </div>

      <div className="flex bottom-0 items-center justify-between">
        <div className="flex items-center text-gray-500 text-sm">
          <span className=" text-sm text-green-800 px-2 py-0.5 rounded-sm bg-green-100">
            ${job.budget ? job.budget : " not defined "}
          </span>
          {/* <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {job.job_location ? "Map location" : "Location not specified"} */}
        </div>

        <button
          onClick={handleViewDetails}
          className="text-[#D49F2E] hover:text-[#A87723] hover:bg-amber-100 p-1 text-sm font-medium flex items-center"
        >
          View Details
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  )
}
