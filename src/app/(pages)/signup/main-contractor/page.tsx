"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase } from "lucide-react"

// Material UI imports
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"

// Create a theme instance with light mode and blue primary color
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D49F2E",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    error: {
      main: "#d32f2f", // Red color for errors
    },
  },
})

// Custom error message component with fixed height to prevent layout shifts
const ErrorMessage = ({ message }: { message: string }) => (
  <Box
    sx={{
      height: "20px", // Fixed height for error container
      mt: 0.5,
      display: "flex",
      alignItems: "center",
    }}
  >
    {message && (
      <Typography variant="caption" sx={{ color: "error.main", lineHeight: 1 }}>
        {message}
      </Typography>
    )}
  </Box>
)

export default function MainContractorSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    contractorName: "",
    companyName: "",
    contactNumber: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    contractorName: "",
    companyName: "",
    contactNumber: "",
    email: "",
  })

  // Validation functions
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d+$/
    return phoneRegex.test(phone)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    // Apply specific validation during input for contact number
    if (id === "contactNumber" && value !== "" && !/^\d*$/.test(value)) {
      return // Don't update if not a number
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear the specific error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }))
  }

  const validateForm = () => {
    const newErrors = {
      contractorName: "",
      companyName: "",
      contactNumber: "",
      email: "",
    }
    let isValid = true

    // Validate contractor name
    if (!formData.contractorName.trim()) {
      newErrors.contractorName = "Contractor name is required"
      isValid = false
    } else if (!validateName(formData.contractorName)) {
      newErrors.contractorName = "Name should only contain letters and spaces"
      isValid = false
    }

    // Validate company name
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
      isValid = false
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate contact number
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!validatePhoneNumber(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number should only contain digits"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Store form data in localStorage to access it in the password page
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        userType: "main-contractor",
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
          bgcolor: "background.default",
        }}
        className="bg-white"
      >
        {/* Left side - Signup Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 6, mt: 2, ml: 2 }}>
            <Box
              sx={{
                color: "#D49F2E",
                mr: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={24} />
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#333" }}>
              Jay
            </Typography>
          </Box>

          {/* Form content - centered with max width */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "480px", // Narrower content area like in the image
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
                Main Contractor Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please fill in your details to create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="contractorName" className="text-gray-700">
                      Contractor Name *
                    </FormLabel>
                    <TextField
                      id="contractorName"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.contractorName}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your full name"
                      error={!!errors.contractorName}
                    />
                    <ErrorMessage message={errors.contractorName} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="companyName" className="text-gray-700">
                      Company Name *
                    </FormLabel>
                    <TextField
                      id="companyName"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.companyName}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your company name"
                      error={!!errors.companyName}
                    />
                    <ErrorMessage message={errors.companyName} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="email" className="text-gray-700">
                      Email Address *
                    </FormLabel>
                    <TextField
                      id="email"
                      type="email"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="example@email.com"
                      error={!!errors.email}
                    />
                    <ErrorMessage message={errors.email} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="contactNumber" className="text-gray-700">
                      Contact Number *
                    </FormLabel>
                    <TextField
                      id="contactNumber"
                      type="tel"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter digits only"
                      error={!!errors.contactNumber}
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    />
                    <ErrorMessage message={errors.contactNumber} />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      mt: 2,
                      py: 1.5,
                      bgcolor: "#D49F2E",
                      "&:hover": {
                        bgcolor: "#C08E20",
                      },
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Continue to Set Password"}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Link href="/signup" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "text.primary" } }}>
                        Back to selection
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>

        {/* Right side - Image */}
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", md: "block" },
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={ConstructionImage || "/placeholder.svg"}
              alt="Construction site"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
