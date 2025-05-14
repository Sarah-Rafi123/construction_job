"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetJobByIdQuery, useUpdateJobMutation, useDeleteJobMutation } from "@/store/api/userPostedJobsApi"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { MapPin, Trash2, AlertTriangle, Calendar, Briefcase, DollarSign, ArrowLeft } from "lucide-react"
import { format, isValid, parseISO } from "date-fns"
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

// Constants for dropdown options description
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

export default function JobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: job, isLoading, error } = useGetJobByIdQuery(id)
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation()
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", // or "error"
  })

  // Form state
  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    job_type: "full-time",
    target_user: "job_seeker",
    job_priority: false,
    budget: 0,
    latitude: "12.9716", // Default to Bangalore
    longitude: "77.5946", // Default to Bangalore
    durationType: "days",
    duration: "7",
    services: [{ service_name: "Electrician", resource_count: 1, number_of_days: 7 }],
  })

  // Initialize form data when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        job_title: job.job_title || "",
        job_description: job.job_description || "",
        job_type: job.job_type || "full-time",
        target_user: job.target_user || "job_seeker",
        job_priority: job.job_priority || false,
        budget: job.budget || 0,
        latitude: job.job_location?.coordinates[1]?.toString() || "12.9716",
        longitude: job.job_location?.coordinates[0]?.toString() || "77.5946",
        durationType: "days", // Default
        duration: "7", // Default
        services:
          job.services && Array.isArray(job.services)
            ? job.services.map((service) => ({
                service_name: service.service_name || "",
                resource_count: service.resource_count || 1,
                number_of_days: service.no_of_days || 7,
              }))
            : [{ service_name: "Electrician", resource_count: 1, number_of_days: 7 }],
      })
    }
  }, [job])

  // Validation state for coordinates
  const [coordErrors, setCoordErrors] = useState({
    latitude: "",
    longitude: "",
  })

  // Handle location selection from the map
  const handleLocationSelect = useCallback((lat: string, lng: string) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
    // Clear any previous errors
    setCoordErrors({
      latitude: "",
      longitude: "",
    })
  }, [])

  const handleLatitudeChange = (e: { target: { value: any } }) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, latitude: value }))
    const lat = Number.parseFloat(value)
    if (isNaN(lat)) {
      setCoordErrors((prev) => ({ ...prev, latitude: "Please enter a valid number" }))
    } else if (lat < -90 || lat > 90) {
      setCoordErrors((prev) => ({ ...prev, latitude: "Latitude must be between -90 and 90" }))
    } else {
      setCoordErrors((prev) => ({ ...prev, latitude: "" }))
    }
  }

  const handleLongitudeChange = (e: { target: { value: any } }) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, longitude: value }))
    const lng = Number.parseFloat(value)
    if (isNaN(lng)) {
      setCoordErrors((prev) => ({ ...prev, longitude: "Please enter a valid number" }))
    } else if (lng < -180 || lng > 180) {
      setCoordErrors((prev) => ({ ...prev, longitude: "Longitude must be between -180 and 180" }))
    } else {
      setCoordErrors((prev) => ({ ...prev, longitude: "" }))
    }
  }

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: { target: { name: any; checked: any } }) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
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

    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }))
  }

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { service_name: "Electrician", resource_count: 1, number_of_days: 7 }],
    }))
  }

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const updatedServices = [...formData.services]
      updatedServices.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        services: updatedServices,
      }))
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // Validate coordinates
    const lat = Number.parseFloat(formData.latitude)
    const lng = Number.parseFloat(formData.longitude)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setNotification({
        show: true,
        message: "Please enter valid coordinates",
        type: "error",
      })
      return
    }

    try {
      let numberOfDays = Number.parseInt(formData.duration) || 7
      if (formData.durationType === "weeks") {
        numberOfDays = numberOfDays * 7
      } else if (formData.durationType === "months") {
        numberOfDays = numberOfDays * 30
      }

      // Format the data according to the API requirements
      const jobData = {
        job_title: formData.job_title,
        description: formData.job_description, // API expects 'description' not 'job_description'
        job_type: formData.job_type,
        target_user: formData.target_user,
        job_priority: formData.job_priority,
        budget: formData.budget || null,
        job_location: {
          coordinates: [lng, lat], // [longitude, latitude]
          type: "Point",
        },
        services: formData.services.map((service) => ({
          service_name: service.service_name,
          resource_count: service.resource_count,
          number_of_days: service.number_of_days || numberOfDays,
        })),
      }

      await updateJob({
        jobId: id,
        jobData,
      }).unwrap()

      setNotification({
        show: true,
        message: "Job updated successfully!",
        type: "success",
      })

      setIsEditing(false)
    } catch (error) {
      // console.error("Failed to update job:", error)
      setNotification({
        show: true,
        message: "Failed to update job. Please try again.",
        type: "error",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteJob(id).unwrap()
      setNotification({
        show: true,
        message: "Job deleted successfully!",
        type: "success",
      })

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/my-posted-jobs")
      }, 1500)
    } catch (error) {
      // console.error("Failed to delete job:", error)
      setNotification({
        show: true,
        message: "Failed to delete job. Please try again.",
        type: "error",
      })
      setShowDeleteConfirm(false)
    }
  }

  const handleGoBack = () => {
    router.push("/my-posted-jobs")
  }

  // Close notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D49F2E] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading job details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading job</h3>
              <p className="text-gray-600">There was a problem loading the job details. Please try again later.</p>
              <button
                onClick={handleGoBack}
                className="mt-4 inline-block bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Back to My Jobs
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Format the creation date safely
  let formattedDate = "Unknown date"
  if (job.createdAt) {
    try {
      // Try to parse as ISO string first (most reliable)
      const date = parseISO(job.createdAt)
      if (isValid(date)) {
        formattedDate = format(date, "MMMM dd, yyyy")
      } else {
        // Fallback to regular Date constructor
        const fallbackDate = new Date(job.createdAt)
        if (isValid(fallbackDate)) {
          formattedDate = format(fallbackDate, "MMMM dd, yyyy")
        }
      }
    } catch (e) {
      console.error("Error formatting date:", e)
      // Keep the default "Unknown date"
    }
  }

  // Get the first letter of each word in the job title for the avatar
  const avatarText = job.job_title
    ? job.job_title
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "JB"

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-md ${
              notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {!isEditing ? (
            // View mode - styled like the ApplyJobPage
            <>
              {/* Job Details Card */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D49F2E] text-white flex items-center justify-center font-bold text-lg mr-4">
                      {avatarText}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">{job.job_title}</h1>
                      <p className="text-gray-600">
                        {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#D49F2E] mr-3" />
                      <span className="text-gray-600">
                        {job.job_location
                          ? `${job.job_location.coordinates[1]}, ${job.job_location.coordinates[0]}`
                          : "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-[#D49F2E] mr-3" />
                      <span className="text-gray-600">{job.job_type}</span>
                    </div>

                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-[#D49F2E] mr-3" />
                      <span className="text-gray-600">{job.budget ? `$${job.budget}` : "Budget not specified"}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#D49F2E] mr-3" />
                      <span className="text-gray-600">Posted on {formattedDate}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Services Required:</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.services && Array.isArray(job.services) && job.services.length > 0 ? (
                        job.services.map((service, index) => (
                          <span
                            key={service._id || index}
                            className="inline-flex items-center px-3 py-1rounded-full text-sm bg-[rgba(212,159,46,0.1)] text-[#D49F2E]"
                          >
                            {service.service_name}
                            {service.resource_count > 0 ? ` (${service.resource_count})` : ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">No services specified</span>
                      )}
                    </div>
                  </div>

                  {job.job_priority && (
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 font-semibold">
                        Priority
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Card */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
                <div className="p-6">
                  <h2 className="text-xl text-black font-semibold mb-4">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.job_description || "No description provided for this job."}
                    {!job.job_description && (
                      <>
                        <br />
                        <br />
                        This is a {job.job_type} position
                        {job.target_user === "subcontractor" ? " for subcontractors" : " for individual job seekers"}.
                        {job.services && Array.isArray(job.services) && job.services.length > 0 && (
                          <>
                            <br />
                            <br />
                            We are looking for professionals with expertise in{" "}
                            {job.services.map((s) => s.service_name).join(", ")}.
                          </>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleGoBack}
                  className="flex items-center bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Edit mode - styled like the PostJob component
            <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
              <div className="p-6">
                <h2 className="text-xl text-black font-semibold mb-4">Edit Job</h2>
                <form onSubmit={handleSubmit}>
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
                            Marking a job as urgent will highlight it in the job listings and notify potential
                            candidates immediately.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-medium text-gray-700">Job Description</h3>
                      </div>
                      <div className="p-4">
                        <textarea
                          name="job_description"
                          value={formData.job_description}
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
                            {coordErrors.latitude && (
                              <p className="mt-1 text-sm  text-red-600">{coordErrors.latitude}</p>
                            )}
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
                            {coordErrors.longitude && (
                              <p className="mt-1 text-sm text-red-600">{coordErrors.longitude}</p>
                            )}
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
                        {formData.services.map((service, index) => (
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
                                <div>
                                </div>
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
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center text-red-500 mb-4">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-bold">Confirm Deletion</h3>
                </div>
                <p className="mb-6 text-black">Are you sure you want to delete this job? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete Job"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
