"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WorkIcon from "@mui/icons-material/Work"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
  },
})

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Residential Electrician",
    company: "PowerTech Solutions",
    location: "New York, NY",
    type: "Full Time",
    budget: "Negotiable",
    urgent: true,
    tags: ["On-site", "Medical Insurance"],
    posted: "2 hours ago",
    logo: "P",
    services: ["Electrician"],
    radius: 15,
    duration: "30 days",
  },
  {
    id: 2,
    title: "Plumbing Contractor",
    company: "FlowMasters Inc",
    location: "Los Angeles, CA",
    type: "Contract",
    budget: "$5,000 - $8,000",
    urgent: true,
    tags: ["On-site", "Flexible Hours"],
    posted: "5 hours ago",
    logo: "F",
    services: ["Plumber"],
    radius: 25,
    duration: "14 days",
  },
  {
    id: 3,
    title: "Kitchen Renovation",
    company: "HomeReno Experts",
    location: "Chicago, IL",
    type: "Project-based",
    budget: "$12,000 - $15,000",
    urgent: false,
    tags: ["On-site", "Materials Provided"],
    posted: "1 day ago",
    logo: "H",
    services: ["Carpenter", "Plumber", "Electrician"],
    radius: 20,
    duration: "45 days",
  },
  {
    id: 4,
    title: "Commercial Painting",
    company: "ColorPro Services",
    location: "Houston, TX",
    type: "Contract",
    budget: "$7,000 - $10,000",
    urgent: true,
    tags: ["On-site", "Equipment Provided"],
    posted: "3 days ago",
    logo: "C",
    services: ["Painter"],
    radius: 30,
    duration: "21 days",
  },
  {
    id: 5,
    title: "HVAC Installation",
    company: "CoolAir Systems",
    location: "Miami, FL",
    type: "Full Time",
    budget: "Negotiable",
    urgent: false,
    tags: ["On-site", "Medical Insurance", "401k"],
    posted: "6 days ago",
    logo: "C",
    services: ["HVAC Technician"],
    radius: 15,
    duration: "Ongoing",
  },
  {
    id: 6,
    title: "Bathroom Remodeling",
    company: "LuxBath Designs",
    location: "Seattle, WA",
    type: "Project-based",
    budget: "$8,000 - $12,000",
    urgent: true,
    tags: ["On-site", "Flexible Hours"],
    posted: "4 days ago",
    logo: "L",
    services: ["Plumber", "Tile Installer"],
    radius: 10,
    duration: "30 days",
  },
]

// Job type options
const jobTypes = ["All Types", "Full Time", "Contract", "Project-based"]

// Duration options
const durationOptions = ["All Durations", "< 15 days", "15-30 days", "30-60 days", "60+ days", "Ongoing"]

