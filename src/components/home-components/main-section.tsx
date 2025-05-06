"use client"

import Image from "next/image"
import Home from "../../../public/assets/images/Home.png"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useGetUserProfileQuery } from "@/store/api/userProfileApi"

interface MainSectionProps {
  userType: string | null
}

export default function MainSection({ userType }: MainSectionProps) {
  const router = useRouter()
  const { data: userData } = useGetUserProfileQuery()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // First priority: Use the role directly from API if available
    if (userData?.data?.role) {
      // Convert from underscore to hyphen format if needed
      const apiRole = userData.data.role.replace("_", "-")
      setUserRole(apiRole)
    }
    // Fallback to the userType prop from Redux
    else if (userType) {
      setUserRole(userType)
    }
  }, [userData, userType])

  // Check if user is a contractor (either main or sub)
  const isContractor =
    userRole === "main-contractor" ||
    userRole === "sub-contractor" ||
    userRole === "main_contractor" ||
    userRole === "sub_contractor"

  const handlePostJob = () => {
    router.push("/post-job")
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={Home || "/placeholder.svg"}
          alt="Construction blueprints background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {!isContractor ? (
        <>
          {/* Tabs at the top - For job seekers */}
          <div className="relative z-10 w-full pt-6 md:pt-10 px-4">
            <div className="flex flex-col gap-x-20 md:flex-row justify-center items-center gap-4">
              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-md text-sm md:text-base">
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚙️</span>
                  Leading Construction Recruitment Platform
                </span>
              </div>

              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-md text-sm md:text-base">
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-2">🔰</span>
                  Trusted by Top Contractors & Builders
                </span>
              </div>

              <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-md text-sm md:text-base">
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-2">🛠️</span>
                  Skilled Workers, Real Projects, Faster Connections
                </span>
              </div>
            </div>
          </div>

          {/* Main content centered - For job seekers */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Find the Right Job, Built Around You</h1>
            <p className="text-white text-base md:text-xl max-w-3xl">
              We match you with real opportunities in construction — based on your skills, availability, and goals. No
              fluff. Just work that works for you.
            </p>
          </div>
        </>
      ) : (
        /* Content for contractors */
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Post Jobs. Build Crews. Win More Projects.</h1>
          <p className="text-white text-base md:text-xl max-w-3xl mb-8">
            Whether you're a contractor or subcontractor, we help you post jobs fast, connect with skilled labor, and
            keep your project on track.
          </p>
          <button
            onClick={handlePostJob}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-3 rounded-md transition-colors"
          >
            Post A Job
          </button>
        </div>
      )}
    </div>
  )
}
