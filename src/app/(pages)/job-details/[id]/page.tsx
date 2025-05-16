"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetJobByIdQuery, useUpdateJobMutation, useDeleteJobMutation } from "@/store/api/userPostedJobsApi"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { format, isValid, parseISO } from "date-fns"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import LoadingState from "@/components/job-details/LoadingState"
import ErrorState from "@/components/job-details/ErrorState"
import ViewJobDetails from "@/components/job-details/ViewJobDetails"
import JobEditForm from "@/components/job-details/JobEditForm"
import DeleteConfirmationDialog from "@/components/job-details/DeleteConfirmationDialog"
import Notification from "@/components/job-details/Notification"

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
            ? job.services.map((service: any) => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        services: formData.services.map((service: any) => ({
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
      console.error("Failed to update job:", error)
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
    return <LoadingState />
  }

  if (error || !job) {
    return <ErrorState handleGoBack={handleGoBack} />
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
        .map((word: string) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "JB"

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
             <Navbar />
           </div>
        <main className="mt-10 flex-grow">
          <Notification notification={notification} />
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {!isEditing ? (
              // View mode
              <ViewJobDetails
                job={job}
                formattedDate={formattedDate}
                avatarText={avatarText}
                handleGoBack={handleGoBack}
                setIsEditing={setIsEditing}
                setShowDeleteConfirm={setShowDeleteConfirm}
              />
            ) : (
              <JobEditForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                setIsEditing={setIsEditing}
                isUpdating={isUpdating}
                coordErrors={coordErrors}
              />
            )}
            <DeleteConfirmationDialog
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              handleDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