// Service type options
const serviceTypes = [
  "All Services",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "HVAC Technician",
  "Roofer",
  "Mason",
  "Tile Installer",
]

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Job listing state
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [selectedJobType, setSelectedJobType] = useState("All Types")
  const [selectedServiceType, setSelectedServiceType] = useState("All Services")
  const [selectedDuration, setSelectedDuration] = useState("All Durations")
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000])
  const [radiusFilter, setRadiusFilter] = useState<number[]>([0, 50])
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs)
  const [sortBy, setSortBy] = useState("newest")

  // Check if user is logged in and get user type
  useEffect(() => {
    // In a real app, you would check for a token or session
    // For demo purposes, we'll just check localStorage
    const storedUserType = localStorage.getItem("userType")

    if (storedUserType) {
      setUserType(storedUserType)
      setIsLoggedIn(true)
    } else {
      // If no user type is found, redirect to login
      router.push("/login")
    }

    setLoading(false)
  }, [router])

  // Filter jobs based on search and filters
  useEffect(() => {
    let results = sampleJobs

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by job type
    if (selectedJobType !== "All Types") {
      results = results.filter((job) => job.type === selectedJobType)
    }

    // Filter by service type
    if (selectedServiceType !== "All Services") {
      results = results.filter((job) => job.services.includes(selectedServiceType))
    }

    // Filter by duration
    if (selectedDuration !== "All Durations") {
      if (selectedDuration === "< 15 days") {
        results = results.filter((job) => job.duration !== "Ongoing" && Number.parseInt(job.duration) < 15)
      } else if (selectedDuration === "15-30 days") {
        results = results.filter(
          (job) =>
            job.duration !== "Ongoing" && Number.parseInt(job.duration) >= 15 && Number.parseInt(job.duration) <= 30,
        )
      } else if (selectedDuration === "30-60 days") {
        results = results.filter(
          (job) =>
            job.duration !== "Ongoing" && Number.parseInt(job.duration) > 30 && Number.parseInt(job.duration) <= 60,
        )
      } else if (selectedDuration === "60+ days") {
        results = results.filter((job) => job.duration !== "Ongoing" && Number.parseInt(job.duration) > 60)
      } else if (selectedDuration === "Ongoing") {
        results = results.filter((job) => job.duration === "Ongoing")
      }
    }

    // Filter by radius
    results = results.filter((job) => job.radius >= radiusFilter[0] && job.radius <= radiusFilter[1])

    // Sort results
    if (sortBy === "newest") {
      // For demo purposes, we'll use the order in the array as "newest"
      // In a real app, you would sort by date
    } else if (sortBy === "budget-high") {
      results = results.sort((a, b) => {
        if (a.budget === "Negotiable") return 1
        if (b.budget === "Negotiable") return -1

        const aMax = Number.parseInt(a.budget.split(" - ")[1]?.replace(/\D/g, "") || a.budget.replace(/\D/g, ""))
        const bMax = Number.parseInt(b.budget.split(" - ")[1]?.replace(/\D/g, "") || b.budget.replace(/\D/g, ""))

        return bMax - aMax
      })
    } else if (sortBy === "budget-low") {
      results = results.sort((a, b) => {
        if (a.budget === "Negotiable") return 1
        if (b.budget === "Negotiable") return -1

        const aMin = Number.parseInt(a.budget.split(" - ")[0]?.replace(/\D/g, "") || a.budget.replace(/\D/g, ""))
        const bMin = Number.parseInt(b.budget.split(" - ")[0]?.replace(/\D/g, "") || b.budget.replace(/\D/g, ""))

        return aMin - bMin
      })
    }

    setFilteredJobs(results)
  }, [searchTerm, selectedJobType, selectedServiceType, selectedDuration, radiusFilter, sortBy])

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("userType")
    setIsLoggedIn(false)
    router.push("/login")
  }

  const handlePostJob = () => {
    router.push("/post-job")
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h6" color="white">
            Loading...
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  // Determine if approval message should be shown
  const needsApproval = userType === "main-contractor" || userType === "sub-contractor"

  // Check if user is a contractor (main or sub)
  const isContractor = userType === "main-contractor" || userType === "sub-contractor"

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Contractor Platform
            </Typography>
            {isLoggedIn && (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {userType
                    ?.split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: "white" }}>
              Welcome to Your Dashboard
            </Typography>

            {/* Post Job Button - Only visible to contractors */}
            {isContractor && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handlePostJob}
                sx={{ fontWeight: "bold" }}
              >
                Let's Post a Job
              </Button>
            )}
          </Box>

          {needsApproval && (
            <Alert severity="info" sx={{ mb: 4 }}>
              <AlertTitle>Account Pending Approval</AlertTitle>
              Your account is currently under review by our admin team. Some features may be limited until your account
              is approved.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and update your profile information
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {userType === "job-seeker" ? "Job Listings" : "Projects"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userType === "job-seeker"
                      ? "Browse available job opportunities"
                      : "Manage your current and upcoming projects"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Messages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check your messages and notifications
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Job Listings Section */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: "white", mb: 4 }}>
              Find your dream job
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Looking for jobs? Start exploring jobs instantly today!
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    color: "text.secondary",
                    "&.Mui-selected": { color: "#90caf9" },
                  },
                  "& .MuiTabs-indicator": { backgroundColor: "#90caf9" },
                }}
              >
                <Tab label="Explore" />
                <Tab label="Applied" />
                <Tab label="Saved" />
              </Tabs>
            </Box>

            {/* Search Bar */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by job title, company, & skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" color="primary" sx={{ px: 3 }}>
                        <SearchIcon sx={{ mr: 1 }} /> Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Filters */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                      label="Job Type"
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={selectedServiceType}
                      onChange={(e) => setSelectedServiceType(e.target.value)}
                      label="Service Type"
                    >
                      {serviceTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      label="Duration"
                    >
                      {durationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Radius (km)</InputLabel>
                    <Select
                      value={`${radiusFilter[0]}-${radiusFilter[1]}`}
                      onChange={(e) => {
                        const [min, max] = e.target.value.split("-").map(Number)
                        setRadiusFilter([min, max])
                      }}
                      label="Radius (km)"
                    >
                      <MenuItem value="0-50">Any distance</MenuItem>
                      <MenuItem value="0-10">0-10 km</MenuItem>
                      <MenuItem value="10-25">10-25 km</MenuItem>
                      <MenuItem value="25-50">25-50 km</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort by</InputLabel>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort by">
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="budget-high">Budget: High to Low</MenuItem>
                      <MenuItem value="budget-low">Budget: Low to High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Job Listings */}
            <Grid container spacing={3}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Grid sm="auto" item xs="auto" md="auto" key={job.id}>
                <Card sx={{
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    width: {
      xs: "100%", // full width on extra small screens
      sm: 340, // full width on small screens
      md: 340,    // fixed width on medium+
      lg: 360,    // slightly larger on large+
    },
    maxWidth: "100%", // prevents overflow
    mx: "auto" }}>
  {job.urgent && (
    <Chip
      label="Urgently Needed"
      size="small"
      sx={{
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#f44336",
        color: "white",
        fontWeight: "bold",
        fontSize: "0.7rem",
      }}
    />
  )}
  <IconButton sx={{ position: "absolute", top: 8, right: 8 }} size="small">
    <BookmarkBorderIcon />
  </IconButton>

  <CardContent sx={{ pt: 4, flexGrow: 1 }}>
    {/* Header */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>{job.logo}</Avatar>
      <Box>
        <Typography variant="h6">{job.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {job.company}
        </Typography>
      </Box>
    </Box>

    {/* Info */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <LocationOnIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {job.location}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <WorkIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {job.type}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <AttachMoneyIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {job.budget}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
        Duration:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {job.duration}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
        Travel Radius:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {job.radius} km
      </Typography>
    </Box>

    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", mb: 1 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
        Services Required:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {job.services.join(", ")}
      </Typography>
    </Box>

    {/* Tags & Posted Time */}
    <Divider sx={{ my: 1.5 }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {job.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{
              backgroundColor: tag === "On-site" ? "#2e7d32" : "#1976d2",
              color: "white",
              fontSize: "0.7rem",
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        Posted {job.posted}
      </Typography>
    </Box>
  </CardContent>

  {/* Footer Actions */}
  <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, pt: 0 }}>
    <Button
      variant="outlined"
      size="small"
      fullWidth
      onClick={() => router.push(`/apply/${job.id}`)}
      sx={{ mr: 1 }}
    >
      View Details
    </Button>
    <Button
      variant="contained"
      size="small"
      fullWidth
      onClick={() => router.push(`/apply/${job.id}`)}
    >
      Apply
    </Button>
  </Box>
</Card>

                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6">No jobs found</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search filters
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              You've successfully logged in as a{" "}
              {userType
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              .
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
