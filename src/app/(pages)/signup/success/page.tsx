"use client"
import Link from "next/link"
import Image from "next/image"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
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
        {/* Left side - Success Message */}
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
              boxShadow: "none", // Remove shadow
              border: "none", // Remove border
            }}
            className="rounded-lg"
          >
            <CardHeader
              title={
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} className="text-green-500" />
                  <Typography variant="h5" fontWeight="bold" className="text-gray-800">
                    Sign Up Successful!
                  </Typography>
                </Box>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" className="text-gray-500">
                  Your account has been created successfully
                </Typography>
              }
            />
            <CardContent>
              <Typography color="text.secondary" className="text-gray-600">
                Thank you for signing up. Your account is now ready to use.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", p: 2 }}>
              <Link href="/home" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  className="bg-[#90caf9] hover:bg-[#90caf9]/90 py-2 px-6"
                >
                  Go to Home Page
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Box>

        {/* Right side - Image */}
        <Box
          sx={{
            width: "50%",
            bgcolor: "#F5F5FA", // Light background
            display: { xs: "none", md: "block" },
            position: "relative",
            height: "100vh", // Ensure the container takes full height
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={ConstructionImage || "/placeholder.svg?height=1080&width=1920"}
              alt="Construction success"
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
