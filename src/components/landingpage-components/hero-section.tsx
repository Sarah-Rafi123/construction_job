"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, Users, PlusCircle } from "lucide-react"
import HouseSvg from "@/assets/svg/HouseSVG"
import type { RootState } from "@/store"
import { useGetStatisticsQuery } from "@/store/api/statisticsApi"

interface HeroSectionProps {
  companies?: string[]
}

export default function HeroSection({ companies = [] }: HeroSectionProps) {
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)
  const isAuthenticated = !!currentUser

  // Fetch statistics from API
  const { data: statisticsData, isLoading, error } = useGetStatisticsQuery()

  const handleExploreClick = () => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }

  // Get stats from API response or use fallback values
  const stats = {
    totalJobs: statisticsData?.stats.totalJobs ?? 0,
    newlyPostedJobs: statisticsData?.stats.newlyPostedJobs ?? 0,
    totalCompanies: statisticsData?.stats.totalCompanies ?? 0,
    totalCandidates: statisticsData?.stats.totalCandidates ?? 0,
  }

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Faster. Work Smarter. Connect with the Best in Construction.
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              No more endless searching. Whether you're hiring or ready to work, we connect you with the right people —
              fast.
            </p>
            <button
              className="bg-[#D49F2E] hover:bg-[#C48E1D] cursor-pointer text-white text-lg font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out"
              onClick={handleExploreClick}
            >
              Explore More
            </button>
          </div>
          <div className="flex justify-center">
            <HouseSvg />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Briefcase className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">{isLoading ? "Loading..." : stats.totalJobs}</div>
              <div className="text-gray-400 text-sm">Live Jobs</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Building2 className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">{isLoading ? "Loading..." : stats.totalCompanies}</div>
              <div className="text-gray-400 text-sm">Companies</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Users className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">{isLoading ? "Loading..." : stats.totalCandidates}</div>
              <div className="text-gray-400 text-sm">Candidates</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <PlusCircle className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">{isLoading ? "Loading..." : stats.newlyPostedJobs}</div>
              <div className="text-gray-400 text-sm">New Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}