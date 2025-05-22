"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import {
  Briefcase,
  Mail,
  User,
  Building,
  Hash,
  Shield,
  Edit,
  Upload,
  HardHat,
  ChevronDown,
  Building2,
  ChevronUp,
  FileUser,
  PhoneCall,
  AlertCircle,
} from "lucide-react"
import { useUpdateUserProfileMutation, useGetUserProfileQuery } from "@/store/api/userProfileApi"

// Component to truncate text with "See more" functionality
const TruncatedText = ({
  text,
  limit,
  isEditing = false,
}: {
  text: string
  limit: number
  isEditing?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!text) return <span className="text-gray-500 italic">Not provided</span>

  // If editing or text is shorter than limit, show full text
  if (isEditing || text.length <= limit || isExpanded) {
    return (
      <div>
        <p className="font-medium">{text}</p>
        {text.length > limit && !isEditing && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-[#D49F2E] text-sm flex items-center mt-1 hover:underline"
          >
            See less <ChevronUp className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    )
  }

  // Show truncated text with "See more" button
  return (
    <div>
      <p className="font-medium">{text.substring(0, limit)}...</p>
      <button
        onClick={() => setIsExpanded(true)}
        className="text-[#D49F2E] text-sm flex items-center mt-1 hover:underline"
      >
        See more <ChevronDown className="h-4 w-4 ml-1" />
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const { data: userData, isLoading, error } = useGetUserProfileQuery()
  const currentUser = userData?.data
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add state for image loading error
  const [imageError, setImageError] = useState(false)

  // Initialize description when user data loads
  useEffect(() => {
    if (currentUser) {
      setDescription(currentUser.description || "")
    }
  }, [currentUser])

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "not-verified":
      default:
        return "bg-red-100 text-red-800 hover:bg-red-200"
    }
  }

  // Start editing description
  const handleEditDescription = () => {
    if (currentUser) {
      setDescription(currentUser.description || "")
      setDescriptionError(null)
      setIsEditingDescription(true)
    }
  }

  // Save description with validation
  const handleSaveDescription = async () => {
    // Validate description length
    if (description.trim().length < 20) {
      setDescriptionError("Description must be at least 20 characters long")
      return
    }

    try {
      console.log("Saving description:", description)
      await updateUserProfile({ description }).unwrap()
      setIsEditingDescription(false)
      setDescriptionError(null)
    } catch (error) {
      console.error("Failed to update description:", error)
    }
  }

  // Cancel editing description
  const handleCancelEdit = () => {
    setIsEditingDescription(false)
    setDescriptionError(null)
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0]
        // Reset image error state when uploading a new image
        setImageError(false)
        await updateUserProfile({ profile_picture: file }).unwrap()
      } catch (error) {
        console.error("Failed to upload profile picture:", error)
      }
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle image load error
  const handleImageError = () => {
    setImageError(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-red-700">Error loading profile. Please try again later.</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="sticky top-0 z-50 w-full">
          <Navbar messageCount={3} />
        </div>

        <main className="flex-grow container mx-auto px-4 pt-4 pb-8 max-w-5xl">
          <h1 className="text-3xl text-black font-bold mb-8">My Profile</h1>

          {currentUser ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image and Basic Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:col-span-1">
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 group">
                    {currentUser.profile_picture && !imageError ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={currentUser.profile_picture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={triggerFileInput}
                        >
                          <Upload size={24} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <User size={64} className="text-gray-400" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={24} className="text-white" />
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                      {formatRole(currentUser.role)}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex text-black items-center gap-3">
                    <Mail size={18} className="text-gray-500" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.role !== "job_seeker" && (
                    <div className="flex text-black items-center gap-3">
                      <Shield size={18} className="text-gray-500" />
                      <span>
                        Status:{" "}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(currentUser.admin_status)}`}
                        >
                          {currentUser.admin_status}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information and Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:col-span-2">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl text-black font-semibold">
                    {currentUser.role === "job_seeker" ? "User Information" : "Company Information"}
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {currentUser.role === "job_seeker" ? (
                      <div className="flex text-black items-start gap-3">
                        <HardHat size={18} className="text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Trade</p>
                          <TruncatedText text={currentUser.trade || ""} limit={30} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-black items-start gap-3">
                          <Building2 size={18} className="text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Company Name</p>
                            <TruncatedText text={currentUser.company_name || ""} limit={30} />
                          </div>
                        </div>
                        <div className="flex text-black items-center gap-3">
                          <PhoneCall size={18} className="text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Contact Number</p>
                            <p className="font-medium">{currentUser.company_number || "Not provided"}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center text-black justify-between mb-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <FileUser size={18} className="text-gray-500" />
                        About
                      </h3>
                      {!isEditingDescription && (
                        <button
                          onClick={handleEditDescription}
                          className="text-[#D49F2E] hover:text-[#D49F2E] flex items-center gap-1 text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditingDescription ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <textarea
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value)
                              // Clear error when user starts typing again
                              if (descriptionError) setDescriptionError(null)
                            }}
                            className={`w-full text-black p-3 border ${
                              descriptionError ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#D49F2E]`}
                            rows={4}
                            placeholder="Write something about yourself or your company..."
                          />
                          <div className="mt-1 flex flex-col space-y-1">
                            {descriptionError && (
                              <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {descriptionError}
                              </p>
                            )}
                            <div className="flex justify-end">
                              <span
                                className={`text-sm ${description.trim().length < 20 ? "text-red-500" : "text-gray-500"}`}
                              >
                                {description.trim().length}/20 characters minimum
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                            disabled={isUpdating}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveDescription}
                            className={`px-3 py-1.5 ${
                              description.trim().length < 20
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#D49F2E] hover:bg-[#D49F2E] cursor-pointer"
                            } text-white rounded-md flex items-center gap-1`}
                            disabled={isUpdating || description.trim().length < 20}
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-black p-4 rounded-md">
                        {currentUser.description ? (
                          <TruncatedText text={currentUser.description} limit={400} />
                        ) : (
                          <p className="text-gray-500 italic">No description provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading profile information...</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
