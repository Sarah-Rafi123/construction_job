"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase, Upload, X, FileText } from "lucide-react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import Slider from "@mui/material/Slider"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
import { useCheckEmailMutation } from "@/store/api/authApi"
import { useAppDispatch } from "@/store/hooks"
import { setEmail, setUserType } from "@/store/slices/userSlice"
import IconButton from "@mui/material/IconButton"
import SitepalLogo from "../../../../../public/assets/images/SitepalLogo.jpg";
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
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [checkEmail] = useCheckEmailMutation()

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
    if (shouldNavigate && navigationPath) {
      router.push(navigationPath)
    }
  }, [shouldNavigate, navigationPath, router])

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

    setIdDocument(newFile)
    setErrors((prev) => ({
      ...prev,
      idDocument: "",
    }))

    // Store the file in sessionStorage as base64
    const reader = new FileReader()
    reader.onloadend = () => {
      sessionStorage.setItem("idDocumentFile", reader.result as string)
    }
    reader.readAsDataURL(file)
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

    setQualificationDocument(newFile)
    setErrors((prev) => ({
      ...prev,
      qualificationDocument: "",
    }))

    // Store the file in sessionStorage as base64
    const reader = new FileReader()
    reader.onloadend = () => {
      sessionStorage.setItem("qualificationDocumentFile", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeIdDocument = () => {
    if (idDocument) {
      URL.revokeObjectURL(idDocument.url || "")
    }
    setIdDocument(null)
    sessionStorage.removeItem("idDocumentFile")
  }

  const removeQualificationDocument = () => {
    if (qualificationDocument) {
      URL.revokeObjectURL(qualificationDocument.url || "")
    }
    setQualificationDocument(null)
    sessionStorage.removeItem("qualificationDocumentFile")
  }

  const validateForm = () => {
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
    } else if (formData.name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters"
      isValid = false
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    } else if (formData.email.length > 50) {
      newErrors.email = "Email cannot exceed 50 characters"
      isValid = false
    }

    // Validate contact number
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!validatePhoneNumber(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number should only contain digits"
      isValid = false
    } else if (formData.contactNumber.length > 50) {
      newErrors.contactNumber = "Contact number cannot exceed 50 characters"
      isValid = false
    }

    if (!formData.trade.trim()) {
      newErrors.trade = "Trade is required"
      isValid = false
    } else if (!validateTrade(formData.trade)) {
      newErrors.trade = "Trade should only contain letters and spaces"
      isValid = false
    } else if (formData.trade.length > 50) {
      newErrors.trade = "Trade cannot exceed 50 characters"
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

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Check email uniqueness using Redux Toolkit mutation
      const result = await checkEmail({ email: formData.email }).unwrap()

      // If we get here, the email check was successful (email is unique)
      if (result.success) {
        const dataToStore = {
          ...formData,
          travelRadius,
          userType: "job-seeker",
          idDocument: idDocument?.name || "",
          qualificationDocument: qualificationDocument?.name || "",
        }

        // Store data in localStorage
        localStorage.setItem("signupData", JSON.stringify(dataToStore))

        // Update Redux state
        dispatch(setEmail(formData.email))
        dispatch(setUserType("job-seeker"))

        // Navigate to password page
        router.push("/signup/password")
      } else {
        // If the API returns success: false, it means the email already exists
        setErrors((prev) => ({
          ...prev,
          email: result.message || "This email is already registered. Please use a different email.",
        }))
      }
    } catch (error: any) {
      // Handle API errors
      setErrors((prev) => ({
        ...prev,
        email: error.data?.message || "This email is already registered or there was an error checking the email.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }
  const navigateToHome = () => {
    router.push("/")
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 6, mt: 2, ml: 2 }} onClick={navigateToHome}>
            <Image
                           src={SitepalLogo || "/placeholder.svg"}
                           alt="Company Logo"
                           className="ml-2 sm:block hidden h-16"
                           width={180}
                           height={200}
                           priority
                         /> 
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
                maxWidth: "480px",
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
                        Full Name *
                      </FormLabel>
                      <TextField
                        id="name"
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        className="rounded"
                        placeholder="Enter your full name"
                        error={!!errors.name}
                        inputProps={{
                          maxLength: 50,
                        }}
                      />
                      <ErrorMessage message={errors.name} />
                    </Box>

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
                        className="rounded"
                        placeholder="Enter your email address"
                        error={!!errors.email}
                        inputProps={{
                          maxLength: 50,
                        }}
                      />
                      <ErrorMessage message={errors.email} />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
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
                        className="rounded"
                        placeholder="Enter digits only"
                        error={!!errors.contactNumber}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          maxLength: 50,
                        }}
                      />
                      <ErrorMessage message={errors.contactNumber} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <FormLabel htmlFor="trade" className="text-gray-700">
                        Trade *
                      </FormLabel>
                      <TextField
                        id="trade"
                        variant="outlined"
                        size="small"
                        required
                        fullWidth
                        value={formData.trade}
                        onChange={handleChange}
                        className="rounded"
                        placeholder="Enter your trade (e.g., Electrician, Plumber)"
                        error={!!errors.trade}
                        inputProps={{
                          maxLength: 50,
                        }}
                      />
                      <ErrorMessage message={errors.trade} />
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

                  {/* ID Document Upload */}
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                    <FormLabel className="text-gray-700">ID Document *</FormLabel>
                    <input
                      type="file"
                      id="idDocument"
                      ref={idDocumentInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                      onChange={(e) => handleIdDocumentUpload(e.target.files)}
                    />
                    {!idDocument ? (
                      <Button
                        variant="outlined"
                        component="label"
                        htmlFor="idDocument"
                        startIcon={<Upload size={18} />}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderColor: errors.idDocument ? "error.main" : "divider",
                          color: "text.primary",
                          py: 1,
                          "&:hover": {
                            borderColor: "#D49F2E",
                            backgroundColor: "rgba(212, 159, 46, 0.04)",
                          },
                        }}
                      >
                        Upload ID Document
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        }}
                      >
                        <FileText size={20} className="text-gray-500 mr-2" />
                        <Box sx={{ flex: 1, ml: 1 }}>
                          <Typography variant="body2" noWrap>
                            {idDocument.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(idDocument.size)}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={removeIdDocument} sx={{ color: "text.secondary" }}>
                          <X size={18} />
                        </IconButton>
                      </Box>
                    )}
                    <ErrorMessage message={errors.idDocument} />
                  </Box>

                  {/* Qualification Document Upload */}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel className="text-gray-700">Qualification Document *</FormLabel>
                    <input
                      type="file"
                      id="qualificationDocument"
                      ref={qualificationDocumentInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                      onChange={(e) => handleQualificationDocumentUpload(e.target.files)}
                    />
                    {!qualificationDocument ? (
                      <Button
                        variant="outlined"
                        component="label"
                        htmlFor="qualificationDocument"
                        startIcon={<Upload size={18} />}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderColor: errors.qualificationDocument ? "error.main" : "divider",
                          color: "text.primary",
                          py: 1,
                          "&:hover": {
                            borderColor: "#D49F2E",
                            backgroundColor: "rgba(212, 159, 46, 0.04)",
                          },
                        }}
                      >
                        Upload Qualification Document
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        }}
                      >
                        <FileText size={20} className="text-gray-500 mr-2" />
                        <Box sx={{ flex: 1, ml: 1 }}>
                          <Typography variant="body2" noWrap>
                            {qualificationDocument.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(qualificationDocument.size)}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={removeQualificationDocument} sx={{ color: "text.secondary" }}>
                          <X size={18} />
                        </IconButton>
                      </Box>
                    )}
                    <ErrorMessage message={errors.qualificationDocument} />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      color: "white",
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
