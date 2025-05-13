"use client"
import { Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Box, Container, Typography, Breadcrumbs, Paper, ThemeProvider, createTheme, Grid } from "@mui/material"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

const theme = createTheme({
  palette: {
    primary: {
      main: "#D49F2E",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    body1: {
      marginBottom: "1rem",
    },
  },
})

export default function ContactPage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Navbar />
      </div>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>
              Home
            </Link>
            <Typography color="text.primary">Contact Us</Typography>
          </Breadcrumbs>
        </Container>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="h1" component="h1" align="center" gutterBottom>
              Contact Us
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
              Have questions about our services or need assistance? We're here to help! Please feel free to reach out to
              us using the contact information below.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Mail size={48} color="#D49F2E" style={{ marginBottom: "1rem" }} />
                  <Typography variant="h2" component="h2" align="center">
                    Email Us
                  </Typography>
                  <Typography variant="body1" align="center">
                    For general inquiries and support:
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ fontWeight: "bold" }}>
              <a
                href="mailto:jay@constructions.co.uk?subject=Inquiry%20for%20Jay%20Constructions&body=Hello%20Jay%20Constructions%2C%0A%0AI%20am%20interested%20in%20your%20services%20and%20would%20like%20to%20request%20more%20information%20about%3A%0A%0A%0AThank%20you%2C%0A%0A"
                style={{ color: "#D49F2E", textDecoration: "none" }}
                className="hover:underline"
              >
                jay@constructions.co.uk
              </a>
            </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Phone size={48} color="#D49F2E" style={{ marginBottom: "1rem" }} />
                  <Typography variant="h2" component="h2" align="center">
                    Call Us
                  </Typography>
                  <Typography variant="body1" align="center">
                    For immediate assistance:
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ fontWeight: "bold" }}>
              <a
                href="tel:+1298786543218"
                style={{ color: "#D49F2E", textDecoration: "none" }}
                className="hover:underline"
              >
                +12 98786543218
              </a>
            </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 6 }}>
              <Typography variant="h2" component="h2">
                Office Hours
              </Typography>
              <Typography variant="body1">Monday - Friday: 9:00 AM - 5:00 PM</Typography>
              <Typography variant="body1">Saturday: 10:00 AM - 2:00 PM</Typography>
              <Typography variant="body1">Sunday: Closed</Typography>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
