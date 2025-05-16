"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase, Eye, EyeOff } from "lucide-react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Alert from "@mui/material/Alert"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "@/assets/images/ConstructionImage.png"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useRegisterUserMutation } from "@/store/api/authApi"
import { useRegisterJobSeekerMutation } from "@/store/api/jobSeekerApi"
import SitepalLogo from "@/assets/images/SitepalLogo.jpg";
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

export default function PasswordSetup() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userEmail = useAppSelector((state) => state.user.email)
  const userType = useAppSelector((state) => state.user.userType)

  const [registerUser] = useRegisterUserMutation()
  const [registerJobSeeker] = useRegisterJobSeekerMutation()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  })

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedData = localStorage.getItem("signupData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData(parsedData)

      // Check if we have the document files in sessionStorage for job seekers
      if (parsedData.userType === "job-seeker") {
        const idDoc = sessionStorage.getItem("idDocumentFile")
        const qualDoc = sessionStorage.getItem("qualificationDocumentFile")

        if (!idDoc || !qualDoc) {
          setErrors((prev) => ({
            ...prev,
            general: "Both ID document and qualification documents are required.",
          }))
        }
      }
    } else {
      // If no data is found, redirect back to the signup page
      router.push("/signup")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [id]: "",
      general: "",
    }))
  }

  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    }
    let isValid = true
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
      isValid = false
    } else if (formData.password.length > 50) {
      newErrors.password = "Password cannot exceed 50 characters"
      isValid = false
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    } else if (formData.confirmPassword.length > 50) {
      newErrors.confirmPassword = "Password cannot exceed 50 characters"
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
      if (userData.userType === "job-seeker") {
        // Get the stored files from sessionStorage
        const idDocumentBase64 = sessionStorage.getItem("idDocumentFile")
        const qualificationDocumentBase64 = sessionStorage.getItem("qualificationDocumentFile")

        if (!idDocumentBase64 || !qualificationDocumentBase64) {
          throw new Error("Required documents are missing")
        }

        // Create FormData for job seeker registration
        const jobSeekerFormData = new FormData()
        jobSeekerFormData.append("role", "job_seeker")
        jobSeekerFormData.append("email", userData.email)
        jobSeekerFormData.append("password", formData.password)
        jobSeekerFormData.append("phone_number", userData.contactNumber)
        jobSeekerFormData.append("full_name", userData.name)
        jobSeekerFormData.append("trade", userData.trade)
        jobSeekerFormData.append("travel_radius_km", userData.travelRadius.toString())

        // Convert base64 to Blob and append to FormData
        if (idDocumentBase64 && idDocumentBase64.startsWith("data:")) {
          const idDocBlob = await fetch(idDocumentBase64).then((r) => r.blob())
          jobSeekerFormData.append("id_document", idDocBlob, "id_document.png")
        }

        if (qualificationDocumentBase64 && qualificationDocumentBase64.startsWith("data:")) {
          const qualDocBlob = await fetch(qualificationDocumentBase64).then((r) => r.blob())
          jobSeekerFormData.append("qualification_document", qualDocBlob, "qualification_document.png")
        }

        // Use the RTK Query mutation
        await registerJobSeeker({ formData: jobSeekerFormData }).unwrap()
      } else if (userData.userType === "main-contractor") {
        const registerData = {
          role: "main_contractor",
          email: userData.email,
          password: formData.password,
          company_name: userData.companyName,
          company_number: userData.contactNumber,
        }

        await registerUser(registerData).unwrap()
      } else if (userData.userType === "sub-contractor") {
        const registerData = {
          role: "subcontractor",
          email: userData.email,
          password: formData.password,
          company_name: userData.companyName,
          company_number: userData.contactNumber,
          travel_radius_km: userData.travelRadius,
          services_offered: userData.services || [],
        }

        await registerUser(registerData).unwrap()
      } else {
        throw new Error("Invalid user type")
      }

      // Clear stored data
      localStorage.removeItem("signupData")
      sessionStorage.removeItem("idDocumentFile")
      sessionStorage.removeItem("qualificationDocumentFile")

      // Navigate to success page
      router.push("/signup/success")
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.data?.message || "Registration failed. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
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
        {/* Left side - Password Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
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
                Set Your Password
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Create a secure password for your account
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="password" className="text-gray-700">
                      Password *
                    </FormLabel>
                    <TextField
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.password}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your password"
                      error={!!errors.password}
                      inputProps={{
                        maxLength: 50,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage message={errors.password} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="confirmPassword" className="text-gray-700">
                      Confirm Password *
                    </FormLabel>
                    <TextField
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Confirm your password"
                      error={!!errors.confirmPassword}
                      inputProps={{
                        maxLength: 50,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage message={errors.confirmPassword} />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Password must be at least 6 characters long.
                  </Typography>

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
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Link href="/signup" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "text.primary" } }}>
                        Back to signup
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
