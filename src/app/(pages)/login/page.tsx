"use client"
import type React from "react"
import { useState } from "react"
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
import ConstructionImage from "../../../../public/assets/images/ConstructionImage.png"
import { Briefcase } from "lucide-react"
import { useLoginMutation } from "@/store/api/authApi"

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

export default function LoginPage() {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

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
      email: "",
      password: "",
      general: "",
    }
    let isValid = true

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
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
      // Use the RTK Query mutation for login
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap()

      // Log the entire response for debugging
      console.log("Login response:", response)

      // Check if user is an admin - make sure we're accessing the correct property path
      const isAdmin = response.user?.role === "admin"
      console.log("User role:", response.user?.role)
      console.log("Is admin:", isAdmin)

      // Redirect based on role
      if (isAdmin) {
        console.log("Admin user detected, redirecting to admin-home")
        router.push("/admin-home")
      } else {
        console.log("Regular user detected, redirecting to home")
        router.push("/home")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      // Set a general error message
      setErrors((prev) => ({
        ...prev,
        general: err.data?.message || "Login failed. Please check your credentials.",
      }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
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
        {/* Left side - Login Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 4, ml: 4 }}>
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
              Jay Constructions
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: "500px",
                boxShadow: "none", // Remove shadow
                border: "none", // Remove border
              }}
              className=""
            >
              <CardHeader
                title={
                  <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                    Log In
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                    Welcome back! Please log in to your account
                  </Typography>
                }
              />
              <form onSubmit={handleSubmit}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {errors.general && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "error.main", textAlign: "center" }}>
                        {errors.general}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="email" className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <TextField
                      id="email"
                      type="email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="rounded"
                      error={!!errors.email}
                    />
                    <ErrorMessage message={errors.email} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="password" className="text-gray-700">
                      Password
                    </FormLabel>
                    <TextField
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.password}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your password"
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
                  </Box>

                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ textAlign: "right", cursor: "pointer", "&:hover": { textDecoration: "underline" }, mt: 1 }}
                    className="text-[#D49F2E]"
                  >
                    Forgot Password?
                  </Typography>
                </CardContent>

                <CardActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    fullWidth
                    sx={{ textTransform: "none" }}
                    className="bg-[#D49F2E] hover:bg-[#C48E1D] py-2"
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }} className="text-gray-500">
                      Don't have an account?
                    </Typography>
                    <Link href="/signup" style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                        className="text-[#D49F2E]"
                      >
                        Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </CardActions>
              </form>
            </Card>
          </Box>
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
