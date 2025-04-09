"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Alert from "@mui/material/Alert"
import { ThemeProvider, createTheme } from "@mui/material/styles"

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

export default function PasswordSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<any>(null)

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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

    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    // Here you would handle the form submission
    // For example, sending the data to your API

    // Combine user data with password
    const completeUserData = {
      ...userData,
      password: formData.password, // In a real app, you would hash this password
    }

    // For demo purposes, we'll just log the data
    console.log("Complete user data:", completeUserData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Clear the stored data after successful submission
      localStorage.removeItem("signupData")

      // Navigate to success page
      router.push("/signup/success")
    }, 1500)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
        <Card sx={{ width: "100%", maxWidth: "500px" }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Set Your Password
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Create a secure password for your account
              </Typography>
            }
          />
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {userData && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Setting up password for: <strong>{userData.email}</strong>
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Password must be at least 8 characters long
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <TextField
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
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
                {isSubmitting ? "Creating Account..." : "Complete Sign Up"}
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
