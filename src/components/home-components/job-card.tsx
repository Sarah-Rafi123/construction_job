"use client"

import type { Job } from "@/lib/data/types"
import type { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

interface JobCardProps {
  job: Job
  router: ReturnType<typeof useRouter>
}

export default function JobCard({ job, router }: JobCardProps) {
  const handleViewDetails = () => {
    router.push(`/apply/${job.id}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-semibold text-gray-800">{job.title}</h3>
        <span className="text-sm text-gray-400">2h ago</span>
      </div>

      <p className="text-gray-600 text-sm mb-3">{job.company}</p>

      <div className="flex gap-2 mb-4">
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
          Part-Time
        </span>
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
          {job.services[0]}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {job.location}
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
