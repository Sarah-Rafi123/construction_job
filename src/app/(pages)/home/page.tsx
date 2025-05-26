"use client"

import ProtectedRoute from "@/components/global/ProtectedRoute"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import MainSection from "@/components/home-components/main-section"
import JobSearch from "@/components/home-components/job-search"
import JobGrid from "@/components/home-components/job-grid"
import { useGetJobsQuery } from "@/store/api/jobsApi"
import { useAppSelector } from "@/store/hooks"
import type { Job } from "@/types/jobTypes"
import Footer from "@/components/layout/footer"

export default function Home() {
  const router = useRouter()
  const { currentUser } = useAppSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("All Types")
  const [selectedServiceType, setSelectedServiceType] = useState("All Services")
  const [radiusFilter, setRadiusFilter] = useState<number>(0)
  const [sortBy, setSortBy] = useState("newest")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Build query parameters for the API
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(selectedJobType !== "All Types" && { jobType: selectedJobType }),
    ...(userLocation && {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    }),
    ...(selectedServiceType !== "All Services" && { serviceType: selectedServiceType }),
    ...(radiusFilter > 0 && userLocation && { distanceInKm: radiusFilter }),
  }

  // Use the updated query with all filters
  const { data: jobsData, error, isLoading, isFetching } = useGetJobsQuery(queryParams)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Client-side filtering for search term and sorting (since API doesn't handle these)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])

  useEffect(() => {
    if (jobsData?.data) {
      // Update pagination information from the API response
      const { pagination } = jobsData.data
      setTotalPages(pagination.totalPages)
      setItemsPerPage(pagination.limit)

      // If we're on a page that no longer exists after filtering, go back to page 1
      if (currentPage > pagination.totalPages && pagination.totalPages > 0) {
        setCurrentPage(1)
      }

      let results = [...jobsData.data.jobs]

      // Apply client-side search term filtering (if API doesn't support it)
      if (searchTerm) {
        results = results.filter((job) => job.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      // Apply client-side sorting (if API doesn't support it)
      if (sortBy === "newest") {
        results = results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (sortBy === "budget-high") {
        results = results.sort((a, b) => {
          if (a.budget === null) return 1
          if (b.budget === null) return -1
          return (b.budget || 0) - (a.budget || 0)
        })
      } else if (sortBy === "budget-low") {
        results = results.sort((a, b) => {
          if (a.budget === null) return 1
          if (b.budget === null) return -1
          return (a.budget || 0) - (b.budget || 0)
        })
      }

      setFilteredJobs(results)
    }
  }, [jobsData, searchTerm, sortBy, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedJobType, selectedServiceType, radiusFilter, userLocation])

  if (error) {
    router.push("/landing-page")
    return null
  }

  return (
    <ProtectedRoute>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-50 pt-16">
        <MainSection userType={currentUser?.role ?? null} />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mt-12 mb-8 bg-white p-6 rounded-xl shadow-sm">
            <JobSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedJobType={selectedJobType}
              setSelectedJobType={setSelectedJobType}
              selectedServiceType={selectedServiceType}
              setSelectedServiceType={setSelectedServiceType}
              radiusFilter={radiusFilter}
              setRadiusFilter={setRadiusFilter}
              setSortBy={setSortBy}
              sortBy={sortBy}
              userLocation={userLocation}
            />

            <JobGrid
              jobs={filteredJobs}
              router={router}
              userLocation={userLocation}
              radiusFilter={radiusFilter}
              onUserLocationChange={setUserLocation}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading || isFetching}
            />
          </div>
        </main>
      </div>
      <Footer />
    </ProtectedRoute>
  )
}
