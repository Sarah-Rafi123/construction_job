"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { usePostJobMutation } from "@/store/api/jobPostingApi"
import dynamic from "next/dynamic"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import InputAdornment from "@mui/material/InputAdornment"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Checkbox from "@mui/material/Checkbox"
import Select from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import CircularProgress from "@mui/material/CircularProgress"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import DocumentSubmissionDialog from "@/components/widgets/document-submission-dialog"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

// Import the geocoding service at the top of the file
import { reverseGeocode } from "@/store/service/geocodingService"

// Import the map component with dynamic import to avoid SSR issues
const JobLocationMap = dynamic(() => import("@/components/maps/job-location-map"), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  ),
})

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
}

const serviceTypes = [
  "Construction Laborer",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Mason",
  "Painter",
  "Welder",
  "Roofer",
  "Tiler",
  "Pipe Fitter",
]

const jobTypes = ["Full Time", "Part Time"]

const targetUserTypes = ["Sub Contractors", "Job Seekers"]

export default function PostJob() {
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [durationType, setDurationType] = useState("days")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")

  // Replace coordinates state with separate latitude and longitude
  const [latitude, setLatitude] = useState<string>("12.9716") // Default to Bangalore
  const [longitude, setLongitude] = useState<string>("77.5946") // Default to Bangalore

  const [radius, setRadius] = useState("")
  const [services, setServices] = useState<Service[]>([{ type: "Electrician", count: 1 }])
  const [budgetType, setBudgetType] = useState("fixed")
  const [budget, setBudget] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [targetUsers, setTargetUsers] = useState("Job Seekers")
  const [jobType, setJobType] = useState("Full Time")

  // Check if user is authorized to access this page
  const [userType, setUserType] = useState<string | null>(null)

  // API mutation hook
  const [postJob, { isLoading: isSubmitting }] = usePostJobMutation()

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "info",
  })

  // Add this state
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)

  // Validation state for coordinates
  const [coordErrors, setCoordErrors] = useState({
    latitude: "",
    longitude: "",
  })

  // Add a new state for the address
  const [address, setAddress] = useState("")

  // Handle location selection from the map
  const handleLocationSelect = useCallback(async (lat: string, lng: string) => {
    setLatitude(lat)
    setLongitude(lng)
    // Clear any previous errors
    setCoordErrors({
      latitude: "",
      longitude: "",
    })

    // Get address from coordinates
    try {
      const result = await reverseGeocode(Number.parseFloat(lat), Number.parseFloat(lng))
      setAddress(result.formatted)
    } catch (error) {
      console.error("Error getting address:", error)
    }
  }, [])
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLatitude(value)
    const lat = Number.parseFloat(value)
    if (isNaN(lat)) {
      setCoordErrors((prev) => ({ ...prev, latitude: "Please enter a valid number" }))
    } else if (lat < -90 || lat > 90) {
      setCoordErrors((prev) => ({ ...prev, latitude: "Latitude must be between -90 and 90" }))
    } else {
      setCoordErrors((prev) => ({ ...prev, latitude: "" }))
    }
  }
  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLongitude(value)
    const lng = Number.parseFloat(value)
    if (isNaN(lng)) {
      setCoordErrors((prev) => ({ ...prev, longitude: "Please enter a valid number" }))
    } else if (lng < -180 || lng > 180) {
      setCoordErrors((prev) => ({ ...prev, longitude: "Longitude must be between -180 and 180" }))
    } else {
      setCoordErrors((prev) => ({ ...prev, longitude: "" }))
    }
  }

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
    setServices(updatedServices)
  }

  // Handle service count change
  const handleServiceCountChange = (index: number, value: string) => {
    const updatedServices = [...services]
    updatedServices[index].count = Number.parseInt(value) || 0
    setServices(updatedServices)
  }

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate coordinates
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setNotification({
        open: true,
        message: "Please enter valid coordinates",
        severity: "error",
      })
      return
    }

    // Validate required fields
    if (!title || services.length === 0) {
      setNotification({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      })
      return
    }
    const formattedServices = services.map((service) => {
      const serviceName = service.type
      let numberOfDays = 7
      if (durationType === "days") {
        numberOfDays = Number.parseInt(duration) || 1
      } else if (durationType === "weeks") {
        numberOfDays = (Number.parseInt(duration) || 1) * 7
      } else if (durationType === "months") {
        numberOfDays = (Number.parseInt(duration) || 1) * 30
      }
      if (targetUsers === "Sub Contractors") {
        return {
          service_name: serviceName,
        }
      } else {
        return {
          service_name: serviceName,
          resource_count: service.count || 1,
          number_of_days: numberOfDays,
        }
      }
    })
    const formattedJobType = jobType.toLowerCase().replace(" ", "-")
    let formattedTargetUser = "job_seeker"
    if (targetUsers === "Sub Contractors") {
      formattedTargetUser = "subcontractor"
    } else if (targetUsers === "Job Seekers") {
      formattedTargetUser = "job_seeker"
    }
    const requestBody = {
      job_title: title,
      job_location: {
        coordinates: [lng, lat] as [number, number],
        type: "Point",
      },
      job_type: formattedJobType,
      target_user: formattedTargetUser,
      services: formattedServices,
      job_priority: isUrgent,
      budget: Number(budget) || null,
      description: description || undefined,
    }

    try {
      const result = await postJob(requestBody).unwrap()
      // console.log(result)
      setNotification({
        open: true,
        message: result.message || "Job posted successfully!",
        severity: "success",
      })
      router.push("/home")
    } catch (error: any) {
      // console.error("Error posting job:", error)
      if (error.status === 403 && error.data?.message?.includes("admin approval")) {
        setShowDocumentDialog(true)
      } else {
        setNotification({
          open: true,
          message: error.data?.error || "Failed to post job. Please try again.",
          severity: "error",
        })
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <ThemeProvider theme={theme}>
        <Box
          sx={{ display: "flex", mt: 8, flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}
        >
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
              {notification.message}
            </Alert>
          </Snackbar>
          <Box sx={{ flexGrow: 1, overflow: "auto", py: 4 }}>
            <Container maxWidth="md">
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ mb: 4, color: "text.primary", textAlign: "center" }}
                >
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
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "120px" }}>
                            <FormControlLabel value="days" control={<Radio />} label="Days" />
                          </Box>
                          <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "120px" }}>
                            <FormControlLabel value="weeks" control={<Radio />} label="Weeks" />
                          </Box>
                          <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "120px" }}>
                            <FormControlLabel value="months" control={<Radio />} label="Months" />
                          </Box>
                        </Box>
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

                {/* Location with OpenStreetMap */}
                <Card>
                  <CardHeader title="Project Location" />
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        Select the job location on the map
                      </Typography>
                    </Box>

                    {/* OpenStreetMap Component */}
                    <JobLocationMap
                      key={`map-${latitude}-${longitude}`}
                      initialLatitude={latitude}
                      initialLongitude={longitude}
                      onLocationSelect={handleLocationSelect}
                    />

                    <Box sx={{ mt: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                      <TextField
                        required
                        fullWidth
                        label="Latitude"
                        value={latitude}
                        onChange={handleLatitudeChange}
                        error={!!coordErrors.latitude}
                        helperText={coordErrors.latitude || "Enter a value between -90 and 90"}
                        variant="outlined"
                        type="number"
                        InputProps={{
                          inputProps: {
                            step: "0.000001",
                            min: -90,
                            max: 90,
                          },
                        }}
                      />

                      <TextField
                        required
                        fullWidth
                        label="Longitude"
                        value={longitude}
                        onChange={handleLongitudeChange}
                        error={!!coordErrors.longitude}
                        helperText={coordErrors.longitude || "Enter a value between -180 and 180"}
                        variant="outlined"
                        type="number"
                        InputProps={{
                          inputProps: {
                            step: "0.000001",
                            min: -180,
                            max: 180,
                          },
                        }}
                      />
                    </Box>

                    {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      You can manually adjust the coordinates or use the map to select a location
                    </Typography>

                    <TextField
                      fullWidth
                      label="Location Description (Optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., 123 Main St, City, State, ZIP"
                      variant="outlined"
                      sx={{ mt: 2 }}
                      helperText="Add a description of the location for reference"
                    /> */}
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
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Box>
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
                            </Box>

                            {targetUsers.trim() === "Sub Contractors" ? null : (
                              <Box>
                                <FormLabel required sx={{ display: "block", mb: 1 }}>
                                  Number of {service.type}s Required
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
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
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
                <Box sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "space-between" }}>
                  <Button variant="outlined" onClick={() => router.push("/home")} size="large">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" size="large" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Posting...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
          <DocumentSubmissionDialog open={showDocumentDialog} onClose={() => setShowDocumentDialog(false)} />
        </Box>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  )
}