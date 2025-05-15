"use client"

import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

interface ErrorStateProps {
  handleGoBack: () => void
}

export default function ErrorState({ handleGoBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error loading job</h3>
            <p className="text-gray-600">There was a problem loading the job details. Please try again later.</p>
            <button
              onClick={handleGoBack}
              className="mt-4 inline-block bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to My Jobs
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
