"use client"

import type { useRouter } from "next/navigation"
import JobCard from "./job-card"
import Image from "next/image"
import Map from "../../../public/assets/images/Map.png"
import type { Job } from "@/store/api/jobsApi"

type Router = ReturnType<typeof useRouter>

interface JobGridProps {
  jobs: Job[]
  router: Router
}

export default function JobGrid({ jobs, router }: JobGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job listings column - takes up 2/3 of the space */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} router={router} />
          ))}
        </div>
      </div>
      <div className="relative h-[600px] rounded-lg overflow-hidden border border-gray-200">
        <Image src={Map || "/placeholder.svg"} alt="Job locations map" fill className="object-cover" />
      </div>
    </div>
  )
}
