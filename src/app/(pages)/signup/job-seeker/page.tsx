"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase, X } from "lucide-react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import Slider from "@mui/material/Slider"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"

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

// Type for uploaded files
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export default function JobSeekerSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [travelRadius, setTravelRadius] = useState(5) // Default to 5km
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    trade: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    trade: "",
    fileUpload: "",
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

  const validateTrade = (trade: string) => {
    const tradeRegex = /^[a-zA-Z\s]+$/
    return tradeRegex.test(trade)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    // Apply specific validation during input
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

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setErrors((prev) => ({
      ...prev,
      fileUpload: "",
    }))
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const validateForm = () => {
    const newErrors = {
      name: "",
      companyName: "",
      contactNumber: "",
      email: "",
      trade: "",
      fileUpload: "",
    }
    let isValid = true

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces"
      isValid = false
    }

    // Validate company name (now required)
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

    // Validate trade
    if (!formData.trade.trim()) {
      newErrors.trade = "Trade is required"
      isValid = false
    } else if (!validateTrade(formData.trade)) {
      newErrors.trade = "Trade should only contain letters and spaces"
      isValid = false
    }

    // Validate file upload
    if (uploadedFiles.length === 0) {
      newErrors.fileUpload = "Please upload at least one document"
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

    // Create file URLs array for storage
    const fileUrls = uploadedFiles.map((file) => file.url || "")

    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        travelRadius,
        userType: "job-seeker",
        documents: fileUrls,
      }),
    )

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
              BuildConnect
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
                Job Seeker Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please fill in your details to create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Name and Company Name in the same row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Name field */}
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <FormLabel htmlFor="name" className="text-gray-700">
                        Name *
                      </FormLabel>
                      <TextField
                        id="name"
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="rounded"
                        error={!!errors.name}
                      />
                      <ErrorMessage message={errors.name} />
                    </Box>
                  </Box>

                  {/* Email and Contact Number in the same row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Email field */}
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                        placeholder="example@email.com"
                        className="rounded"
                        error={!!errors.email}
                      />
                      <ErrorMessage message={errors.email} />
                    </Box>

                    {/* Contact Number field */}
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                        placeholder="Enter digits only"
                        className="rounded"
                        error={!!errors.contactNumber}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      />
                      <ErrorMessage message={errors.contactNumber} />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="trade" className="text-gray-700">
                      Trade (Job) *
                    </FormLabel>
                    <TextField
                      id="trade"
                      placeholder="e.g. Electrician, Plumber, Carpenter"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.trade}
                      onChange={handleChange}
                      className="rounded"
                      error={!!errors.trade}
                    />
                    <ErrorMessage message={errors.trade} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel className="text-gray-700">Upload ID/Qualifications/Profile *</FormLabel>

                    {/* Custom file uploader with preview */}
                    <Box sx={{ mb: 1 }}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => fileInputRef.current?.click()}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderColor: errors.fileUpload ? "error.main" : undefined,
                        }}
                      >
                        Upload documents (PDF, JPG, PNG up to 5MB)
                      </Button>
                    </Box>

                    {/* File preview */}
                    {uploadedFiles.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {uploadedFiles.map((file) => (
                          <Chip
                            key={file.id}
                            label={file.name}
                            onDelete={() => handleRemoveFile(file.id)}
                            deleteIcon={<X size={16} />}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                    )}

                    <ErrorMessage message={errors.fileUpload} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <FormLabel className="text-gray-700">Travel Radius</FormLabel>
                      <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                        {travelRadius} km
                      </Typography>
                    </Box>
                    <Slider
                      value={travelRadius}
                      min={5}
                      max={40}
                      step={5}
                      onChange={(_, value) => setTravelRadius(value as number)}
                      aria-label="Travel Radius"
                      sx={{ color: "#D49F2E" }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary" className="text-gray-500">
                        5 km
                      </Typography>
                      <Typography variant="caption" color="text.secondary" className="text-gray-500">
                        40 km
                      </Typography>
                    </Box>
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
              alt="Construction worker"
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
