"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import { Briefcase, Mail, User, Building, Hash, Shield, Edit, Upload } from "lucide-react"
import { useUpdateUserProfileMutation, useGetUserProfileQuery } from "@/store/api/userProfileApi"

export default function ProfilePage() {
  const { data: userData, isLoading, error } = useGetUserProfileQuery()
  const currentUser = userData?.data
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState("")
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

  // Log profile data for debugging
  // useEffect(() => {
  //   if (userData) {
  //     console.log("Profile data loaded:", userData)
  //   }
  //   if (error) {
  //     console.error("Profile error details:", error)
  //   }
  // }, [userData, error])

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
      setIsEditingDescription(true)
    }
  }

  // Save description
  const handleSaveDescription = async () => {
    try {
      console.log("Saving description:", description)
      await updateUserProfile({ description }).unwrap()
      setIsEditingDescription(false)
    } catch (error) {
      console.error("Failed to update description:", error)
    }
  }

  // Cancel editing description
  const handleCancelEdit = () => {
    setIsEditingDescription(false)
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
    // console.log("Image failed to load:", currentUser?.profile_picture)
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
                  {/* <h2 className="text-xl text-black font-semibold">{currentUser.email.split("@")[0]}</h2> */}
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
                      <div className="flex text-black items-center gap-3">
                        <Briefcase size={18} className="text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Trade</p>
                          <p className="font-medium">{currentUser.trade || "Not provided"}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-black items-center gap-3">
                          <Building size={18} className="text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Company Name</p>
                            <p className="font-medium">{currentUser.company_name || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex text-black items-center gap-3">
                          <Hash size={18} className="text-gray-500" />
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
                        <Briefcase size={18} className="text-gray-500" />
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
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D49F2E]"
                          rows={4}
                          placeholder="Write something about yourself or your company..."
                        />
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
                            className="px-3 py-1.5 bg-[#D49F2E] text-white rounded-md hover:bg-[#D49F2E] flex items-center gap-1"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : <>Save</>}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-black p-4 rounded-md">
                        {currentUser.description ? (
                          <p>{currentUser.description}</p>
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
