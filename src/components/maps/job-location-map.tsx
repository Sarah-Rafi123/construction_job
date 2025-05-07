"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import MyLocationIcon from "@mui/icons-material/MyLocation"

interface JobLocationMapProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }, address: string) => void
  initialCoordinates?: { lat: number; lng: number } | null
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946, // Default to Bangalore
}

// Load API key from environment
const getGoogleMapsApiKey = async () => {
  try {
    const response = await fetch("/api/environment")
    const data = await response.json()
    return data.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  } catch (error) {
    console.error("Failed to load Google Maps API key:", error)
    return ""
  }
}

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export default function JobLocationMap({ onLocationSelect, initialCoordinates }: JobLocationMapProps) {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(initialCoordinates || null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [isKeyLoading, setIsKeyLoading] = useState(true)

  // Load API key on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      const key = await getGoogleMapsApiKey()
      setApiKey(key)
      setIsKeyLoading(false)
    }

    loadApiKey()
  }, [])

  // Use the useJsApiLoader hook to load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  })

  // Request user's location
  const requestUserLocation = useCallback(() => {
    setIsLocating(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)

          // Set marker at user location
          setMarkerPosition(userPos)

          // If map exists, center it on user location
          if (mapRef.current) {
            mapRef.current.panTo(userPos)
            mapRef.current.setZoom(15)
          }

          // Reverse geocode to get address
          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: userPos }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const address = results[0].formatted_address
                onLocationSelect(userPos, address)
              } else {
                onLocationSelect(userPos, `${userPos.lat}, ${userPos.lng}`)
              }
            })
          } else {
            onLocationSelect(userPos, `${userPos.lat}, ${userPos.lng}`)
          }

          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setIsLocating(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setIsLocating(false)
    }
  }, [onLocationSelect])

  // Handle map click to set marker
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        setMarkerPosition(newPosition)

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: newPosition }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address
            onLocationSelect(newPosition, address)
          } else {
            onLocationSelect(newPosition, `${newPosition.lat}, ${newPosition.lng}`)
          }
        })
      }
    },
    [onLocationSelect],
  )

  // Handle map load
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map)
      mapRef.current = map

      // If initial coordinates exist, center map and set marker
      if (initialCoordinates) {
        map.panTo(initialCoordinates)
        map.setZoom(15)
        setMarkerPosition(initialCoordinates)
      } else if (userLocation) {
        map.panTo(userLocation)
        map.setZoom(15)
      }
    },
    [initialCoordinates, userLocation],
  )

  // Add this useEffect to update the map when initialCoordinates change
  useEffect(() => {
    if (mapRef.current && initialCoordinates) {
      // Smoothly animate to the new position
      mapRef.current.panTo(initialCoordinates)
      mapRef.current.setZoom(15)
      setMarkerPosition(initialCoordinates)
    }
  }, [initialCoordinates])

  if (isKeyLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography variant="body1">Loading API key...</Typography>
      </Box>
    )
  }

  if (loadError) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="body1" color="error" align="center">
          Error loading Google Maps: {loadError.message}
        </Typography>
        <Typography variant="body2" align="center">
          Please check your API key configuration and make sure the Google Maps JavaScript API is enabled in your Google
          Cloud Console.
        </Typography>
      </Box>
    )
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography variant="body1">Loading map...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCoordinates || userLocation || defaultCenter}
        zoom={15}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {/* Selected location marker */}
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={false}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#D49F2E", // Amber color to match theme
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
              scale: 2,
              anchor: new google.maps.Point(12, 22),
            }}
          />
        )}

        {/* User location marker - only visible after getting location */}
        {userLocation && userLocation !== markerPosition && (
          <Marker
            position={userLocation}
            icon={{
              path: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
              fillColor: "#4285F4", // Google blue
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "#FFFFFF",
              scale: 1.5,
              anchor: new google.maps.Point(12, 12),
            }}
            title="Your current location"
            zIndex={1} // Lower zIndex so it appears below the selected marker
          />
        )}
      </GoogleMap>

      {/* My Location button */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <Tooltip title="Use my current location">
          <IconButton
            onClick={requestUserLocation}
            disabled={isLocating}
            sx={{
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            size="large"
          >
            {isLocating ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              <MyLocationIcon color="primary" fontSize="medium" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
