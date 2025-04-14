import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function ContractorsSection() {
  return (
    <section className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Contractors</h2>
            <p className="text-gray-600 mb-6">
              Post jobs, find qualified sub-contractors and skilled workers for your projects. Streamline your hiring
              process and complete projects on time and within budget.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Post Jobs Easily</h3>
                  <p className="text-gray-500">
                    Create detailed job listings with specific requirements, location, and budget in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Find Qualified Workers</h3>
                  <p className="text-gray-500">
                    Browse profiles of verified sub-contractors and skilled workers with the expertise you need.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Direct Communication</h3>
                  <p className="text-gray-500">
                    Chat instantly with potential hires, share project details, and coordinate work schedules.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg inline-block hover:bg-indigo-700 transition-colors"
            >
              Start Posting Jobs
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Contractor reviewing plans"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
