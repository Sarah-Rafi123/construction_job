import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function ContractorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 hidden md:block">
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 relative inline-block">
              For Contractors
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D49F2E]"></span>
            </h3>

            <div className="space-y-8 mt-8">
              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Post Jobs Easily</h4>
                  <p className="text-gray-600 mt-1">
                    Create detailed job listings with specific requirements, location, and budget in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Find Qualified Workers</h4>
                  <p className="text-gray-600 mt-1">
                    Browse profiles of verified sub-contractors and skilled workers with the expertise you need.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ChevronRight className="h-5 w-5 text-[#D49F2E] mt-1 flex-shrink-0" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Direct Communication</h4>
                  <p className="text-gray-600 mt-1">
                    Chat instantly with potential hires, share project details, and coordinate work schedules.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="/login"
                className="px-20 py-2 bg-[#D49F2E] text-white font-medium rounded-md inline-block hover:bg-[#C48E1D] transition-colors w-full md:w-auto text-center"
              >
                Start Posting Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
