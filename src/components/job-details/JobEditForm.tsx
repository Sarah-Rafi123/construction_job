"use client"

import type React from "react"
import { useCallback, useEffect } from "react"
import { MapPin, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"

// Import the map component with dynamic import to avoid SSR issues
const JobLocationMap = dynamic(() => import("@/components/maps/job-location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex justify-center items-center bg-gray-100 rounded-md">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D49F2E]"></div>
    </div>
  ),
})

// Constants for dropdown options
const serviceTypes = [
  "Construction Laborer",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Mason",
  "Painter",
  "Welder",
  "Roofer",
  "Tiler",
  "Pipe Fitter",
]

const jobTypes = ["full-time", "part-time"]

const targetUserTypes = [
  { label: "Job Seekers", value: "job_seeker" },
  { label: "Subcontractors", value: "subcontractor" },
]

interface JobEditFormProps {
  formData: any
  setFormData: (data: any) => void
  handleSubmit: (e: React.FormEvent) => void
  setIsEditing: (value: boolean) => void
  isUpdating: boolean
  coordErrors: {
    latitude: string
    longitude: string
  }
}

export default function JobEditForm({
  formData,
  setFormData,
  handleSubmit,
  setIsEditing,
  isUpdating,
  coordErrors,
}: JobEditFormProps) {
  // Log initial form data for debugging
  useEffect(() => {
    console.log("Initial form data:", formData)
  }, [])

  useEffect(() => {
    // When the component mounts, ensure we have the description field properly set
    if (formData.description && !formData.job_description) {
      setFormData((prev: any) => ({
        ...prev,
        job_description: formData.description,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(`Input changed: ${name} = ${value}`)

    if (name === "budget") {
      const budgetValue = value === "" ? null : Number(value)
      setFormData((prev: any) => ({
        ...prev,
        [name]: budgetValue,
      }))
    } else if (name === "job_description") {
      // Only update job_description, not description
      setFormData((prev: any) => ({
        ...prev,
        job_description: value,
      }))
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services]
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: field === "resource_count" || field === "number_of_days" ? Number(value) : value,
    }

    setFormData((prev: any) => ({
      ...prev,
      services: updatedServices,
    }))
  }

  const addService = () => {
    setFormData((prev: any) => ({
      ...prev,
      services: [...prev.services, { service_name: "Electrician", resource_count: 1, number_of_days: 7 }],
    }))
  }

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const updatedServices = [...formData.services]
      updatedServices.splice(index, 1)
      setFormData((prev: any) => ({
        ...prev,
        services: updatedServices,
      }))
    }
  }

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev: any) => ({ ...prev, latitude: value }))
  }

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData((prev: any) => ({ ...prev, longitude: value }))
  }

  // Handle location selection from the map
  const handleLocationSelect = useCallback(
    (lat: string, lng: string) => {
      setFormData((prev: any) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }))
    },
    [setFormData],
  )

  // Custom form submit handler to log what's being submitted
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Create a new object with the correct field mapping for the API
    const apiData = {
      ...formData,
      job_description: undefined, // Remove job_description from the payload
      description: formData.job_description, // Map job_description to description for the API
    }

    console.log("Submitting form with data:", apiData)

    // Call the original submit handler with the modified data
    const originalEvent = e
    handleSubmit(originalEvent)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="p-6">
        <h2 className="text-xl text-black font-semibold mb-4">Edit Job</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-6">
            {/* Job Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Job Title</h3>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                  required
                  placeholder="e.g., Residential Electrical Wiring Project"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Job Type</h3>
              </div>
              <div className="p-4">
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                  required
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target User */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Target Users</h3>
              </div>
              <div className="p-4">
                <select
                  name="target_user"
                  value={formData.target_user}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                  required
                >
                  {targetUserTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Priority */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Job Priority</h3>
              </div>
              <div className="p-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="job_priority"
                    checked={formData.job_priority}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-[#D49F2E] focus:ring-[#D49F2E] border-gray-300 rounded"
                  />
                  <span className={`ml-2 ${formData.job_priority ? "font-bold text-red-600" : "text-black"}`}>
                    Mark as Urgently Needed
                  </span>
                </label>
                {formData.job_priority && (
                  <p className="mt-2 text-sm text-gray-500">
                    Marking a job as urgent will highlight it in the job listings and notify potential candidates
                    immediately.
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Job Description</h3>
              </div>
              <div className="p-4">
                <textarea
                  name="job_description"
                  value={formData.job_description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                  placeholder="Provide detailed information about the job requirements, expectations, and any specific skills needed."
                />
              </div>
            </div>

            {/* Duration Type */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Duration Type</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="durationType"
                      value="days"
                      checked={formData.durationType === "days"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#D49F2E] focus:ring-[#D49F2E] border-gray-300"
                    />
                    <span className="ml-2 text-black">Days</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="durationType"
                      value="weeks"
                      checked={formData.durationType === "weeks"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#D49F2E] focus:ring-[#D49F2E] border-gray-300"
                    />
                    <span className="ml-2 text-black">Weeks</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="durationType"
                      value="months"
                      checked={formData.durationType === "months"}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#D49F2E] focus:ring-[#D49F2E] border-gray-300"
                    />
                    <span className="ml-2 text-black">Months</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Duration Value */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">
                  Duration in {formData.durationType.charAt(0).toUpperCase() + formData.durationType.slice(1)}
                </h3>
              </div>
              <div className="p-4">
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Project Location */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Project Location</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <MapPin className="h-5 w-5 text-[#D49F2E] mr-2" />
                  <span className="text-sm text-black font-medium">Select the job location on the map</span>
                </div>

                {/* OpenStreetMap Component */}
                <JobLocationMap
                  key={`map-${formData.latitude}-${formData.longitude}`}
                  initialLatitude={formData.latitude}
                  initialLongitude={formData.longitude}
                  onLocationSelect={handleLocationSelect}
                />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      value={formData.latitude}
                      onChange={handleLatitudeChange}
                      className={`w-full px-3 py-2 border ${
                        coordErrors.latitude ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none text-black focus:ring-[#D49F2E] focus:border-[#D49F2E]`}
                      step="0.000001"
                      min="-90"
                      max="90"
                      required
                    />
                    {coordErrors.latitude && <p className="mt-1 text-sm text-red-600">{coordErrors.latitude}</p>}
                    {!coordErrors.latitude && (
                      <p className="mt-1 text-xs text-gray-500">Enter a value between -90 and 90</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      value={formData.longitude}
                      onChange={handleLongitudeChange}
                      className={`w-full px-3 py-2 border ${
                        coordErrors.longitude ? "border-red-500" : "border-gray-300"
                      } rounded-md text-black focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]`}
                      step="0.000001"
                      min="-180"
                      max="180"
                      required
                    />
                    {coordErrors.longitude && <p className="mt-1 text-sm text-red-600">{coordErrors.longitude}</p>}
                    {!coordErrors.longitude && (
                      <p className="mt-1 text-xs text-gray-500">Enter a value between -180 and 180</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Required Services</h3>
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center px-3 py-1 border border-[#D49F2E] text-[#D49F2E] text-sm font-medium rounded-md hover:bg-[#D49F2E] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Service
                </button>
              </div>
              <div className="p-4">
                {formData.services.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 last:mb-0"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">Service {index + 1}</h4>
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type*</label>
                        <select
                          value={service.service_name}
                          onChange={(e) => handleServiceChange(index, "service_name", e.target.value)}
                          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                          required
                        >
                          {serviceTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of {service.service_name}s Required
                          </label>
                          <input
                            type="number"
                            value={service.resource_count}
                            onChange={(e) => handleServiceChange(index, "resource_count", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                            min="1"
                            required
                          />
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium text-gray-700">Budget Amount</h3>
              </div>
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget || ""}
                    onChange={handleInputChange}
                    className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-[#D49F2E] focus:border-[#D49F2E]"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#D49F2E] hover:bg-[#C48E1D] text-white px-4 py-2 rounded-md flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
