"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "@/assets/images/ConstructionImage.png"
import SitepalLogo from "@/assets/images/SitepalLogo.jpg"
import { useVerifyEmailMutation } from "@/store/api/authApi"
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#D49F2E",
    },
    success: {
      main: "#22c55e",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#4B5563",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#D49F2E",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#C48E1D",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#000000",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
  const [verifyEmail] = useVerifyEmailMutation()

  useEffect(() => {
    const performVerification = async () => {
      try {
        const email = searchParams.get("email")
        const token = searchParams.get("token")

        if (!email || !token) {
          setVerificationState("error")
          setErrorMessage("Invalid verification link. Missing email or token.")
          return
        }

        const result = await verifyEmail({
          email: decodeURIComponent(email),
          token: decodeURIComponent(token),
        }).unwrap()
        setVerificationState("success")
      } catch (error: any) {
        // console.error("Verification error:", error)
        setVerificationState("error")
        setErrorMessage(error.data?.message || "Email verification failed")
      }
    }

    performVerification()
  }, [searchParams, verifyEmail])

  const handleGoToHome = () => {
    router.push("/login")
  }
  const navigateToHome = () => {
    router.push("/")
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
              p: { xs: 3, sm: 6 },
              position: "relative",
            }}
          >
            {/* Logo - centered on mobile, top-left on desktop */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: "center",
                mb: 6,
                mt: 2,
                width: "100%",
              }}
              onClick={navigateToHome}
            >
              <Image
                src={SitepalLogo || "/placeholder.svg"}
                alt="Company Logo"
                width={150}
                height={200}
                priority
                style={{ cursor: "pointer" }}
              />
            </Box>

            {/* Content - centered */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                width: "100%",
              }}
            >
              <Box sx={{ maxWidth: "450px", width: "100%" }}>
                <Card
                  sx={{
                    width: "100%",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
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
                            Go to Login Page
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
                              href="/login"
                              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300"
                            >
                              Back to Login
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
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: { xs: "none", md: "block" },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={ConstructionImage || "/placeholder.svg?height=1080&width=1920"}
                alt="Construction professionals reviewing plans"
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
