"use client"

import type { useRouter } from "next/navigation"
import JobCard from "./job-card"
import GoogleMapComponent from "../maps/google-maps"
// In your API files (e.g., jobsApi.ts, userPostedJobsApi.ts)
import { 
  Job
} from '@/types/jobTypes';

// Then use these imported types instead of redefining them
import { ChevronLeft, ChevronRight } from "lucide-react"

type Router = ReturnType<typeof useRouter>

interface JobGridProps {
  jobs: Job[]
  router: Router
  userLocation: { lat: number; lng: number } | null
  radiusFilter: number
  onUserLocationChange: (location: { lat: number; lng: number } | null) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

export default function JobGrid({
  jobs,
  router,
  userLocation,
  radiusFilter,
  onUserLocationChange,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: JobGridProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D49F2E] mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading jobs...</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job listings column - takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
      <JobCard key={job._id} job={job as Job} router={router} />
            ))}
          </div>
        </div>
        <div className="relative h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <GoogleMapComponent
            jobs={jobs}
            userLocation={userLocation}
            radiusFilter={radiusFilter}
            onUserLocationChange={onUserLocationChange}
          />
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`flex items-center justify-center w-10 h-10 rounded-md border ${
            currentPage <= 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum = i + 1
            if (totalPages > 5) {
              if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === pageNum
                    ? "bg-[#D49F2E] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="flex items-center justify-center w-10 h-10">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-md border ${
            currentPage >= totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}
