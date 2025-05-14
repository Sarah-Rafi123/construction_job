"use client"

import { XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h1>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">We encountered an error while trying to verify your email.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Back to Sign Up
              </Link>
              <button
                onClick={() => reset()}
                className="flex items-center justify-center bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
