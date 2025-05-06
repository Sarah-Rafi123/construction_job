"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { User, Upload } from "lucide-react"
import { useUpdateUserProfileMutation } from "@/store/api/userProfileApi"

interface ProfileImageUploadProps {
  profilePicture: string | null | undefined
  userId: string
}

export default function ProfileImageUpload({ profilePicture, userId }: ProfileImageUploadProps) {
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0]

        // Create preview URL for immediate feedback
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Create FormData
        const formData = new FormData()
        formData.append("profile_picture", file)

        // Upload the image
        await updateUserProfile(formData).unwrap()
        setUploadError(null)

        // Clean up preview URL
        return () => URL.revokeObjectURL(objectUrl)
      } catch (error) {
        console.error("Failed to upload profile picture:", error)
        setUploadError("Failed to upload image. Please try again.")
        setPreviewUrl(null)
      }
    }
  }

  // Determine which image to show
  const displayImage = previewUrl || profilePicture

  return (
    <div className="relative w-32 h-32 mb-4 group">
      {displayImage ? (
        <>
          <Image
            src={displayImage || "/placeholder.svg"}
            alt="Profile"
            fill
            className="rounded-full object-cover border-4 border-white shadow-md"
            sizes="128px"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileInput}
          >
            <Upload size={24} className="text-white" />
          </div>
        </>
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
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePictureUpload} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {uploadError && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-500">{uploadError}</div>
      )}
    </div>
  )
}
