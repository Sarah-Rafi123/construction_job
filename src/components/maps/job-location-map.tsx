"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import SearchIcon from "@mui/icons-material/Search"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import { reverseGeocode } from "@/store/service/geocodingService"

const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

interface LocationPickerProps {
  initialLatitude: string
  initialLongitude: string
  onLocationSelect: (lat: string, lng: string) => void
}

interface MarkerPositionProps {
  position: [number, number]
  onPositionChange: (lat: number, lng: number) => void
}

// Component to handle map clicks and marker dragging
function DraggableMarker({ position, onPositionChange }: MarkerPositionProps) {
  const markerRef = useRef<L.Marker>(null)

  // Handle map clicks to move marker
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng)
    },
  })

  // Handle marker drag events
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker) {
        const position = marker.getLatLng()
        onPositionChange(position.lat, position.lng)
      }
    },
  }

  return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
}

export default function JobLocationMap({ initialLatitude, initialLongitude, onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([
    Number.parseFloat(initialLatitude) || 12.9716,
    Number.parseFloat(initialLongitude) || 77.5946,
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchError, setSearchError] = useState("")
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<L.Map>(null)

  // Add states for address and loading
  const [address, setAddress] = useState("")
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  // Fix Leaflet icon issue on component mount
  useEffect(() => {
    fixLeafletIcon()
    setMapLoaded(true)
  }, [])

  // Update parent component when position changes
  useEffect(() => {
    onLocationSelect(position[0].toFixed(6), position[1].toFixed(6))
  }, [position, onLocationSelect])

  // Get address on initial load
  useEffect(() => {
    const getInitialAddress = async () => {
      setIsLoadingAddress(true)
      try {
        const result = await reverseGeocode(position[0], position[1])
        setAddress(result.formatted)
        setSearchQuery(result.formatted)
      } catch (error) {
        console.error("Error getting initial address:", error)
      } finally {
        setIsLoadingAddress(false)
      }
    }

    if (mapLoaded) {
      getInitialAddress()
    }
  }, [mapLoaded, position[0], position[1]])

  // Handle marker position changes
  const handlePositionChange = async (lat: number, lng: number) => {
    setPosition([lat, lng])

    // Get address from coordinates
    setIsLoadingAddress(true)
    try {
      const result = await reverseGeocode(lat, lng)
      setAddress(result.formatted)
      setSearchQuery(result.formatted)
    } catch (error) {
      console.error("Error getting address:", error)
    } finally {
      setIsLoadingAddress(false)
    }
  }

  // Get user's current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handlePositionChange(latitude, longitude)
          mapRef.current?.setView([latitude, longitude], 13)
        },
        (error) => {
          // console.error("Error getting location:", error)
          setSearchError("Unable to get your current location. Please try again or select manually.")
          setTimeout(() => setSearchError(""), 5000)
        },
      )
    } else {
      setSearchError("Geolocation is not supported by your browser")
      setTimeout(() => setSearchError(""), 5000)
    }
  }

  // Search for a location using Nominatim API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearchError("")
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const latitude = Number.parseFloat(lat)
        const longitude = Number.parseFloat(lon)
        setPosition([latitude, longitude])
        mapRef.current?.setView([latitude, longitude], 13)

        // Get address for the searched location
        setIsLoadingAddress(true)
        try {
          const result = await reverseGeocode(latitude, longitude)
          setAddress(result.formatted)
          setSearchQuery(result.formatted)
        } catch (error) {
          console.error("Error getting address:", error)
        } finally {
          setIsLoadingAddress(false)
        }
      } else {
        setSearchError("Location not found. Please try a different search term.")
        setTimeout(() => setSearchError(""), 5000)
      }
    } catch (error) {
      // console.error("Error searching location:", error)
      setSearchError("Error searching for location. Please try again.")
      setTimeout(() => setSearchError(""), 5000)
    }
  }

  // Handle search input keypress
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  if (!mapLoaded) {
    return (
      <Box sx={{ height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography>Loading map...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder={isLoadingAddress ? "Loading address..." : "Search for a location..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isLoadingAddress ? <CircularProgress size={20} /> : <SearchIcon />}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end" disabled={isLoadingAddress}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {searchError}
        </Alert>
      )}

      <Box
        sx={{
          height: 400,
          width: "100%",
          position: "relative",
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
<MapContainer
  center={position}
  zoom={13}
  style={{ height: "100%", width: "100%" }}
  ref={(map) => {
    if (map) {
      mapRef.current = map
    }
  }}
>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} onPositionChange={handlePositionChange} />
        </MapContainer>

        <Button
          variant="contained"
          onClick={handleGetCurrentLocation}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: "white",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          My Location
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
        Click on the map to set location or drag the marker. Current coordinates: {position[0].toFixed(6)},{" "}
        {position[1].toFixed(6)}
      </Typography>
    </Box>
  )
}
