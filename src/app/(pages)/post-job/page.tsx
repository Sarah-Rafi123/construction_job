"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import InputAdornment from "@mui/material/InputAdornment"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Checkbox from "@mui/material/Checkbox"
import Select from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import Paper from "@mui/material/Paper"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SearchIcon from "@mui/icons-material/Search"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import CircularProgress from "@mui/material/CircularProgress"
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D49F2E", 
    },
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#ffffff", 
      paper: "#ffffff",
    },
    text: {
      primary: "#000000", 
      secondary: "#4B5563", 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#D49F2E",
          color: "#ffffff", 
          "&:hover": {
            backgroundColor: "#C48E1D", 
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", 
          color: "#000000", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
      },
    },
  },
})

interface Service {
  type: string
  count: number
  customType?: string
}

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

const serviceTypes = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "HVAC Technician",
  "Mason",
  "Roofer",
  "Landscaper",
  "General Labor",
  "Other",
]

const jobTypes = ["Full Time", "Part Time", "Contract", "Project-based", "Temporary", "Seasonal"]

const targetUserTypes = ["Sub-contractors", "Job Seekers", "Both"]

export default function PostJob() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const markerRef = useRef<any>(null) // Use a ref to track the marker across renders

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [durationType, setDurationType] = useState("days")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState("")
  const [services, setServices] = useState<Service[]>([{ type: "Electrician", count: 1 }])
  const [budgetType, setBudgetType] = useState("fixed")
  const [budget, setBudget] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [targetUsers, setTargetUsers] = useState("Both")
  const [jobType, setJobType] = useState("Full Time")

  // Search state
  const [searchAddress, setSearchAddress] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if user is authorized to access this page
  const [userType, setUserType] = useState<string | null>(null)

  // Initialize OpenStreetMap
  useEffect(() => {
    if (typeof window !== "undefined" && !mapInitialized && mapRef.current) {
      // Load Leaflet CSS
      const linkEl = document.createElement("link")
      linkEl.rel = "stylesheet"
      linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(linkEl)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.onload = initializeMap
      document.body.appendChild(script)

      setMapInitialized(true)
    }

    // Cleanup function to remove marker when component unmounts
    return () => {
      if (markerRef.current && map) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
    }
  }, [mapInitialized, map])

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return

    // Create map
    const newMap = window.L.map(mapRef.current).setView([40.7128, -74.006], 13)

    // Add tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap)

    // Add click handler
    newMap.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      setCoordinates({ lat, lng })

      // Remove existing marker if it exists
      if (markerRef.current) {
        newMap.removeLayer(markerRef.current)
      }

      // Create new marker
      const newMarker = window.L.marker([lat, lng]).addTo(newMap)
      setMarker(newMarker)
      markerRef.current = newMarker // Update the ref

      // Reverse geocode to get address
      reverseGeocode(lat, lng)
    })

    setMap(newMap)
  }

  // Handle search input change with debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchAddress(value)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.length > 2) {
      setIsSearching(true)
      // Debounce search to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        fetchLocationSuggestions(value)
      }, 500)
    } else {
      setLocationSuggestions([])
      setShowSuggestions(false)
      setIsSearching(false)
    }
  }

  // Fetch location suggestions from Nominatim API
  const fetchLocationSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        },
      )
      const data = await response.json()
      setLocationSuggestions(data)
      setShowSuggestions(data.length > 0)
      setIsSearching(false)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      setIsSearching(false)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const latitude = Number.parseFloat(suggestion.lat)
    const longitude = Number.parseFloat(suggestion.lon)

    // Update map view
    if (map) {
      map.setView([latitude, longitude], 16)

      // Remove existing marker if it exists
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Create new marker
      const newMarker = window.L.marker([latitude, longitude]).addTo(map)
      setMarker(newMarker)
      markerRef.current = newMarker // Update the ref
    }

    // Update state
    setCoordinates({ lat: latitude, lng: longitude })
    setLocation(suggestion.display_name)
    setSearchAddress(suggestion.display_name)
    setShowSuggestions(false)
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await response.json()

      if (data && data.display_name) {
        setLocation(data.display_name)
        setSearchAddress(data.display_name)
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
    }
  }

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType")
    setUserType(storedUserType)

    if (storedUserType !== "main-contractor" && storedUserType !== "sub-contractor") {
      router.push("/")
    }
  }, [router])
  const handleAddService = () => {
    setServices([...services, { type: "Electrician", count: 1 }])
  }
  const handleRemoveService = (index: number) => {
    const updatedServices = [...services]
    updatedServices.splice(index, 1)
    setServices(updatedServices)
  }

  // Handle service type change
  const handleServiceTypeChange = (index: number, value: string) => {
    const updatedServices = [...services]
    updatedServices[index].type = value
    if (value !== "Other") {
      delete updatedServices[index].customType
    } else if (!updatedServices[index].customType) {
      updatedServices[index].customType = ""
    }
    setServices(updatedServices)
  }

  // Handle custom service type change
  const handleCustomServiceChange = (index: number, value: string) => {
    const updatedServices = [...services]
    updatedServices[index].customType = value
    setServices(updatedServices)
  }

  // Handle service count change
  const handleServiceCountChange = (index: number, value: string) => {
    const updatedServices = [...services]
    updatedServices[index].count = Number.parseInt(value) || 0
    setServices(updatedServices)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Process services to use customType when type is "Other"
    const processedServices = services.map((service) => {
      if (service.type === "Other" && service.customType) {
        return {
          type: service.customType,
          count: service.count,
        }
      }
      return {
        type: service.type,
        count: service.count,
      }
    })

    // Create job object
    const jobData = {
      title,
      description,
      duration: {
        type: durationType,
        value: duration,
      },
      location,
      coordinates,
      radius,
      services: processedServices,
      budget: {
        type: budgetType,
        value: budgetType === "fixed" ? budget : "Negotiable",
      },
      isUrgent,
      targetUsers,
      jobType,
      postedBy: userType,
      createdAt: new Date().toISOString(),
    }

    // In a real app, you would send this data to your API
    console.log("Job posting data:", jobData)

    // Redirect back to dashboard with success message
    // For demo purposes, we'll just redirect
    router.push("/")
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Fixed Header */}
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => router.push("/")} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Post a New Job
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Scrollable Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto", py: 4 }}>
          <Container maxWidth="md">
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: "text.primary", textAlign: "center" }}>
                Create a New Job Posting
              </Typography>

              {/* Job Title */}
              <Card>
                <CardHeader title="Job Title" />
                <CardContent>
                  <TextField
                    required
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Residential Electrical Wiring Project"
                    variant="outlined"
                  />
                </CardContent>
              </Card>

              {/* Job Type */}
              <Card>
                <CardHeader title="Job Type" />
                <CardContent>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="job-type-label">Select Job Type</InputLabel>
                    <Select
                      labelId="job-type-label"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      label="Select Job Type"
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Target Users */}
              <Card>
                <CardHeader title="Target Users" />
                <CardContent>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="target-users-label">Select Target Users</InputLabel>
                    <Select
                      labelId="target-users-label"
                      value={targetUsers}
                      onChange={(e) => setTargetUsers(e.target.value)}
                      label="Select Target Users"
                    >
                      {targetUserTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Urgently Needed */}
              <Card>
                <CardHeader title="Job Priority" />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} color="primary" />
                    }
                    label={
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: isUrgent ? "bold" : "normal", color: isUrgent ? "#ef4444" : "inherit" }}
                      >
                        Mark as Urgently Needed
                      </Typography>
                    }
                  />
                  {isUrgent && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Marking a job as urgent will highlight it in the job listings and notify potential candidates
                      immediately.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader title="Job Description" />
                <CardContent>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed information about the job requirements, expectations, and any specific skills needed."
                    variant="outlined"
                  />
                </CardContent>
              </Card>

              {/* Duration Type */}
              <Card>
                <CardHeader title="Duration Type" />
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={durationType} onChange={(e) => setDurationType(e.target.value)}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <FormControlLabel value="days" control={<Radio />} label="Days" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <FormControlLabel value="weeks" control={<Radio />} label="Weeks" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <FormControlLabel value="months" control={<Radio />} label="Months" />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <FormControlLabel value="ongoing" control={<Radio />} label="Ongoing" />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Duration Value */}
              {durationType !== "ongoing" && (
                <Card>
                  <CardHeader title={`Duration in ${durationType.charAt(0).toUpperCase() + durationType.slice(1)}`} />
                  <CardContent>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      InputProps={{ inputProps: { min: 1 } }}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Location with Map */}
              <Card>
                <CardHeader title="Project Location" />
                <CardContent>
                  <Box sx={{ mb: 2, position: "relative" }}>
                    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
                      <Box>
                        <TextField
                          fullWidth
                          value={searchAddress}
                          onChange={handleSearchInputChange}
                          placeholder="Search for an address"
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

                        {/* Location suggestions dropdown */}
                        {showSuggestions && (
                          <Paper
                            sx={{
                              position: "absolute",
                              width: "100%",
                              zIndex: 1000,
                              maxHeight: "300px",
                              overflowY: "auto",
                              mt: 0.5,
                            }}
                          >
                            <List>
                              {locationSuggestions.map((suggestion) => (
                                <ListItem
                                  key={suggestion.place_id}
                                  button
                                  onClick={() => handleSuggestionSelect(suggestion)}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "rgba(212, 159, 46, 0.08)",
                                    },
                                  }}
                                >
                                  <ListItemIcon>
                                    <LocationOnIcon color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={suggestion.display_name.split(",")[0]}
                                    secondary={suggestion.display_name.split(",").slice(1).join(",")}
                                    primaryTypographyProps={{ noWrap: true }}
                                    secondaryTypographyProps={{ noWrap: true }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        )}
                      </Box>
                    </ClickAwayListener>
                  </Box>

                  {/* Map Container */}
                  <Paper
                    ref={mapRef}
                    sx={{
                      height: "300px",
                      width: "100%",
                      mb: 2,
                      bgcolor: "background.paper",
                      position: "relative",
                    }}
                  >
                    {!mapInitialized && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body1">Loading map...</Typography>
                      </Box>
                    )}
                  </Paper>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {coordinates
                        ? "Selected location:"
                        : "Click on the map to select a location or search for an address"}
                    </Typography>
                  </Box>

                  <TextField
                    required
                    fullWidth
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., 123 Main St, City, State, ZIP"
                    variant="outlined"
                    helperText="You can manually edit the address or select a location on the map"
                  />
                </CardContent>
              </Card>

              {/* Radius */}
              <Card>
                <CardHeader title="Travel Radius" />
                <CardContent>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    InputProps={{
                      inputProps: { min: 1 },
                      endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                    variant="outlined"
                  />
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader
                  title="Required Services"
                  action={
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddService} size="small">
                      Add Service
                    </Button>
                  }
                />
                <CardContent>
                  {services.map((service, index) => (
                    <Card key={index} sx={{ mb: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                      <CardHeader
                        title={`Service ${index + 1}`}
                        action={
                          services.length > 1 && (
                            <IconButton color="error" onClick={() => handleRemoveService(index)} size="small">
                              <RemoveIcon />
                            </IconButton>
                          )
                        }
                      />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FormLabel required sx={{ display: "block", mb: 1 }}>
                              Service Type
                            </FormLabel>
                            <TextField
                              select
                              required
                              fullWidth
                              value={service.type}
                              onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                              variant="outlined"
                            >
                              {serviceTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          {service.type === "Other" && (
                            <Grid item xs={12}>
                              <FormLabel required sx={{ display: "block", mb: 1 }}>
                                Custom Service Type
                              </FormLabel>
                              <TextField
                                required
                                fullWidth
                                value={service.customType || ""}
                                onChange={(e) => handleCustomServiceChange(index, e.target.value)}
                                placeholder="Enter custom service type"
                                variant="outlined"
                              />
                            </Grid>
                          )}

                          <Grid item xs={12}>
                            <FormLabel required sx={{ display: "block", mb: 1 }}>
                              Number of {service.type === "Other" ? service.customType || "Workers" : service.type + "s"}{" "}
                              Required
                            </FormLabel>
                            <TextField
                              required
                              fullWidth
                              type="number"
                              value={service.count}
                              onChange={(e) => handleServiceCountChange(index, e.target.value)}
                              InputProps={{ inputProps: { min: 1 } }}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Budget Type */}
              <Card>
                <CardHeader title="Budget Type" />
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={budgetType} onChange={(e) => setBudgetType(e.target.value)}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControlLabel value="fixed" control={<Radio />} label="Fixed Amount" />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel value="negotiable" control={<Radio />} label="Negotiable" />
                        </Grid>
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Budget Amount */}
              {budgetType === "fixed" && (
                <Card>
                  <CardHeader title="Budget Amount" />
                  <CardContent>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      InputProps={{
                        inputProps: { min: 1 },
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              )}
              <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={() => router.push("/")} size="large">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" size="large">
                  Post Job
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
declare global {
  interface Window {
    L: any
  }
}
