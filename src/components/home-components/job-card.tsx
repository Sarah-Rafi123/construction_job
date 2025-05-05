"use client"

import type { Job } from "@/store/api/jobsApi"
import type { useRouter } from "next/navigation"
import { MapPin, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
  job: Job
  router: ReturnType<typeof useRouter>
}

export default function JobCard({ job, router }: JobCardProps) {
  const handleViewDetails = () => {
    router.push(`/apply/${job._id}`)
  }

  // Format the creation date
  const timeAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-semibold text-gray-800">{job.job_title}</h3>
        <span className="text-sm text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timeAgo}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3">
        {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
          {job.job_type}
        </span>
        {job.services.slice(0, 2).map((service) => (
          <span
            key={service._id}
            className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
          >
            {service.service_name}
            {service.resource_count > 0 && ` (${service.resource_count})`}
          </span>
        ))}
        {job.services.length > 2 && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            +{job.services.length - 2} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {job.job_location ? "Map location" : "Location not specified"}
        </div>

        <button
          onClick={handleViewDetails}
          className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center"
        >
          View Details
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  )
}