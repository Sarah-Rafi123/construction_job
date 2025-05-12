"use client"
import { useState } from "react"
import type React from "react"

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
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Briefcase, ArrowLeft, CheckCircle } from "lucide-react"
import { useForgotPasswordMutation } from "@/store/api/passwordResetApi"
import ConstructionImage from "../../../../public/assets/images/ConstructionImage.png"

// Use the same theme as the login page
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

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError("")

    // Validate email
    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      // Call the API
      const response = await forgotPassword({ email }).unwrap()

      // Show success message
      setSuccess(true)
    } catch (err: any) {
      console.error("Forgot password error:", err)
      setError(err.data?.message || "Failed to process your request. Please try again later.")
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
                boxShadow: "none",
                border: "none",
              }}
            >
              {!success ? (
                <>
                  <CardHeader
                    title={
                      <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                        Forgot Password
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                        Enter your email address and we'll send you a link to reset your password
                      </Typography>
                    }
                  />
                  <form onSubmit={handleSubmit}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError("")
                          }}
                          placeholder="Enter your email address"
                          className="rounded"
                          error={!!error}
                        />
                        <ErrorMessage message={error} />
                      </Box>
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
                        {isLoading ? "Sending..." : "Send Reset Link"}
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
              ) : (
                <CardContent sx={{ py: 6, px: 4 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800 mb-2">
                      Check Your Email
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-10">
                      We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow
                      the instructions to reset your password.
                    </Typography>
                    <Link href="/login" style={{ textDecoration: "none", width: "100%" }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ textTransform: "none" }}
                        className="text-[#D49F2E] border-[#D49F2E] hover:border-[#C48E1D]"
                      >
                        Back to Login
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
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
