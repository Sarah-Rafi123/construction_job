"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../public/assets/images/ConstructionImage.png"

// Create a theme instance with mustard and white colors
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D49F2E", // Mustard color
    },
    success: {
      main: "#22c55e",
    },
    background: {
      default: "#ffffff", // White background
      paper: "#ffffff",
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#4B5563", // Dark gray for secondary text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#D49F2E", // Mustard background for buttons
          color: "#ffffff", // White text for buttons
          "&:hover": {
            backgroundColor: "#C48E1D", // Slightly darker mustard on hover
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff", // White app bar
          color: "#000000", // Black text in app bar
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow
        },
      },
    },
  },
})

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get email and token from URL parameters
        const email = searchParams.get("email")
        const token = searchParams.get("token")

        if (!email || !token) {
          setVerificationState("error")
          setErrorMessage("Invalid verification link. Missing email or token.")
          return
        }

        // Make API request to verify email
        const response = await fetch("http://localhost:9000/api/v0/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: decodeURIComponent(email),
            token: decodeURIComponent(token),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Email verification failed")
        }

        // If successful, set state to success
        setVerificationState("success")
      } catch (error) {
        console.error("Verification error:", error)
        setVerificationState("error")
        setErrorMessage(error instanceof Error ? error.message : "Email verification failed")
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleGoToHome = () => {
    router.push("/home")
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Fixed Header */}
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => router.push("/")} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Email Verification
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Scrollable Content */}
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "auto" }}>
          {/* Left side content */}
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
                maxWidth: "400px",
                textAlign: "center",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              className="rounded-lg"
            >
              <CardContent>
                <div className="text-center">
                  {verificationState === "loading" && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-12 w-12 text-[#D49F2E] animate-spin mb-4" />
                      <p className="text-gray-600">Verifying your email address...</p>
                    </div>
                  )}

                  {verificationState === "success" && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Successful!</h2>
                      <p className="text-gray-600 mb-6">
                        Your email has been successfully verified. You can now proceed to the home page.
                      </p>
                      <button
                        onClick={handleGoToHome}
                        className="flex items-center justify-center bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-medium py-2 px-6 rounded-md transition duration-300"
                      >
                        <Home className="mr-2 h-5 w-5" />
                        Go to Home Page
                      </button>
                    </div>
                  )}

                  {verificationState === "error" && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <XCircle className="h-16 w-16 text-red-500 mb-4" />
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
                      <p className="text-gray-600 mb-6">
                        {errorMessage || "We couldn't verify your email. The link may have expired or is invalid."}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/signup"
                          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
                        >
                          Back to Sign Up
                        </Link>
                        <button
                          onClick={() => window.location.reload()}
                          className="flex items-center justify-center bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-medium py-2 px-6 rounded-md transition duration-300"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Box>

          {/* Right side image */}
          <Box
            sx={{
              width: "50%",
              bgcolor: "#F5F5FA",
              display: { xs: "none", md: "block" },
              position: "relative",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={ConstructionImage || "/placeholder.svg?height=1080&width=1920"}
                alt="Construction image"
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
      </Box>
    </ThemeProvider>
  )
}
