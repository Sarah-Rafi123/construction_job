"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
      main: "#d32f2f",
    },
  },
})
const ErrorMessage = ({ message }: { message: string }) => (
  <Box
    sx={{
      height: "20px",
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
  console.log("Component rendered")

  const router = useRouter()
  console.log("Router instance:", router)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [travelRadius, setTravelRadius] = useState(5) // Default to 5km
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [navigationPath, setNavigationPath] = useState("")

  // Add these refs at the top of the component
  const idDocumentInputRef = useRef<HTMLInputElement>(null)
  const qualificationDocumentInputRef = useRef<HTMLInputElement>(null)

  // Replace the uploadedFiles state with separate states for each document
  const [idDocument, setIdDocument] = useState<UploadedFile | null>(null)
  const [qualificationDocument, setQualificationDocument] = useState<UploadedFile | null>(null)

  const [formData, setFormData] = useState({
    name: "",

    contactNumber: "",
    email: "",
    trade: "",
    idDocument: "",
    qualificationDocument: "",
  })

  // Update the errors state
  const [errors, setErrors] = useState({
    name: "",
   
    contactNumber: "",
    email: "",
    trade: "",
    idDocument: "",
    qualificationDocument: "",
  })

  // Effect for navigation after state update
  useEffect(() => {
    console.log("Navigation effect triggered:", { shouldNavigate, navigationPath })

    if (shouldNavigate && navigationPath) {
      console.log("Attempting to navigate to:", navigationPath)
      try {
        router.push(navigationPath)
        console.log("Router.push called successfully")
      } catch (error) {
        console.error("Error during router.push:", error)
      }
    }
  }, [shouldNavigate, navigationPath, router])

  // Debug effect to log localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("signupData")
      console.log("Current localStorage signupData:", storedData ? JSON.parse(storedData) : "None")
    } catch (error) {
      console.error("Error reading localStorage:", error)
    }
  }, [])

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
    if (id === "contactNumber" && value !== "" && !/^\d*$/.test(value)) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }))
  }

  const handleIdDocumentUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }

    console.log("ID Document uploaded:", newFile)
    setIdDocument(newFile)
    setErrors((prev) => ({
      ...prev,
      idDocument: "",
    }))
  }

  const handleQualificationDocumentUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }

    console.log("Qualification Document uploaded:", newFile)
    setQualificationDocument(newFile)
    setErrors((prev) => ({
      ...prev,
      qualificationDocument: "",
    }))
  }

  const validateForm = () => {
    console.log("Validating form with data:", formData)
    console.log("ID Document:", idDocument)
    console.log("Qualification Document:", qualificationDocument)

    const newErrors = {
      name: "",
  
      contactNumber: "",
      email: "",
      trade: "",
      idDocument: "",
      qualificationDocument: "",
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

    if (!formData.trade.trim()) {
      newErrors.trade = "Trade is required"
      isValid = false
    } else if (!validateTrade(formData.trade)) {
      newErrors.trade = "Trade should only contain letters and spaces"
      isValid = false
    }

    // Validate ID document upload
    if (!idDocument) {
      newErrors.idDocument = "Please upload your ID document"
      isValid = false
    }

    // Validate qualification document upload
    if (!qualificationDocument) {
      newErrors.qualificationDocument = "Please upload your qualification document"
      isValid = false
    }

    console.log("Validation result:", isValid ? "Valid" : "Invalid")
    console.log("Validation errors:", newErrors)

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")

    if (!validateForm()) {
      console.log("Form validation failed")
      return
    }

    console.log("Form validation passed, proceeding with submission")
    setIsSubmitting(true)

    try {
      console.log("Sending API request to check email:", formData.email)

      const response = await fetch("http://localhost:9000/api/v0/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      console.log("API response status:", response.status)
      const data = await response.json()
      console.log("API response data:", data)

      if (data.success) {
        console.log("Email check successful, preparing to navigate")

        const dataToStore = {
          ...formData,
          travelRadius,
          userType: "job-seeker",
          idDocument: idDocument?.name || "",
          qualificationDocument: qualificationDocument?.name || "",
        }

        // Store the actual file objects in sessionStorage or as FormData
        if (idDocument && qualificationDocument) {
          // Create a FormData object to store the files
          const formData = new FormData()

          // Get the actual files from the refs
          const idFile = idDocumentInputRef.current?.files?.[0]
          const qualificationFile = qualificationDocumentInputRef.current?.files?.[0]

          if (idFile && qualificationFile) {
            // Store the files in sessionStorage as base64 strings
            const storeFileAsBase64 = async (file, key) => {
              return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                  const base64String = reader.result
                  sessionStorage.setItem(key, base64String)
                  resolve()
                }
                reader.readAsDataURL(file)
              })
            }

            // Store both files
            await storeFileAsBase64(idFile, "idDocumentFile")
            await storeFileAsBase64(qualificationFile, "qualificationDocumentFile")
            console.log("Files stored in sessionStorage")
          }
        }

        console.log("Storing data in localStorage:", dataToStore)

        try {
          localStorage.setItem("signupData", JSON.stringify(dataToStore))
          console.log("Data successfully stored in localStorage")
        } catch (storageError) {
          console.error("Error storing data in localStorage:", storageError)
        }

        console.log("Attempting navigation with router.push")
        try {
          router.push("/signup/password")
          console.log("Router.push called")
        } catch (routerError) {
          console.error("Error with router.push:", routerError)
        }

        console.log("Setting up fallback navigation")
        setNavigationPath("/signup/password")
        setShouldNavigate(true)

        console.log("Attempting direct navigation with window.location")
        setTimeout(() => {
          console.log("Executing fallback navigation with window.location")
          window.location.href = "/signup/password"
        }, 1000)
      } else {
        console.log("Email already exists or API returned error")
        setErrors((prev) => ({
          ...prev,
          email: data.message || "User with this email already exists",
        }))
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error during API call:", error)
      setErrors((prev) => ({
        ...prev,
        email: "Something went wrong. Please try again.",
      }))
      setIsSubmitting(false)
    }
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
            height: "100vh",
            position: "relative",
            overflow: "hidden", // Prevent outer container from scrolling
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
              justifyContent: "flex-start",
              flex: 1,
              overflowY: "auto", // Only this container should scroll
              height: "calc(100vh - 120px)",
              py: 2,
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
                  <Box sx={{ display: "flex", gap: 2 }}>
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
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <FormLabel htmlFor="trade" className="text-gray-700">
                        Trade (Job) *
                      </FormLabel>
                      <TextField
                        id="trade"
                        select
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        value={formData.trade}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            trade: e.target.value,
                          }))
                        }
                        className="rounded"
                        error={!!errors.trade}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="">Select your trade</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Painter">Painter</option>
                        <option value="Construction Manager">Construction Manager</option>
                        <option value="Project Engineer">Project Engineer</option>
                        <option value="Site Supervisor">Site Supervisor</option>
                        <option value="General Contractor">General Contractor</option>
                        <option value="Construction Laborer">Construction Laborer</option>
                        <option value="Mason">Mason</option>
                        <option value="Roofing Contractor">Roofing Contractor</option>
                        <option value="Heavy Equipment Operator">Heavy Equipment Operator</option>
                        <option value="Steelworker">Steelworker</option>
                        <option value="Welder">Welder</option>
                        <option value="Surveyor">Surveyor</option>
                        <option value="Architect">Architect</option>
                        <option value="Structural Engineer">Structural Engineer</option>
                        <option value="HVAC Technician">HVAC Technician</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Landscape Architect">Landscape Architect</option>
                        <option value="Safety Officer">Safety Officer</option>
                        <option value="Drywaller">Drywaller</option>
                        <option value="Flooring Installer">Flooring Installer</option>
                        <option value="Insulation Worker">Insulation Worker</option>
                        <option value="Demolition Worker">Demolition Worker</option>
                      </TextField>
                      <ErrorMessage message={errors.trade} />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
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

                  {/* Document Upload Section */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Document Upload *
                    </Typography>

                    {/* ID Document Upload */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel className="text-gray-700">ID Document *</FormLabel>
                      <Box sx={{ mb: 1 }}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleIdDocumentUpload(e.target.files)}
                          style={{ display: "none" }}
                          ref={idDocumentInputRef}
                        />
                        <Button
                          variant="outlined"
                          onClick={() => idDocumentInputRef.current?.click()}
                          fullWidth
                          sx={{
                            textTransform: "none",
                            borderColor: errors.idDocument ? "error.main" : undefined,
                          }}
                        >
                          Upload ID Document (PDF, JPG, PNG up to 5MB)
                        </Button>
                      </Box>

                      {/* ID Document preview */}
                      {idDocument && (
                        <Chip
                          label={idDocument.name}
                          onDelete={() => setIdDocument(null)}
                          deleteIcon={<X size={16} />}
                          sx={{ mb: 1, maxWidth: "100%" }}
                        />
                      )}
                      <ErrorMessage message={errors.idDocument} />
                    </Box>

                    {/* Qualification Document Upload */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <FormLabel className="text-gray-700">Qualification Document *</FormLabel>
                      <Box sx={{ mb: 1 }}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleQualificationDocumentUpload(e.target.files)}
                          style={{ display: "none" }}
                          ref={qualificationDocumentInputRef}
                        />
                        <Button
                          variant="outlined"
                          onClick={() => qualificationDocumentInputRef.current?.click()}
                          fullWidth
                          sx={{
                            textTransform: "none",
                            borderColor: errors.qualificationDocument ? "error.main" : undefined,
                          }}
                        >
                          Upload Qualification Document (PDF, JPG, PNG up to 5MB)
                        </Button>
                      </Box>

                      {/* Qualification Document preview */}
                      {qualificationDocument && (
                        <Chip
                          label={qualificationDocument.name}
                          onDelete={() => setQualificationDocument(null)}
                          deleteIcon={<X size={16} />}
                          sx={{ mb: 1, maxWidth: "100%" }}
                        />
                      )}
                      <ErrorMessage message={errors.qualificationDocument} />
                    </Box>
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
                    onClick={() => console.log("Submit button clicked")}
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
