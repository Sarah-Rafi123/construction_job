"use client"

import { MapPin, X, Loader2 } from "lucide-react"

interface LocationPermissionRequestProps {
  status: "prompt" | "granted" | "denied" | "loading"
  onRequestLocation: () => void
  onDismiss: () => void
}

export default function LocationPermissionRequest({
  status,
  onRequestLocation,
  onDismiss,
}: LocationPermissionRequestProps) {
  return (
    <div className="absolute top-4 left-0 right-0 mx-auto w-[90%] max-w-md z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-[#D49F2E]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Location access</h3>
              <p className="text-sm text-gray-500 mt-1">
                {status === "prompt" && "Allow access to your location to see nearby jobs"}
                {status === "loading" && "Requesting your location..."}
                {status === "granted" && "Location access granted!"}
                {status === "denied" && "Location access denied. You can change this in your browser settings."}
              </p>
            </div>
          </div>
          <button onClick={onDismiss} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {status === "prompt" && (
            <>
              <button onClick={onDismiss} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                Not now
              </button>
              <button
                onClick={onRequestLocation}
                className="px-3 py-1.5 text-sm bg-[#D49F2E] text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Allow access
              </button>
            </>
          )}

          {status === "loading" && (
            <div className="flex items-center gap-2 text-[#D49F2E]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Getting your location...</span>
            </div>
          )}

          {status === "denied" && (
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {status === "granted" && (
        <div className="bg-green-50 px-4 py-2 border-t border-green-100">
          <p className="text-xs text-green-700">Your location is now visible on the map</p>
        </div>
      )}
    </div>
  )
}
