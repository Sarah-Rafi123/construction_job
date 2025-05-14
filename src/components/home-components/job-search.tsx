"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, ChevronDown, MapPin, Check } from "lucide-react"
import { Slider } from "@mui/material"

interface JobSearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedJobType: string
  setSelectedJobType: (type: string) => void
  selectedServiceType: string
  setSelectedServiceType: (type: string) => void
  radiusFilter: number
  setRadiusFilter: (radius: number) => void
  sortBy: string
  setSortBy: (sort: string) => void
  userLocation: { lat: number; lng: number } | null
}
interface CustomDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function CustomDropdown({ options, value, onChange, placeholder, className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md text-black cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#D49F2E] focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-black">{value || placeholder || "Select an option"}</span>
        <ChevronDown className="absolute right-3 text-gray-400" size={18} />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between text-black ${
                value === option ? "bg-amber-50 text-[#D49F2E]" : "text-black"
              }`}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              <span>{option}</span>
              {value === option && <Check size={16} className="text-[#D49F2E]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
  userLocation,
}: JobSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const jobTypes = ["All Types", "Full-Time", "Part-Time"]
  const serviceTypes = ["All Services", "Electrician", "Plumber", "Carpenter", "Painter", "Construction Manager"]
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budget-high", label: "Budget: High to Low" },
    { value: "budget-low", label: "Budget: Low to High" },
  ]

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedJobType("All Types")
    setSelectedServiceType("All Services")
    setRadiusFilter(0)
    setSortBy("newest")
  }

  // Find the label for the current sort value
  const currentSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || sortOptions[0].label

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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D49F2E] focus:border-transparent"
          />
        </div>

        {/* Sort dropdown - using custom dropdown */}
        <div className="relative min-w-[180px]">
          <CustomDropdown
            options={sortOptions.map((option) => option.label)}
            value={currentSortLabel}
            onChange={(label) => {
              const option = sortOptions.find((opt) => opt.label === label)
              if (option) setSortBy(option.value)
            }}
          />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center text-black gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <CustomDropdown options={jobTypes} value={selectedJobType} onChange={setSelectedJobType} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <CustomDropdown options={serviceTypes} value={selectedServiceType} onChange={setSelectedServiceType} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance: {radiusFilter} km</label>
              {!userLocation && (
                <div className="flex items-center text-[#D49F2E] text-xs">
                  <MapPin size={12} className="mr-1" />
                  <span>Enable location to use this filter</span>
                </div>
              )}
            </div>
            <Slider
              value={radiusFilter}
              onChange={(_, newValue) => setRadiusFilter(newValue as number)}
              valueLabelDisplay="auto"
              min={0}
              max={40}
              disabled={!userLocation}
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
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
