import type React from "react"
import { Box, Typography, Skeleton } from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useReverseGeocode } from "@/store/service/geocodingService"

interface LocationDisplayProps {
  coordinates: [number, number] | null
  iconColor?: string
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ coordinates, iconColor = "#D49F2E" }) => {
  const lat = coordinates ? coordinates[1] : null // Second value is latitude
  const lon = coordinates ? coordinates[0] : null // First value is longitude

  const { address, loading, error } = useReverseGeocode(lat, lon)

  if (!coordinates) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnIcon sx={{ mr: 1, color: iconColor }} />
        <Typography color="text.secondary">Location not specified</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnIcon sx={{ mr: 1, color: iconColor }} />
        <Skeleton variant="text" width={200} />
      </Box>
    )
  }

  if (error || !address) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnIcon sx={{ mr: 1, color: iconColor }} />
        <Typography color="text.secondary">{`${coordinates[0]}, ${coordinates[1]}`} (Unable to get address)</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <LocationOnIcon sx={{ mr: 1, color: iconColor, mt: 0.5 }} />
      <Box>
        <Typography color="text.secondary">{address.formatted}</Typography>
        {address.city && address.country && (
          <Typography variant="caption" color="text.secondary">
            {`${address.city}, ${address.country}`}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default LocationDisplay
