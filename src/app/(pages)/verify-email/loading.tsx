import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h1>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-[#D49F2E] animate-spin mb-4" />
            <p className="text-gray-600">Loading verification page...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
