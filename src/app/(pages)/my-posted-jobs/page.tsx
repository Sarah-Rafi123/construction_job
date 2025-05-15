"use client"

import { useGetUserPostedJobsQuery } from "@/store/api/userPostedJobsApi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import JobCard from "@/components/home-components/job-card"

export default function MyPostedJobsPage() {
  const { data: jobs, isLoading, error } = useGetUserPostedJobsQuery()
  const router = useRouter()

  const handleViewJobDetails = (jobId: string) => {
    router.push(`/job-details/${jobId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      <main className="flex-grow mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D49F2E] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your jobs...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading jobs</h3>
              <p className="text-gray-600">There was a problem loading your posted jobs. Please try again later.</p>
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-600">You haven't posted any jobs yet.</p>
              <Link
                href="/post-job"
                className="mt-4 inline-block bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text-[#D49F2E] font-bold">Your Posted Jobs</h1>
                <Link
                  href="/post-job"
                  className="bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Post New Job
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} router={router} onViewDetails={handleViewJobDetails} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
