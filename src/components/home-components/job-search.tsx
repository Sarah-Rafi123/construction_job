"use client"

import { jobTypes, serviceTypes } from "@/lib/data/sampledata"
import { Search, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface JobSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedJobType: string
  setSelectedJobType: (type: string) => void
  selectedServiceType: string
  setSelectedServiceType: (type: string) => void
  radiusFilter: number[]
  setRadiusFilter: (radius: number[]) => void
}

export default function JobSearch({
  searchTerm,
  setSearchTerm,
  selectedJobType,
  setSelectedJobType,
  selectedServiceType,
  setSelectedServiceType,
  radiusFilter,
  setRadiusFilter,
}: JobSearchProps) {
  // State for dropdown visibility
  const [radiusOpen, setRadiusOpen] = useState(false)
  const [jobTypeOpen, setJobTypeOpen] = useState(false)
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false)

  // Refs for dropdown positioning
  const radiusRef = useRef<HTMLDivElement>(null)
  const jobTypeRef = useRef<HTMLDivElement>(null)
  const serviceTypeRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (radiusRef.current && !radiusRef.current.contains(event.target as Node)) {
        setRadiusOpen(false)
      }
      if (jobTypeRef.current && !jobTypeRef.current.contains(event.target as Node)) {
        setJobTypeOpen(false)
      }
      if (serviceTypeRef.current && !serviceTypeRef.current.contains(event.target as Node)) {
        setServiceTypeOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle radius selection
  const handleRadiusSelect = (min: number, max: number) => {
    setRadiusFilter([min, max])
    setRadiusOpen(false)
  }

  // Handle job type selection
  const handleJobTypeSelect = (type: string) => {
    setSelectedJobType(type)
    setJobTypeOpen(false)
  }

  // Handle service type selection
  const handleServiceTypeSelect = (type: string) => {
    setSelectedServiceType(type)
    setServiceTypeOpen(false)
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-black mb-4">Explore Jobs</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-grow md:flex-grow-0 md:w-[370px] lg:w-[600px] flex items-center border border-gray-200 rounded-full bg-white overflow-hidden">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 py-3 border-none focus:ring-0 focus:outline-none text-gray-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-700" />
            </div>
          </div>

          <div className="border-l border-gray-200 h-full"></div>

          <div ref={radiusRef} className="relative px-4 py-3">
            <button
              onClick={() => setRadiusOpen(!radiusOpen)}
              className="flex items-center text-gray-700 focus:outline-none"
            >
              <span className="mr-2">
                {radiusFilter[0] === 0 && radiusFilter[1] === 30
                  ? "Travel Radius"
                  : `${radiusFilter[0]}-${radiusFilter[1]} km`}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-700" />
            </button>

            {radiusOpen && (
              <div className="absolute z-50 left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleRadiusSelect(0, 10)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    0-10 km
                  </button>
                  <button
                    onClick={() => handleRadiusSelect(0, 30)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    0-30 km
                  </button>
                  <button
                    onClick={() => handleRadiusSelect(0, 50)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    0-50 km
                  </button>
                  <button
                    onClick={() => handleRadiusSelect(0, 100)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    0-100 km
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Type dropdown */}
        <div ref={jobTypeRef} className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
          <button
            onClick={() => setJobTypeOpen(!jobTypeOpen)}
            className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 focus:outline-none"
          >
            <span>{selectedJobType === "All Types" ? "Job Type" : selectedJobType}</span>
            <ChevronDown className="h-5 w-5 ml-2 text-gray-700" />
          </button>

          {jobTypeOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleJobTypeSelect(type)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Service Type dropdown */}
        <div ref={serviceTypeRef} className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
          <button
            onClick={() => setServiceTypeOpen(!serviceTypeOpen)}
            className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-full bg-white text-gray-700 focus:outline-none"
          >
            <span>{selectedServiceType === "All Services" ? "Service type" : selectedServiceType}</span>
            <ChevronDown className="h-5 w-5 ml-2 text-gray-700" />
          </button>

          {serviceTypeOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {serviceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleServiceTypeSelect(type)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Over {radiusFilter[1] === 50 ? 80 : 40} Job within {radiusFilter[1]} Km
      </div>
    </div>
  )
}
