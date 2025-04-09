"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Material UI imports
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import Slider from "@mui/material/Slider"
import { ThemeProvider, createTheme } from "@mui/material/styles"

import { FileUploader } from "@/components/widgets/file-uploader"

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

export default function JobSeekerSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [travelRadius, setTravelRadius] = useState(25)
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    trade: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would handle the form submission
    // For example, sending the data to your API or storing in localStorage

    // Store form data in localStorage to access it in the password page
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        travelRadius,
        userType: "job-seeker",
      }),
    )

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/signup/password")
    }, 1000)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: "800px" }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Job Seeker Sign Up
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Please fill in your details to create your account
              </Typography>
            }
          />
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                  id="name"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="companyName">Company Name (if applicable)</FormLabel>
                <TextField
                  id="companyName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="contactNumber">Contact Number</FormLabel>
                <TextField
                  id="contactNumber"
                  type="tel"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="trade">Trade (Job)</FormLabel>
                <TextField
                  id="trade"
                  placeholder="e.g. Electrician, Plumber, Carpenter"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.trade}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel>Upload ID/Qualifications/Profile</FormLabel>
                <FileUploader
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  label="Upload documents (PDF, JPG, PNG up to 5MB)"
                  multiple
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormLabel>Travel Radius</FormLabel>
                  <Typography variant="body2" fontWeight="medium">
                    {travelRadius} km
                  </Typography>
                </Box>
                <Slider
                  defaultValue={25}
                  max={100}
                  step={5}
                  onChange={(_, value) => setTravelRadius(value as number)}
                  aria-label="Travel Radius"
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    5 km
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    100 km
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                {isSubmitting ? "Submitting..." : "Continue to Set Password"}
              </Button>
              <Link href="/signup" style={{ width: "100%", textAlign: "center", textDecoration: "none" }}>
                <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "text.primary" } }}>
                  Back to selection
                </Typography>
              </Link>
            </CardActions>
          </form>
        </Card>
      </Box>
    </ThemeProvider>
  )
}
