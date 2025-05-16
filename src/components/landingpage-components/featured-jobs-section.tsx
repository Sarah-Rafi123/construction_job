"use client"

import type React from "react"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useGetFeaturedJobsQuery } from "@/store/api/sampleJobsApi"
import JobCard from "@/components/home-components/job-card"

const FeaturedJobsSection: React.FC = () => {
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)
  const isAuthenticated = !!currentUser

  // Fetch featured jobs from the API
  const { data: featuredJobsData, isLoading, error } = useGetFeaturedJobsQuery()

  const handleExploreClick = () => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-screen px-8 mx-auto ">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Jobs</h2>

        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-t-[#D49F2E] border-r-transparent border-b-[#D49F2E] border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
            Failed to load featured jobs. Please try again later.
          </div>
        )}

        {!isLoading && !error && featuredJobsData && featuredJobsData.jobs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobsData.jobs.slice(0, 3).map((job) => (
              <JobCard key={job._id} job={job} router={router} onViewDetails={handleExploreClick} />
            ))}
          </div>
        )}

        {!isLoading && !error && (!featuredJobsData || featuredJobsData.jobs.length === 0) && (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">No featured jobs available at the moment.</p>
            <button
              onClick={handleExploreClick}
              className="mt-4 px-4 py-2 bg-[#D49F2E] text-white rounded-lg hover:bg-[#C48E1D] transition-colors"
            >
              Explore All Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedJobsSection
