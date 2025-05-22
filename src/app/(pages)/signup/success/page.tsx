"use client"
import { useState } from "react"
import Image from "next/image"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import { useAppSelector } from "@/store/hooks"
import { useResendVerificationEmailMutation } from "@/store/api/authApi"
import { useRouter } from "next/navigation"
import SitepalLogo from "@/assets/images/SitepalLogo.jpg";
import ConstructionImage from "@/assets/images/ConstructionImage.png"
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
  },
})

export default function SignupSuccess() {
  const [isLoading, setIsLoading] = useState(false)
  const [resendStatus, setResendStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const userEmail = useAppSelector((state) => state.user?.email || "")
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const router = useRouter()

  const handleResendVerificationEmail = async () => {
    if (!userEmail) {
      setResendStatus({
        type: "error",
        message: "Email address not found. Please refresh the page or contact support.",
      })
      return
    }

    setIsLoading(true)
    setResendStatus({ type: null, message: "" })

    try {
      const result = await resendVerificationEmail({ email: userEmail }).unwrap()

      setResendStatus({
        type: "success",
        message: "Verification email has been resent successfully!",
      })
    } catch (error: any) {
      setResendStatus({
        type: "error",
        message: error.data?.message || "Failed to resend verification email. Please try again.",
      })
    } finally {
      setIsLoading(false)
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
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "center",
              mb: 6,
              mt: 2,
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
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center" }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} className="text-green-500" />
                    <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                      Sign Up Successful!
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography sx={{ textAlign: "center" }} color="text.secondary" className="text-gray-600 mb-4">
                  A verification email has been sent to your registered email address <strong>{userEmail}</strong>
                  . Please check your inbox and follow the instructions to activate your account.
                </Typography>
                <Typography color="text.secondary" sx={{ textAlign: "center" }} className="text-gray-600 mb-4">
                  Didn't receive the verification email? You will be able to send another verification email after 30 minutes.
                </Typography>

                {resendStatus.type && (
                  <Alert severity={resendStatus.type} sx={{ mb: 2, textAlign: "left" }}>
                    {resendStatus.message}
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  color="primary"
                  disabled={isLoading}
                  onClick={handleResendVerificationEmail}
                  sx={{
                    textTransform: "none",
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mx: "auto",
                  }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Resend Verification Email"}
                </Button>
              </CardContent>
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