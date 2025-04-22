'use client'
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ConstructionImage from "../../../../public/assets/images/ConstructionImage.png";
import { Briefcase } from "lucide-react";
import MenuItem from "@mui/material/MenuItem";
import { loginUser } from "@/api/apiService";  // Import the API service

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
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError("");
  };

  const handleUserTypeChange = (e: any) => {
    setUserType(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      setError("Please select your account type");
      return;
    }

    if (!formData.email) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("userType", userType);

    try {
      const response = await loginUser(formData.email, formData.password); // Use the API service
      if (response) {
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/home"); // Redirect to home on successful login
        }, 1500);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        {/* Left side - Login Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 4 },
          }}
        >
          {/* Logo and brand name */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 4, ml: 4 }}>
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
              Jay
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
              className=""
            >
              <CardHeader
                title={
                  <Typography variant="h5" fontWeight="bold" textAlign="center" className="text-gray-800">
                    Log In
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" textAlign="center" className="text-gray-500">
                    Welcome back! Please log in to your account
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

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="user-type" className="text-gray-700">
                      Account Type
                    </FormLabel>
                    <FormControl fullWidth size="small">
                      <Select
                        id="user-type"
                        value={userType}
                        onChange={handleUserTypeChange}
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

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="email" className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <TextField
                      id="email"
                      type="email"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="rounded"
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <FormLabel htmlFor="password" className="text-gray-700">
                      Password
                    </FormLabel>
                    <TextField
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
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
                  </Box>

                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ textAlign: "right", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                    className="text-[#90caf9]"
                  >
                    Forgot Password?
                  </Typography>
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
                    {isSubmitting ? "Logging in..." : "Log In"}
                  </Button>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }} className="text-gray-500">
                      Don't have an account?
                    </Typography>
                    <Link href="/signup" style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                        className="text-[#90caf9]"
                      >
                        Sign Up
                      </Typography>
                    </Link>
                  </Box>
                </CardActions>
              </form>
            </Card>
          </Box>
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
  );
}
