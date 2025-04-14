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
import { ThemeProvider, createTheme } from "@mui/material/styles"

import { FileUploader } from "@/components/widgets/file-uploader"


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
    e.preventDefault()
    setIsSubmitting(true)
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        userType: "sub-contractor",
      }),
    )
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/signup/password")
    }, 1000)
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
        <Card sx={{ width: "100%", maxWidth: "800px" }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold">
                Sub Contractor Sign Up
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                Please fill in your details to create your account
              </Typography>
            }
          />
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                  id="name"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="companyName">Company Name</FormLabel>
                <TextField
                  id="companyName"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="contactNumber">Contact Number</FormLabel>
                <TextField
                  id="contactNumber"
                  type="tel"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel htmlFor="services">Services Offered</FormLabel>
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
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel>Certificate</FormLabel>
                <FileUploader
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  label="Upload Certificate (PDF, JPG, PNG up to 5MB)"
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel>Compliance Cheque</FormLabel>
                <FileUploader
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={5}
                  label="Upload Compliance Cheque (PDF, JPG, PNG up to 5MB)"
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
                {isSubmitting ? "Submitting..." : "Continue to Set Password"}
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
