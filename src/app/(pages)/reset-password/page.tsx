"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import Alert from "@mui/material/Alert"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { useResetPasswordMutation } from "@/store/api/passwordResetApi"
import ConstructionImage from "@/assets/images/ConstructionImage.png"
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
      mb: 0.5,
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

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  // Get token and email from URL
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  })
  const [success, setSuccess] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)

  // Check if token and email are present
  useEffect(() => {
    if (!token || !email) {
      setInvalidLink(true)
    }
  }, [token, email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear the specific error when user starts typing
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

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
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

    try {
      // Call the API
      const response = await resetPassword({
        email,
        password: formData.password,
        token,
      }).unwrap()

      // Show success message
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      // console.error("Reset password error:", err)
      setErrors((prev) => ({
        ...prev,
        general: err.data?.message || "Failed to reset password. Please try again later.",
      }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
        {/* Left side - Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 4, ml: 4 }} onClick={navigateToHome}>
           <Image
                src={SitepalLogo || "/placeholder.svg"}
                alt="Company Logo"
                className="ml-2 sm:block hidden h-16"
                width={180}
                height={200}
                priority
              />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: "500px",
                boxShadow: "none",
                border: "none",
              }}
            >
              {invalidLink ? (
                <CardContent sx={{ py: 6, px: 4 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <AlertCircle size={60} className="text-red-500 mx-auto mb-4" />
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800 mb-2">
                      Invalid Reset Link
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-6">
                      The password reset link is invalid or has expired. Please request a new password reset link.
                    </Typography>
                    <Link href="/forgot-password" style={{ textDecoration: "none", width: "100%" }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ textTransform: "none" }}
                        className="bg-[#D49F2E] text-white hover:bg-[#C48E1D] py-2"
                      >
                        Request New Link
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              ) : success ? (
                <CardContent sx={{ py: 6, px: 4 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800 mb-2">
                      Password Reset Successful
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-6">
                      Your password has been updated successfully. You will be redirected to the login page in a few
                      seconds.
                    </Typography>
                    <Link href="/login" style={{ textDecoration: "none", width: "100%" }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ textTransform: "none" }}
                        className="text-[#D49F2E] border-[#D49F2E] hover:border-[#C48E1D]"
                      >
                        Go to Login
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              ) : (
                <>
                  <CardHeader
                    title={
                      <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                        Reset Password
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                        Please enter your new password
                      </Typography>
                    }
                  />
                  <form onSubmit={handleSubmit}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {errors.general && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {errors.general}
                        </Alert>
                      )}

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormLabel htmlFor="password" className="text-gray-700">
                          New Password
                        </FormLabel>
                        <TextField
                          id="password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your new password"
                          className="rounded"
                          error={!!errors.password}
                          inputProps={{
                            maxLength: 50,
                          }}
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
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormLabel htmlFor="confirmPassword" className="text-gray-700">
                          Confirm Password
                        </FormLabel>
                        <TextField
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your new password"
                          className="rounded"
                          error={!!errors.confirmPassword}
                          inputProps={{
                            maxLength: 50,
                          }}
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
                        disabled={isLoading}
                        fullWidth
                        sx={{ textTransform: "none" }}
                        className="bg-[#D49F2E] text-white hover:bg-[#C48E1D] py-2"
                      >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                      </Button>
                      <Link href="/login" style={{ textDecoration: "none", width: "100%" }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<ArrowLeft size={16} />}
                          sx={{ textTransform: "none", mt: 1 }}
                          className="text-[#D49F2E] border-[#D49F2E] hover:border-[#C48E1D]"
                        >
                          Back to Login
                        </Button>
                      </Link>
                    </CardActions>
                  </form>
                </>
              )}
            </Card>
          </Box>
        </Box>

        {/* Right side - Image */}
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
              alt="Construction contractor"
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
