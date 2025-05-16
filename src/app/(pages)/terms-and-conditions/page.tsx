"use client"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { Box, Container, Typography, Breadcrumbs, Paper, ThemeProvider, createTheme } from "@mui/material"
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

export default function TermsAndConditions() {
  return (
    <ThemeProvider theme={theme}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
                <Navbar  />
              </div>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>
              Home
            </Link>
            <Typography color="text.primary">Terms and Conditions</Typography>
          </Breadcrumbs>
        </Container>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="h1" component="h1" align="center" gutterBottom>
              Terms and Conditions
            </Typography>

            <Typography variant="h2" component="h2">
              1. Introduction
            </Typography>
            <Typography variant="body1">
              These Terms and Conditions ("Terms") govern your use of the construction job platform ("Platform")
              provided by Site-Pal ("we," "us," or "our"). By accessing or using the Platform, you agree to comply
              with these Terms. If you do not agree, please do not use the Platform.
            </Typography>

            <Typography variant="h2" component="h2">
              2. User Registration
            </Typography>
            <Typography variant="body1">
              To use the Platform, users must complete the registration process. You must provide accurate information,
              including but not limited to, your name, contact details, and business credentials. Unauthorized access to
              the Platform is prohibited.
            </Typography>

            <Typography variant="h2" component="h2">
              3. Job Posting
            </Typography>
            <Typography variant="body1">
              <strong>Main Contractors:</strong> You can post job listings for subcontractors or job seekers once
              verified by the Admin. You must provide accurate details regarding the job's description, location, and
              required services.
            </Typography>
            <Typography variant="body1">
              <strong>Subcontractors and Job Seekers:</strong> You can view posted jobs and apply or contact the poster
              as long as you are verified by the Admin.
            </Typography>
            <Typography variant="body1">
              <strong>Job Approval:</strong> All job postings are subject to approval by the Admin, and they may be
              rejected if they do not meet the platform's guidelines.
            </Typography>

            <Typography variant="h2" component="h2">
              4. Payments and Subscriptions
            </Typography>
            <Typography variant="body1">
              Payments for job postings and subscription services will be handled outside of the Platform, and we are
              not responsible for any transactions or billing issues.
            </Typography>

            <Typography variant="h2" component="h2">
              5. Content Ownership
            </Typography>
            <Typography variant="body1">
              You retain ownership of any content you upload, including job descriptions and inquiries. However, by
              posting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your
              content on the Platform.
            </Typography>

            <Typography variant="h2" component="h2">
              6. Privacy and Data Protection
            </Typography>
            <Typography variant="body1">
              We take your privacy seriously and will handle your data in accordance with our Privacy Policy. By using
              the Platform, you consent to the collection and use of your data as outlined in our Privacy Policy.
            </Typography>

            <Typography variant="h2" component="h2">
              7. Prohibited Activities
            </Typography>
            <Typography variant="body1">Users of the Platform agree not to:</Typography>
            <ul style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
              <li>1. Violate any applicable laws or regulations.</li>
              <li>2. Post misleading or false information.</li>
              <li>3. Engage in harmful or disruptive behavior that may negatively affect the Platform or other users.</li>
            </ul>

            <Typography variant="h2" component="h2">
              8. Liability
            </Typography>
            <Typography variant="body1">
              The Platform is provided "as is," and we do not guarantee the accuracy, reliability, or availability of
              the services. We are not liable for any damages arising from your use of the Platform.
            </Typography>

            <Typography variant="h2" component="h2">
              9. Termination
            </Typography>
            <Typography variant="body1">
              We reserve the right to terminate or suspend your access to the Platform at any time, for any reason,
              including but not limited to violations of these Terms.
            </Typography>

            <Typography variant="h2" component="h2">
              10. Governing Law
            </Typography>
            <Typography variant="body1">
              These Terms are governed by the laws of the jurisdiction in which Site-Pal operates, and any disputes
              will be resolved in the competent courts in that jurisdiction.
            </Typography>
          </Paper>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
