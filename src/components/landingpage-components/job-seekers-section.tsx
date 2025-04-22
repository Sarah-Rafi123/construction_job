import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function JobSeekersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Our Platform offers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-black mb-4 relative inline-block">
              Job Seekers
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D49F2E]"></span>
            </h3>

            <div className="space-y-8 mt-8">
              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Find Jobs That Match Your Skills</h4>
                  <p className="text-gray-600 mt-1">
                    Browse through thousands of job listings filtered by your skills, location, and preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Direct Contact With Employers</h4>
                  <p className="text-gray-600 mt-1">
                    Chat directly with contractors and sub-contractors to discuss job details and expectations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Build Your Professional Profile</h4>
                  <p className="text-gray-600 mt-1">
                    Showcase your skills, experience, and portfolio to stand out to potential employers.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="px-32 py-2 bg-[#D49F2E] text-white font-medium rounded-md inline-block hover:bg-[#C48E1D] transition-colors"
              >
                Find Jobs
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 hidden md:block">
          </div>
        </div>
      </div>
    </section>
  )
}
