"use client"

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
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormLabel from "@mui/material/FormLabel"
import Divider from "@mui/material/Divider"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Create a dark theme instance to match the black background
const darkTheme = createTheme({
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

export default function SignupPage() {
  const [userType, setUserType] = useState<string>("")
  const router = useRouter()

  const handleContinue = () => {
    if (userType) {
      router.push(`/signup/${userType}`)
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography variant="h3" color="white" sx={{ mb: 4, fontWeight: "bold" }}>
          Welcome to Our Platform
        </Typography>

        <Card sx={{ width: "100%", maxWidth: "500px", bgcolor: "background.paper", mb: 4 }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight="bold" textAlign="center" color="white">
                Sign Up
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Please select your account type to continue
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <FormLabel htmlFor="user-type" sx={{ display: "block", mb: 1, fontSize: "0.875rem", fontWeight: 500 }}>
                I want to sign up as a
              </FormLabel>
              <FormControl fullWidth size="small">
                <Select
                  id="user-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: "background.paper" }}
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
              sx={{ textTransform: "none" }}
            >
              Continue
            </Button>
          </CardActions>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Already have an account?
            </Typography>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button variant="outlined" fullWidth sx={{ textTransform: "none" }}>
                Log In
              </Button>
            </Link>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  )
}
