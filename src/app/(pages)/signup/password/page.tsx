"use client"
import { useRegisterUserMutation } from "@/store/api/authApi";
import type React from "react"
import { useState, useEffect } from "react"
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
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Alert from "@mui/material/Alert"
import { ThemeProvider, createTheme } from "@mui/material/styles"
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

export default function PasswordSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [registerUser] = useRegisterUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    setIsSubmitting(true);
  
    let completeUserData: any;
  
    if (userData.userType === "job-seeker") {
      completeUserData = {
        role: "job_seeker",
        email: userData.email,
        password: formData.password,
        phone_number: userData.contactNumber,
        full_name: userData.name,
        trade: userData.trade,
        travel_radius_km: userData.travelRadius,
        profile_picture: userData.profilePicture || "https://example.com/profile.jpg",
        id_document: userData.idDocument || "https://example.com/id.jpg",
      };
    } else if (userData.userType === "main-contractor") {
      completeUserData = {
        role: "main_contractor",
        email: userData.email,
        password: formData.password,
        company_name: userData.companyName,
        company_number: userData.contactNumber,
      };
    } else if (userData.userType === "sub-contractor") {
      completeUserData = {
        role: "subcontractor",
        email: userData.email,
        password: formData.password,
        company_name: userData.companyName,
        company_number: userData.contactNumber,
      };
    } else {
      setError("Invalid user type");
      setIsSubmitting(false);
      return;
    }
  
    try {
      await registerUser(completeUserData).unwrap();
      localStorage.removeItem("signupData");
      router.push("/signup/success");
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedData = localStorage.getItem("signupData")
    if (storedData) {
      setUserData(JSON.parse(storedData))
    } else {
      // If no data is found, redirect back to the signup page
      router.push("/signup")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when user types
    if (error) setError("")
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
        {/* Left side - Password Form */}
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
              maxWidth: "500px",
              boxShadow: "none", // Remove shadow
              border: "none", // Remove border
            }}
          >
            <CardHeader
              title={
                <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                  Set Your Password
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                  Create a secure password for your account
                </Typography>
              }
            />
            <form onSubmit={handleSubmit}>
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} className="rounded">
                    {error}
                  </Alert>
                )}

                {userData && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" className="text-gray-600">
                      Setting up password for: <strong className="text-gray-800">{userData.email}</strong>
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormLabel htmlFor="password" className="text-gray-700">
                    Password
                  </FormLabel>
                  <TextField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" className="text-gray-500">
                    Password must be at least 8 characters long
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <FormLabel htmlFor="confirmPassword" className="text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <TextField
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="rounded"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                  className="bg-[#90caf9] hover:bg-[#90caf9]/90 py-2"
                >
                  {isSubmitting ? "Creating Account..." : "Complete Sign Up"}
                </Button>
                <Link href="/signup" style={{ width: "100%", textAlign: "center", textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ "&:hover": { color: "text.primary" } }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Back to selection
                  </Typography>
                </Link>
              </CardActions>
            </form>
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
  src={ConstructionImage || "/placeholder.svg"}
              alt="Construction security"
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
