import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function JobSeekersSection() {
  return (
    <section className="py-16 bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Job Seekers</h2>
            <p className="text-gray-600 mb-6">
              Discover job opportunities that match your skills and experience. Connect directly with contractors and
              sub-contractors to find your next position.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Find Jobs That Match Your Skills</h3>
                  <p className="text-gray-500">
                    Browse through thousands of job listings filtered by your skills, location, and preferences.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Direct Contact With Employers</h3>
                  <p className="text-gray-500">
                    Chat directly with contractors and sub-contractors to discuss job details and expectations.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Build Your Professional Profile</h3>
                  <p className="text-gray-500">
                    Showcase your skills, experience, and portfolio to stand out to potential employers.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg inline-block hover:bg-indigo-700 transition-colors"
            >
              Find Jobs
            </Link>
          </div>
          <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Job seeker looking at opportunities"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
