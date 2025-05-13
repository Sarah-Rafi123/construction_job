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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Use the updated query with pagination
  const {
    data: jobsData,
    error,
    isLoading,
    isFetching,
  } = useGetJobsQuery({
    page: currentPage,
    limit: itemsPerPage,
  })

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

      if (searchTerm) {
        results = results.filter((job) => job.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      }
      if (selectedJobType !== "All Types") {
        results = results.filter((job) => job.job_type.toLowerCase() === selectedJobType.toLowerCase())
      }
      if (selectedServiceType !== "All Services") {
        results = results.filter((job) => job.services?.some((service) => service.service_name === selectedServiceType))
      }
      if (userLocation && radiusFilter > 0) {
        results = results.filter((job) => {
          if (
            job.job_location?.coordinates &&
            Array.isArray(job.job_location.coordinates) &&
            job.job_location.coordinates.length === 2
          ) {
            const jobLat = job.job_location.coordinates[1]
            const jobLng = job.job_location.coordinates[0]
            const distance = calculateDistance(userLocation.lat, userLocation.lng, jobLat, jobLng)
            return distance <= radiusFilter
          }
          return true
        })
      }
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
  }, [jobsData, searchTerm, selectedJobType, selectedServiceType, radiusFilter, sortBy, userLocation, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedJobType, selectedServiceType, radiusFilter, sortBy])

  if (error) {
    router.push("/landing-page")
    return null
  }

  return (
    <ProtectedRoute>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar messageCount={3} />
      </div>
      <div className="min-h-screen bg-gray-50 pt-16">
        {" "}
        <MainSection userType={currentUser?.role} />
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

           {/* <div className="mt-8 text-center">
            <p className="text-gray-600">
              You've successfully logged in as a{" "}
              {currentUser?.role
                ?.split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              .
            </p>
          </div>  */}
        </main>
      </div>
      <Footer />
    </ProtectedRoute>
  )
}
