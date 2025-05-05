"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import Fade from "@mui/material/Fade"

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  onLocationSelect: (coordinates: { lat: number; lng: number }, address: string) => void
}

interface PlacePrediction {
  description: string
  place_id: string
}

declare global {
  interface Window {
    google: any
  }
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(212, 159, 46, 0.08)",
  },
  "& .MuiListItemIcon-root": {
    minWidth: 36,
  },
}))

export default function LocationSearch({ value, onChange, onLocationSelect }: LocationSearchProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const dummyElementRef = useRef<HTMLDivElement>(null)

  // Initialize Places services when Google Maps API is loaded
  useEffect(() => {
    if (typeof window.google !== "undefined" && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService()

      // Create a dummy element for PlacesService (it requires a DOM element)
      if (dummyElementRef.current) {
        placesService.current = new google.maps.places.PlacesService(dummyElementRef.current)
      }
    }
  }, [])

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (newValue.length > 2 && autocompleteService.current) {
      setIsSearching(true)
      // Debounce search to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        fetchPredictions(newValue)
      }, 300)
    } else {
      setPredictions([])
      setShowPredictions(false)
      setIsSearching(false)
    }
  }

  // Fetch place predictions from Google Places Autocomplete
  const fetchPredictions = (input: string) => {
    if (!autocompleteService.current) return

    autocompleteService.current.getPlacePredictions(
      {
        input,
        types: ["geocode", "establishment", "address"],
        componentRestrictions: { country: "us" }, // Optional: restrict to a country
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results)
          setShowPredictions(results.length > 0)
        } else {
          setPredictions([])
          setShowPredictions(false)
        }
        setIsSearching(false)
      },
    )
  }

  // Handle prediction selection
  const handlePredictionSelect = (prediction: PlacePrediction) => {
    if (!placesService.current) return

    setIsSearching(true)
    onChange(prediction.description) // Update input field immediately with selection

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry", "formatted_address", "name", "address_components"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          const coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
          const address = place.formatted_address || prediction.description

          onChange(address)
          onLocationSelect(coordinates, address)
          setShowPredictions(false)
          setIsSearching(false)
        } else {
          setIsSearching(false)
        }
      },
    )
  }

  return (
    <ClickAwayListener onClickAway={() => setShowPredictions(false)}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <TextField
          fullWidth
          value={value}
          onChange={handleInputChange}
          placeholder="Search for an address or location"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: isSearching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Hidden div for PlacesService */}
        <div ref={dummyElementRef} style={{ display: "none" }}></div>

        {/* Predictions dropdown with fade animation */}
        <Fade in={showPredictions}>
          <Paper
            sx={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto",
              mt: 0.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <List>
              {predictions.map((prediction) => (
                <StyledListItem key={prediction.place_id} onClick={() => handlePredictionSelect(prediction)} dense>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={prediction.description.split(",")[0]}
                    secondary={prediction.description.split(",").slice(1).join(",")}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: "medium",
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: "0.75rem",
                    }}
                  />
                </StyledListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      </Box>
    </ClickAwayListener>
  )
}
