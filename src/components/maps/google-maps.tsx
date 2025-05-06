"use client"

import { useEffect, useState, useCallback } from "react"
import { GoogleMap, Marker, Circle, useJsApiLoader, InfoWindow } from "@react-google-maps/api"
import type { Job } from "@/store/api/jobsApi"
import LocationPermissionRequest from "./location-permission-request"

declare module "@/store/api/jobsApi" {
  interface Job {
    job_location?: {
      coordinates: [number, number] // [longitude, latitude]
      type: string
    }
    target_user?: string
    _id: string
    job_title: string
    job_type: string
    services?: Array<{
      service_name: string
      resource_count: number
      no_of_days: number
      _id: string
    }>
    // ... other fields
  }
}

interface GoogleMapComponentProps {
  jobs: Job[]
  userLocation: google.maps.LatLngLiteral | null
  radiusFilter: number
  onUserLocationChange: (location: google.maps.LatLngLiteral | null) => void
}

// Default center for the map (can be adjusted based on user location)
const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
}

export default function GoogleMapComponent({
  jobs,
  userLocation,
  radiusFilter,
  onUserLocationChange,
}: GoogleMapComponentProps) {
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied" | "loading">("prompt")
  const [showPermissionRequest, setShowPermissionRequest] = useState(true)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Use the useJsApiLoader hook to load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  // Function to request user location
  const requestUserLocation = useCallback(() => {
    setPermissionStatus("loading")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          onUserLocationChange(userPos)
          setMapCenter(userPos)
          setPermissionStatus("granted")
          setShowPermissionRequest(false)

          // Center map on user location
          if (map) {
            map.panTo(userPos)
            map.setZoom(13)
          }
        },
        (error) => {
          console.error("Error getting user location:", error)
          setPermissionStatus("denied")
          setTimeout(() => setShowPermissionRequest(false), 3000) // Hide after 3 seconds
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setPermissionStatus("denied")
      setTimeout(() => setShowPermissionRequest(false), 3000) // Hide after 3 seconds
    }
  }, [map, onUserLocationChange])

  // Check for existing permission on component mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          requestUserLocation()
        } else if (result.state === "prompt") {
          setShowPermissionRequest(true)
        } else {
          setPermissionStatus("denied")
          setShowPermissionRequest(false)
        }
      })
    } else {
      // Fallback for browsers that don't support permissions API
      setShowPermissionRequest(true)
    }
  }, [requestUserLocation])

  const getJobCoordinates = (job: Job) => {
    // Check if job has location data in the GeoJSON format
    if (
      job.job_location?.coordinates &&
      Array.isArray(job.job_location.coordinates) &&
      job.job_location.coordinates.length === 2
    ) {
      // GeoJSON format has [longitude, latitude], but Google Maps needs {lat, lng}
      return {
        lat: job.job_location.coordinates[1],
        lng: job.job_location.coordinates[0],
      }
    }

    // Fallback to default center for jobs without location data
    return { ...defaultCenter }
  }

  // Determine marker color based on job type or target user
  const getMarkerColor = (job: Job) => {
    if (job.target_user === "subcontractor") {
      return "#D49F2E" // amber color for subcontractor jobs
    } else if (job.job_type?.toLowerCase() === "full-time") {
      return "#2563EB" // blue for full-time
    } else if (job.job_type?.toLowerCase() === "part-time") {
      return "#10B981" // green for part-time
    } else {
      return "#6366F1" // indigo for other types
    }
  }

  // Only render the map when the Google Maps API is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={11}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
        onLoad={(map) => setMap(map)}
      >
        {jobs.map((job) => {
          const position = getJobCoordinates(job)
          return (
            <Marker
              key={job._id}
              position={position}
              title={job.job_title}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: getMarkerColor(job),
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#FFFFFF",
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(12, 22),
              }}
              onClick={() => {
                setSelectedJob(job)
                if (map) {
                  map.panTo(position)
                }
              }}
            />
          )
        })}

        {selectedJob && (
          <InfoWindow position={getJobCoordinates(selectedJob)} onCloseClick={() => setSelectedJob(null)}>
            <div className="p-2 max-w-[220px]">
              <h3 className="font-semibold text-sm">{selectedJob.job_title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: getMarkerColor(selectedJob) }}
                ></span>
                <p className="text-xs text-gray-600">{selectedJob.job_type}</p>
              </div>
              {selectedJob.services && selectedJob.services.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Services:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedJob.services.slice(0, 3).map((service) => (
                      <span key={service._id} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {service.service_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="mt-2 text-xs bg-amber-500 text-white px-3 py-1 rounded-md font-medium hover:bg-amber-600 transition-colors w-full"
                onClick={() => {
                  // Navigate to job details page
                  window.location.href = `/jobs/${selectedJob._id}`
                }}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                path: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#FFFFFF",
                scale: 1.5,
                anchor: new google.maps.Point(12, 12),
              }}
              zIndex={1000}
              title="Your location"
            />

            {/* Radius circle based on filter */}
            {radiusFilter > 0 && (
              <Circle
                center={userLocation}
                radius={radiusFilter * 1000} // Convert km to meters
                options={{
                  fillColor: "#4285F4",
                  fillOpacity: 0.08,
                  strokeColor: "#4285F4",
                  strokeOpacity: 0.5,
                  strokeWeight: 1,
                }}
              />
            )}
          </>
        )}
      </GoogleMap>

      {/* Location permission request dialog */}
      {showPermissionRequest && (
        <LocationPermissionRequest
          status={permissionStatus}
          onRequestLocation={requestUserLocation}
          onDismiss={() => setShowPermissionRequest(false)}
        />
      )}
    </div>
  )
}
