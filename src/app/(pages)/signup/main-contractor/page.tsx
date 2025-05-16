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
import { ThemeProvider, createTheme } from "@mui/material/styles"
import ConstructionImage from "../../../../../public/assets/images/ConstructionImage.png"
import { useCheckEmailMutation } from "@/store/api/authApi"
import { useAppDispatch } from "@/store/hooks"
import { setEmail, setUserType } from "@/store/slices/userSlice"
import SitepalLogo from "../../../../../public/assets/images/SitepalLogo.jpg";
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
export default function MainContractorSignup() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [checkEmail] = useCheckEmailMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    contractorName: "",
    companyName: "",
    contactNumber: "",
    email: "",
  })
  const [errors, setErrors] = useState({
    contractorName: "",
    companyName: "",
    contactNumber: "",
    email: "",
  })
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/
    return nameRegex.test(name)
  }
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+\d{1,3}\s?)?($$\d{1,4}$$\s?)?(\d{1,4}[-\s]?){1,3}\d{1,4}$/
    return phoneRegex.test(phone)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    if (id === "contactNumber" && value !== "") {
      if (!/^[0-9()\-+\s]*$/.test(value)) {
        return 
      }
    }
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }))
  }
  const validateForm = () => {
    const newErrors = {
      contractorName: "",
      companyName: "",
      contactNumber: "",
      email: "",
    }
    let isValid = true
    if (!formData.contractorName.trim()) {
      newErrors.contractorName = "Contractor name is required"
      isValid = false
    } else if (!validateName(formData.contractorName)) {
      newErrors.contractorName = "Name should only contain letters and spaces"
      isValid = false
    }

    if (formData.contractorName.length > 50) {
      newErrors.contractorName = "Contractor name cannot exceed 50 characters"
      isValid = false
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
      isValid = false
    }
    if (formData.companyName.length > 50) {
      newErrors.companyName = "Company name cannot exceed 50 characters"
      isValid = false
    }
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (formData.email.length > 50) {
      newErrors.email = "Email address cannot exceed 50 characters"
      isValid = false
    }
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required"
      isValid = false
    } else if (!validatePhoneNumber(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number format (e.g., +1 (123) 456-7890 or 123-456-7890)"
      isValid = false
    }
    if (formData.contactNumber.length > 50) {
      newErrors.contactNumber = "Contact number cannot exceed 50 characters"
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)
    try {
      const result = await checkEmail({ email: formData.email }).unwrap()
      if (result.success) {
        localStorage.setItem(
          "signupData",
          JSON.stringify({
            ...formData,
            userType: "main-contractor",
          }),
        )
        dispatch(setEmail(formData.email))
        dispatch(setUserType("main-contractor"))
        router.push("/signup/password")
      } else {
        setErrors((prev) => ({
          ...prev,
          email: result.message || "This email is already registered. Please use a different email.",
        }))
      }
    } catch (error: any) {
      console.error("Error checking email:", error)
      setErrors((prev) => ({
        ...prev,
        email: error.data?.message || "Something went wrong. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
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
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 6, mt: 2, ml: 2 }} onClick={navigateToHome}>
              <Image
                src={SitepalLogo || "/placeholder.svg"}
                alt="Company Logo"
                className="ml-2 sm:block hidden h-16"
                width={180}
                height={200}
                priority
              />
          </Box>
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
                maxWidth: "480px", 
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
                Main Contractor Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please fill in your details to create your account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="contractorName" className="text-gray-700">
                      Contractor Name *
                    </FormLabel>
                    <TextField
                      id="contractorName"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      value={formData.contractorName}
                      onChange={handleChange}
                      className="rounded"
                      placeholder="Enter your full name"
                      error={!!errors.contractorName}
                      inputProps={{
                        maxLength: 50,
                      }}
                    />
                    <ErrorMessage message={errors.contractorName} />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="companyName" className="text-gray-700">
                      Company Name *
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
                      error={!!errors.companyName}
                      inputProps={{
                        maxLength: 50,
                      }}
                    />
                    <ErrorMessage message={errors.companyName} />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="email" className="text-gray-700">
                      Email Address *
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
                      error={!!errors.email}
                      inputProps={{
                        maxLength: 50,
                      }}
                    />
                    <ErrorMessage message={errors.email} />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel htmlFor="contactNumber" className="text-gray-700">
                      Contact Number *
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
                      placeholder="e.g., +1 (123) 456-7890"
                      error={!!errors.contactNumber}
                      inputProps={{
                        inputMode: "tel",
                        placeholder: "e.g., +1 (123) 456-7890",
                        maxLength: 50,
                      }}
                    />
                    <ErrorMessage message={errors.contactNumber} />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      color: "white",
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
