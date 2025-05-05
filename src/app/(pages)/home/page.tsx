"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import MainSection from "@/components/home-components/main-section"
import JobSearch from "@/components/home-components/job-search"
import JobGrid from "@/components/home-components/job-grid"
import { useGetJobsQuery } from "@/store/api/jobsApi"
import { useAppSelector } from "@/store/hooks"
import type { Job } from "@/store/api/jobsApi"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, userType } = useAppSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("All Types")
  const [selectedServiceType, setSelectedServiceType] = useState("All Services")
  const [radiusFilter, setRadiusFilter] = useState<number>(0)
  const [sortBy, setSortBy] = useState("newest")
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Fetch jobs using Redux Toolkit Query
  const { data: jobsData, error, isLoading } = useGetJobsQuery()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Calculate distance between two points in km using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  useEffect(() => {
    if (jobsData?.data?.jobs) {
      let results = [...jobsData.data.jobs]

      // Apply search filter
      if (searchTerm) {
        results = results.filter((job) => job.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      }

      // Apply job type filter
      if (selectedJobType !== "All Types") {
        results = results.filter((job) => job.job_type.toLowerCase() === selectedJobType.toLowerCase())
      }

      // Apply service type filter
      if (selectedServiceType !== "All Services") {
        results = results.filter((job) => job.services?.some((service) => service.service_name === selectedServiceType))
      }

      // Apply radius filter if user location is available
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
          return true // Include jobs without location data
        })
      }

      // Sort jobs
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
  }, [jobsData, searchTerm, selectedJobType, selectedServiceType, radiusFilter, sortBy, userLocation])

  const handlePostJob = () => {
    router.push("/post-job")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-red-700">Error loading jobs. Please try again later.</p>
      </div>
    )
  }

  const needsApproval = userType === "main-contractor" || userType === "sub-contractor"
  const isContractor = userType === "main-contractor" || userType === "sub-contractor"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar notificationCount={5} messageCount={3} />
      <MainSection userType={userType} />

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
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            You've successfully logged in as a{" "}
            {userType
              ?.split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            .
          </p>
        </div>
      </main>
    </div>
  )
}
