import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function SubcontractorsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">For Sub-Contractors</h2>
            <div className="w-64 h-1 bg-[#D49F2E] mb-10"></div>

            <div className="space-y-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 text-[#D49F2E]">
                  <ChevronRight className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Relevant Projects</h3>
                  <p className="text-gray-600">Browse projects that match your skills, location, and availability.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 text-[#D49F2E]">
                  <ChevronRight className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Showcase Your Business</h3>
                  <p className="text-gray-600">
                    Create a detailed profile highlighting your expertise, past projects, and client testimonials.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 text-[#D49F2E]">
                  <ChevronRight className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Your Team</h3>
                  <p className="text-gray-600">
                    Coordinate your workers, track project progress, and maintain client relationships all in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/login"
                className="px-28 py-2 bg-[#D49F2E] text-white font-medium rounded-md inline-block hover:bg-[#C48E1D] transition-colors"
              >
                Find Projects
              </Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 h-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
