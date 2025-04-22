"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Briefcase } from "lucide-react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import Slider from "@mui/material/Slider"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { FileUploader } from "@/components/widgets/file-uploader"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"

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

export default function JobSeekerSignup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [travelRadius, setTravelRadius] = useState(25)
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    trade: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Placeholder for file upload URLs — replace with actual values if needed
    const uploadedProfilePictureUrl = "https://example.com/profile.jpg";
    const uploadedIdDocumentUrl = "https://example.com/id.jpg";
  
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        travelRadius,
        userType: "job-seeker",
        profilePicture: uploadedProfilePictureUrl,
        idDocument: uploadedIdDocumentUrl,
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
                Job Seeker Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please fill in your details to create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Name and Company Name in the same row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Name field */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
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
                        placeholder="Enter your full name"
                        className="rounded"
                      />
                    </Box>

                    {/* Company Name field */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                      <FormLabel htmlFor="companyName" className="text-gray-700">
                        Company Name
                      </FormLabel>
                      <TextField
                        id="companyName"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="If applicable"
                        className="rounded"
                      />
                    </Box>
                  </Box>

                  {/* Email and Contact Number in the same row */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Email field */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
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
                        placeholder="example@email.com"
                        className="rounded"
                      />
                    </Box>

                    {/* Contact Number field */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
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
                        placeholder="+1 (123) 456-7890"
                        className="rounded"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="trade" className="text-gray-700">
                      Trade (Job)
                    </FormLabel>
                    <TextField
                      id="trade"
                      placeholder="e.g. Electrician, Plumber, Carpenter"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.trade}
                      onChange={handleChange}
                      className="rounded"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel className="text-gray-700">Upload ID/Qualifications/Profile</FormLabel>
                    <FileUploader
                      accept=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                      label="Upload documents (PDF, JPG, PNG up to 5MB)"
                      multiple
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <FormLabel className="text-gray-700">Travel Radius</FormLabel>
                      <Typography variant="body2" fontWeight="medium" className="text-gray-800">
                        {travelRadius} km
                      </Typography>
                    </Box>
                    <Slider
                      defaultValue={25}
                      max={40}
                      step={5}
                      onChange={(_, value) => setTravelRadius(value as number)}
                      aria-label="Travel Radius"
                      sx={{ color: "#D49F2E" }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary" className="text-gray-500">
                        5 km
                      </Typography>
                      <Typography variant="caption" color="text.secondary" className="text-gray-500">
                        40 km
                      </Typography>
                    </Box>
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
              alt="Construction worker"
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
