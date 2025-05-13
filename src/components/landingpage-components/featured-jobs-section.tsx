import type React from "react"
import { MapPin, ArrowRight } from "react-feather";
import Link from "next/link"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
interface Job {
  id: string
  title: string
  company: string
  location: string
  timeAgo: string
  jobType: string
  category: string
}

const FeaturedJobsSection: React.FC = () => {
  const jobs: Job[] = [
    {
      id: "1",
      title: "Technical Support Specialist",
      company: "PowerTech Solution",
      location: "Newyork, NY",
      timeAgo: "2h ago",
      jobType: "Part-Time",
      category: "Electrician",
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "Innovatech Inc.",
      location: "San Francisco, CA",
      timeAgo: "4h ago",
      jobType: "Full-Time",
      category: "Software Development",
    },
    {
      id: "3",
      title: "Data Analyst",
      company: "Data Insights Corp",
      location: "Chicago, IL",
      timeAgo: "6h ago",
      jobType: "Contract",
      category: "Data Science",
    },
    {
      id: "4",
      title: "Project Manager",
      company: "Global Solutions Ltd.",
      location: "London, UK",
      timeAgo: "8h ago",
      jobType: "Full-Time",
      category: "Management",
    },
    {
      id: "5",
      title: "Marketing Specialist",
      company: "BrandBoost Agency",
      location: "Sydney, AU",
      timeAgo: "10h ago",
      jobType: "Part-Time",
      category: "Marketing",
    },
    {
      id: "6",
      title: "Financial Analyst",
      company: "FinanceFirst Group",
      location: "Toronto, CA",
      timeAgo: "12h ago",
      jobType: "Full-Time",
      category: "Finance",
    },
  ]
 const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.user?.currentUser)
  const isAuthenticated = !!currentUser
  const handleExploreClick = () => {
    if (isAuthenticated) {
      router.push("/home")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-screen px-8 mx-auto ">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={handleExploreClick}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">Technical Support Specialist</h3>
                  <div className="text-xs text-gray-500">{index * 2 + 2}h ago</div>
                </div>
                <p className="text-sm text-gray-600 mb-2">PowerTech Solution</p>

                <div className="flex gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Part-Time
                  </span>
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    Electrician
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Newyork, NY</span>
                  </div>
                  <Link role="button" href="#" className="text-sm text-[#F5A623] hover:underline cursor-pointer flex items-center">
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedJobsSection
