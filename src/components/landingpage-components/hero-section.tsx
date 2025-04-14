"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, MapPin } from "lucide-react"
import contractorsImage from "../../../public/assets/images/Contractor.png"

interface HeroSectionProps {
  companies: string[]
}

export default function HeroSection({ companies }: HeroSectionProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${searchTerm}&location=${location}`)
  }
  return (
    <section className="py-12 md:py-20 bg-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover more than{" "}
              <span className="text-indigo-600 relative">
                3000+ Jobs
                <span className="absolute bottom-0 left-0 w-full h-2 bg-indigo-600 opacity-30 rounded-md"></span>
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Great platform for contractors, sub-contractors and job seekers to connect and collaborate on construction
              projects.
            </p>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-xl shadow-lg mb-8"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Search my job
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-sm text-gray-500 mr-2">Popular:</span>
              {["Electrician", "Plumber", "Carpenter", "Painter", "HVAC"].map((item, index) => (
                <span key={index} className="text-sm text-gray-500 hover:text-indigo-600 cursor-pointer">
                  {item}
                  {index < 4 && ","}
                </span>
              ))}
            </div>
          </div>
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
            <Image
              src={contractorsImage || "/placeholder.svg"}
              alt="Contractors working together"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover object-center"
              style={{ objectPosition: "center" }}
              quality={90}
            />
          </div>
        </div>
        <div className="mt-16">
          <p className="text-center text-gray-600 mb-6">Companies we've helped grow</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {companies.map((logo, index) => (
              <div key={index} className="opacity-70 hover:opacity-100 transition-opacity">
                <Image src={logo || "/placeholder.svg"} alt={`Company ${index + 1}`} width={120} height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
