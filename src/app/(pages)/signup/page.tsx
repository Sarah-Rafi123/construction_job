"use client"

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
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormLabel from "@mui/material/FormLabel"
import Divider from "@mui/material/Divider"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../public/assets/images/ConstructionImage.png"
import { Briefcase } from "lucide-react"

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
  },
})

export default function SignupPage() {
  const [userType, setUserType] = useState<string>("")
  const router = useRouter()

  const handleContinue = () => {
    if (userType) {
      router.push(`/signup/${userType}`)
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
        {/* Left side - Signup Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 4, ml: 4 }}  onClick={navigateToHome}>
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
            >
              <CardHeader
                title={
                  <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                    Sign Up
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                    Please select your account type to continue
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <FormLabel
                    htmlFor="user-type"
                    sx={{ display: "block", mb: 1, fontSize: "0.875rem", fontWeight: 500 }}
                    className="text-gray-700"
                  >
                    I want to sign up as a
                  </FormLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      id="user-type"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      displayEmpty
                      className="rounded"
                    >
                      <MenuItem value="" disabled>
                        Select account type
                      </MenuItem>
                      <MenuItem value="main-contractor">Main Contractor</MenuItem>
                      <MenuItem value="sub-contractor">Sub Contractor</MenuItem>
                      <MenuItem value="job-seeker">Job Seeker</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  onClick={handleContinue}
                  disabled={!userType}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: "none", color: "white"  }}
                  className="bg-[#90caf9] text-white hover:bg-[#90caf9]/90 py-2"
                >
                  Continue
                </Button>
              </CardActions>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary" className="text-gray-500">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} className="text-gray-500">
                  Already have an account?
                </Typography>
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: "none" }}
                    className="border-[#90caf9] text-[#90caf9] hover:bg-[#90caf9]/10"
                  >
                    Log In
                  </Button>
                </Link>
              </Box>
            </Card>
          </Box>
        </Box>
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
              src={ConstructionImage || "/placeholder.svg"}
              alt="Construction site"
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
