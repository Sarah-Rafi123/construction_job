import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin } from "lucide-react"
import type { Job } from "@/lib/data/placeholderData"

interface FeaturedJobsSectionProps {
  jobs: Job[]
}

export default function FeaturedJobsSection({ jobs }: FeaturedJobsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured jobs</h2>
          <Link href="/signup" className="flex items-center text-indigo-600 hover:underline font-medium">
            Show all jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 relative flex-shrink-0">
                    <Image src={job.logo || "/placeholder.svg"} alt={job.company} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{job.company}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 truncate">{job.location}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
