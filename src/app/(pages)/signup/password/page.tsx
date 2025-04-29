"use client"
import { useRegisterUserMutation } from "@/store/api/authApi"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
import { useDispatch } from "react-redux"
import { setEmail } from "@/store/slices/userSlice"
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

export default function PasswordSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [registerUser] = useRegisterUserMutation()
  const dispatch = useDispatch()
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

      // Check if we have the document files in sessionStorage
      const idDoc = sessionStorage.getItem("idDocumentFile")
      const qualDoc = sessionStorage.getItem("qualificationDocumentFile")

      console.log("Document check on load:", {
        idDocument: idDoc ? "Found" : "Not found",
        qualificationDocument: qualDoc ? "Found" : "Not found",
      })

      // If documents are missing, show an error
      if (!idDoc || !qualDoc) {
        setErrors((prev) => ({
          ...prev,
          general: "Both id document and qualification documents are required.",
        }))
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
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    let completeUserData: any

    if (userData.userType === "job-seeker") {
      // Get the stored files from sessionStorage
      const idDocumentBase64 = sessionStorage.getItem("idDocumentFile")
      const qualificationDocumentBase64 = sessionStorage.getItem("qualificationDocumentFile")

      console.log("Retrieved document files:", {
        idDocument: idDocumentBase64 ? "Found" : "Not found",
        qualificationDocument: qualificationDocumentBase64 ? "Found" : "Not found",
      })

      completeUserData = {
        role: "job_seeker",
        email: userData.email,
        password: formData.password,
        phone_number: userData.contactNumber,
        full_name: userData.name,
        trade: userData.trade,
        travel_radius_km: userData.travelRadius,
        id_document: idDocumentBase64 || "",
        qualification_document: qualificationDocumentBase64 || "",
      }

      // Log the data being sent to the API
      console.log("Sending registration data with documents:", {
        ...completeUserData,
        id_document: completeUserData.id_document ? "Document included" : "Missing",
        qualification_document: completeUserData.qualification_document ? "Document included" : "Missing",
      })
    } else if (userData.userType === "main-contractor") {
      completeUserData = {
        role: "main_contractor",
        email: userData.email,
        password: formData.password,
        company_name: userData.companyName,
        company_number: userData.contactNumber,
      }
    } else if (userData.userType === "sub-contractor") {
      completeUserData = {
        role: "subcontractor",
        email: userData.email,
        password: formData.password,
        company_name: userData.companyName,
        company_number: userData.contactNumber,
        travel_radius_km: userData.travelRadius,
        services_offered: userData.services || [],
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        general: "Invalid user type",
      }))
      setIsSubmitting(false)
      return
    }

    try {
      // If we're using the API that expects multipart/form-data
      if (userData.userType === "job-seeker") {
        const formData = new FormData()

        // Add all the text fields
        formData.append("role", completeUserData.role)
        formData.append("email", completeUserData.email)
        formData.append("password", completeUserData.password)
        formData.append("phone_number", completeUserData.phone_number)
        formData.append("full_name", completeUserData.full_name)
        formData.append("trade", completeUserData.trade)
        formData.append("travel_radius_km", completeUserData.travel_radius_km)

        // Convert base64 back to files if needed
        if (completeUserData.id_document && completeUserData.id_document.startsWith("data:")) {
          const idDocBlob = await fetch(completeUserData.id_document).then((r) => r.blob())
          formData.append("id_document", idDocBlob, "id_document.png")
        }

        if (completeUserData.qualification_document && completeUserData.qualification_document.startsWith("data:")) {
          const qualDocBlob = await fetch(completeUserData.qualification_document).then((r) => r.blob())
          formData.append("qualification_document", qualDocBlob, "qualification_document.png")
        }

        // Make a direct fetch call instead of using the mutation
        const response = await fetch("http://localhost:9000/api/v0/register", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw { data: { message: errorData.message || "Registration failed" } }
        }

        // Success handling
        localStorage.removeItem("signupData")
        sessionStorage.removeItem("idDocumentFile")
        sessionStorage.removeItem("qualificationDocumentFile")
        dispatch(setEmail(userData.email))
        router.push("/signup/success")
      } else {
        // For other user types, use the existing mutation
        await registerUser(completeUserData).unwrap()
        localStorage.removeItem("signupData")
        dispatch(setEmail(userData.email))
        router.push("/signup/success")
      }
    } catch (err: any) {
      console.error("Registration error:", err)
      setErrors((prev) => ({
        ...prev,
        general: err?.data?.message || "Registration failed",
      }))
    } finally {
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
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 4 },
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: "500px",
              boxShadow: "none",
              border: "none",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                  Set Your Password
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                  Create a secure password for your account
                </Typography>
              }
            />
            <form onSubmit={handleSubmit}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* General error message */}
                {errors.general && (
                  <Box
                    sx={{
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      borderRadius: 1,
                      p: 1.5,
                      color: "error.main",
                    }}
                  >
                    <Typography variant="body2">{errors.general}</Typography>
                  </Box>
                )}
                {userData && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" className="text-gray-600">
                      Setting up password for: <strong className="text-gray-800">{userData.email}</strong>
                    </Typography>
                  </Box>
                )}
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
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded"
                    error={!!errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage message={errors.password} />
                  <Typography variant="caption" color="text.secondary" className="text-gray-500">
                    Password must be at least 6 characters long
                  </Typography>
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
                    placeholder="Enter your Password"
                    className="rounded"
                    error={!!errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessage message={errors.confirmPassword} />
                </Box>
              </CardContent>

              <CardActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    bgcolor: "#D49F2E",
                    "&:hover": {
                      bgcolor: "#C08E20",
                    },
                  }}
                  className="py-2"
                >
                  {isSubmitting ? "Creating Account..." : "Complete Sign Up"}
                </Button>
                <Link href="/signup" style={{ width: "100%", textAlign: "center", textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ "&:hover": { color: "text.primary" } }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Back to selection
                  </Typography>
                </Link>
              </CardActions>
            </form>
          </Card>
        </Box>
        <Box
          sx={{
            width: "50%",
            bgcolor: "#F5F5FA",
            display: { xs: "none", md: "block" },
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={ConstructionImage || "/placeholder.svg"}
              alt="Construction security"
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
