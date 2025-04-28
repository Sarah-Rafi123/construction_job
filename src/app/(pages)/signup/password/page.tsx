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
      setUserData(JSON.parse(storedData))
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
      completeUserData = {
        role: "job_seeker",
        email: userData.email,
        password: formData.password,
        phone_number: userData.contactNumber,
        full_name: userData.name,
        trade: userData.trade,
        travel_radius_km: userData.travelRadius,
        profile_picture: userData.profilePicture || "https://example.com/profile.jpg",
        id_document: userData.idDocument || "https://example.com/id.jpg",
      }
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
      await registerUser(completeUserData).unwrap()
      localStorage.removeItem("signupData")
      dispatch(setEmail(userData.email))
      router.push("/signup/success")
    } catch (err: any) {
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
