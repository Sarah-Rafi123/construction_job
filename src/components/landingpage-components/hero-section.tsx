"use client"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, Users, PlusCircle } from "lucide-react"
import HouseSvg from "../../../public/assets/svg/HouseSVG"

interface HeroSectionProps {
  companies?: string[]
}

export default function HeroSection({ companies = [] }: HeroSectionProps) {
  const router = useRouter()

  // Function to handle navigation when "Explore More" is clicked
  const handleExploreClick = () => {
    // Navigate to the desired route - change '/explore' to any route you want
    router.push("/login")
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
              className="bg-[#D49F2E] hover:bg-[#C48E1D] text-white text-lg font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out"
              onClick={handleExploreClick}
            >
              Explore More
            </button>
          </div>

          {/* Right Column: House Blueprint SVG */}
          <div className="flex justify-center">
            <HouseSvg className="w-52 h-52" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Briefcase className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">12900</div>
              <div className="text-gray-400 text-sm">Live Jobs</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Building2 className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">840</div>
              <div className="text-gray-400 text-sm">Companies</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <Users className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">13049</div>
              <div className="text-gray-400 text-sm">Candidates</div>
            </div>
          </div>

          <div className="flex shadow-md bg-white p-4 items-center">
            <div className="bg-[#FFF9EC] p-3 rounded-lg mr-4">
              <PlusCircle className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <div className="text-2xl text-black font-bold">10900</div>
              <div className="text-gray-400 text-sm">New Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
