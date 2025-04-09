"use client"

import type React from "react"
import { useState } from "react"
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
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
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

export default function LoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loginMethod, setLoginMethod] = useState("email")
  const [userType, setUserType] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when user types
    if (error) setError("")
  }

  const handleUserTypeChange = (e: any) => {
    setUserType(e.target.value)
    // Clear error when changing user type
    if (error) setError("")
  }

  const handleLoginMethodChange = (event: React.SyntheticEvent, newValue: string) => {
    setLoginMethod(newValue)
    // Clear error when switching methods
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!userType) {
      setError("Please select your account type")
      return
    }

    if (loginMethod === "email" && !formData.email) {
      setError("Email is required")
      return
    }

    if (loginMethod === "phone" && !formData.phone) {
      setError("Phone number is required")
      return
    }

    if (!formData.password) {
      setError("Password is required")
      return
    }

    setIsSubmitting(true)

    // Here you would handle the login logic
    // For example, sending the data to your API for authentication

    // Store user type in localStorage to use it on the home page
    localStorage.setItem("userType", userType)

    // For demo purposes, we'll just simulate a successful login
    setTimeout(() => {
      setIsSubmitting(false)

      // In a real app, you would check the credentials and handle errors
      // For this demo, we'll just redirect to the home page
      router.push("/home")
    }, 1500)
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
                Log In
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Welcome back! Please log in to your account
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

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="user-type">Account Type</FormLabel>
                <FormControl fullWidth size="small">
                  <Select id="user-type" value={userType} onChange={handleUserTypeChange} displayEmpty>
                    <MenuItem value="" disabled>
                      Select account type
                    </MenuItem>
                    <MenuItem value="main-contractor">Main Contractor</MenuItem>
                    <MenuItem value="sub-contractor">Sub Contractor</MenuItem>
                    <MenuItem value="job-seeker">Job Seeker</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Tabs
                value={loginMethod}
                onChange={handleLoginMethodChange}
                centered
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Email" value="email" />
                <Tab label="Phone" value="phone" />
              </Tabs>

              {loginMethod === "email" ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <TextField
                    id="email"
                    type="email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormLabel htmlFor="phone">Phone Number</FormLabel>
                  <TextField
                    id="phone"
                    type="tel"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  size="small"
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
              </Box>

              <Typography
                variant="body2"
                color="primary"
                sx={{ textAlign: "right", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                Forgot Password?
              </Typography>
            </CardContent>

            <CardActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{ textTransform: "none" }}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Don't have an account?
                </Typography>
                <Link href="/signup" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" color="primary" sx={{ "&:hover": { textDecoration: "underline" } }}>
                    Sign Up
                  </Typography>
                </Link>
              </Box>
            </CardActions>
          </form>
        </Card>
      </Box>
    </ThemeProvider>
  )
}
