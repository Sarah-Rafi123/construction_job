import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import subContractorImage from "../../../public/assets/images/Subcontractor.png";
export default function SubcontractorsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden">
          <Image
              src={ subContractorImage || "/placeholder.svg"}
              alt="Contractors working together"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain object-center"
              style={{ objectPosition: "center" }}
              quality={90}
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Sub-Contractors</h2>
            <p className="text-gray-600 mb-6">
              Find projects that match your expertise and grow your business. Connect with contractors and secure a
              steady stream of work opportunities.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Find Relevant Projects</h3>
                  <p className="text-gray-500">Browse projects that match your skills, location, and availability.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Showcase Your Business</h3>
                  <p className="text-gray-500">
                    Create a detailed profile highlighting your expertise, past projects, and client testimonials.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-black">Manage Your Team</h3>
                  <p className="text-gray-500">
                    Coordinate your workers, track project progress, and maintain client relationships all in one place.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg inline-block hover:bg-indigo-700 transition-colors"
            >
              Find Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
