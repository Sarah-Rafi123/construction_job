"use client"

import Link from "next/link"

// Material UI imports
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { ThemeProvider, createTheme } from "@mui/material/styles"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    success: {
      main: "#22c55e",
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
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f9fafb",
          p: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Sign Up Successful!
                </Typography>
              </Box>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                Your account has been created successfully
              </Typography>
            }
          />
          <CardContent>
            <Typography color="text.secondary">Thank you for signing up. Your account is now ready to use.</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", p: 2 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ textTransform: "none" }}>
                Go to Dashboard
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Box>
    </ThemeProvider>
  )
}
