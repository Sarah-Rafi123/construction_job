"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown } from "lucide-react"
import { Slider } from "@mui/material"

interface JobSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedJobType: string
  setSelectedJobType: (type: string) => void
  selectedServiceType: string
  setSelectedServiceType: (type: string) => void
  radiusFilter: number[]
  setRadiusFilter: (radius: number[]) => void
  sortBy: string
  setSortBy: (sort: string) => void
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
  sortBy,
  setSortBy,
}: JobSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const jobTypes = ["All Types", "Full-Time", "Part-Time", "Contract", "Temporary"]
  const serviceTypes = ["All Services", "Electrician", "Plumber", "Carpenter", "Painter", "Construction Manager"]

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={18} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative min-w-[180px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance: {radiusFilter[0]} - {radiusFilter[1]} km
            </label>
            <Slider
              value={radiusFilter}
              onChange={(_, newValue) => setRadiusFilter(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={50}
              sx={{
                color: "#D49F2E",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#D49F2E",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#E5E7EB",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
