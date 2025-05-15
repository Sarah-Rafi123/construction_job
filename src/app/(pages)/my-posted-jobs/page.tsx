"use client"

import { useGetUserPostedJobsQuery } from "@/store/api/userPostedJobsApi"
import { MapPin, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function MyPostedJobsPage() {
  const { data: jobs, isLoading, error } = useGetUserPostedJobsQuery()

  return (
    <div className="min-h-screen flex flex-col bg-white">
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                   <Navbar  />
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
                    <div
                      key={job._id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="text-base font-semibold text-gray-800 truncate max-w-[70%]"
                          title={job.job_title}
                        >
                          {job.job_title.length > 30 ? `${job.job_title.substring(0, 30)}...` : job.job_title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.job_priority ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {job.job_priority ? "Priority" : "Regular"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
                        <span className="mx-2">•</span>
                        <span className="font-medium">{job.job_type}</span>
                      </p>

                      <div className="flex gap-2 mb-4 flex-wrap">
                        {job.services &&
                          job.services.slice(0, 3).map((service) => (
                            <span
                              key={service._id}
                              className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                            >
                              {service.service_name}
                              {service.resource_count > 0 && ` (${service.resource_count})`}
                            </span>
                          ))}
                        {job.services && job.services.length > 3 && (
                          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            +{job.services.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center w-full justify-between">
                        {/* <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {job.job_location ? "Map location" : "Location not specified"}
                        </div> */}

                        <div className="flex items-center">
                          {job.budget !== null && (
                            <span className="text-sm font-medium text-gray-700 mr-3">${job.budget}</span>
                          )}
                          <Link
                            href={`/job-details/${job._id}`}
                            className="text-[#D49F2E] hover:text-[#A87723] hover:bg-amber-100 p-1 text-sm font-medium flex items-center"
                          >
                            View Details
                            <span className="ml-1">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
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
