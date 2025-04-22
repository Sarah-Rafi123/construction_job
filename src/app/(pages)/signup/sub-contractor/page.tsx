"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase } from "lucide-react"

// Material UI imports
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
// Create a theme instance with light mode and blue primary color
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

export default function SubContractorSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    services: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Save form data and userType in localStorage for PasswordSetup screen
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        userType: "sub-contractor",
      })
    );
  
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/signup/password");
    }, 1000);
  };
  
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
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 6, mt: 2, ml: 2 }}>
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
              BuildConnect
            </Typography>
          </Box>

          {/* Form content - centered with max width */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "480px", // Narrower content area like in the image
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
                Sub Contractor Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please fill in your details to create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="name" className="text-gray-700">
                      Name
                    </FormLabel>
                    <TextField
                      id="name"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your full name"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="companyName" className="text-gray-700">
                      Company Name
                    </FormLabel>
                    <TextField
                      id="companyName"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.companyName}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your company name"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="email" className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <TextField
                      id="email"
                      type="email"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="example@email.com"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="contactNumber" className="text-gray-700">
                      Contact Number
                    </FormLabel>
                    <TextField
                      id="contactNumber"
                      type="tel"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="+1 (123) 456-7890"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="services" className="text-gray-700">
                      Services Offered
                    </FormLabel>
                    <TextField
                      id="services"
                      placeholder="Please list the services you offer"
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                      fullWidth
                      value={formData.services}
                      onChange={handleChange}
                      className="rounded"
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      mt: 2,
                      py: 1.5,
                      bgcolor: "#D49F2E",
                      "&:hover": {
                        bgcolor: "#C08E20",
                      },
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Continue to Set Password"}
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Link href="/signup" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "text.primary" } }}>
                        Back to selection
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>

        {/* Right side - Image */}
        <Box
          sx={{
            width: "50%",
            display: { xs: "none", md: "block" },
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={ConstructionImage || "/placeholder.svg"}
              alt="Sub contractor at work"
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
