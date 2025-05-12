"use client"
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

export default function PrivacyPolicy() {
  return (
    <ThemeProvider theme={theme}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar messageCount={3} />
      </div>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>
              Home
            </Link>
            <Typography color="text.primary">Privacy Policy</Typography>
          </Breadcrumbs>
        </Container>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="h1" component="h1" align="center" gutterBottom>
              Privacy Policy
            </Typography>

            <Typography variant="h2" component="h2">
              1. Introduction
            </Typography>
            <Typography variant="body1">
              This Privacy Policy explains how Jay Constructions LLC ("we," "us," or "our") collects, uses, and protects
              your personal information when you use our construction job platform ("Platform"). By accessing or using
              the Platform, you consent to the collection and use of your information as described in this Privacy
              Policy.
            </Typography>

            <Typography variant="h2" component="h2">
              2. Information We Collect
            </Typography>
            <Typography variant="body1">We may collect the following types of personal information:</Typography>
            <ul style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
              <li>
                <strong>Contact Information:</strong> Name, email address, phone number, and company details.
              </li>
              <li>
                <strong>Job Posting Information:</strong> Details about the job posting, including title, description,
                location, and services required.
              </li>
              <li>
                <strong>User Account Information:</strong> Account details and verification documents for main
                contractors, subcontractors, and job seekers.
              </li>
              <li>
                <strong>Usage Data:</strong> Information on how you interact with the Platform, including IP address,
                browser type, and device information.
              </li>
            </ul>

            <Typography variant="h2" component="h2">
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1">We use your information to:</Typography>
            <ul style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
              <li>1. Provide and maintain the Platform's functionality.</li>
              <li>2. Verify users and ensure compliance with Platform guidelines.</li>
              <li>3. Communicate with you regarding job postings, inquiries, and other services.</li>
              <li>4. Improve the user experience and performance of the Platform.</li>
            </ul>

            <Typography variant="h2" component="h2">
              4. Data Sharing
            </Typography>
            <Typography variant="body1">We may share your personal information with:</Typography>
            <ul style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
              <li>
                <strong>Admin:</strong> To verify your details and approve job postings.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> To support our Platform (e.g., hosting providers,
                payment processors) but only for the purpose of delivering services on our behalf.
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law or to protect our rights, we may disclose your
                information to comply with legal obligations.
              </li>
            </ul>

            <Typography variant="h2" component="h2">
              5. Data Security
            </Typography>
            <Typography variant="body1">
              We implement reasonable security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100%
              secure, and we cannot guarantee the absolute security of your data.
            </Typography>

            <Typography variant="h2" component="h2">
              6. Your Rights
            </Typography>
            <Typography variant="body1">You have the right to:</Typography>
            <ul style={{ marginBottom: "1rem", paddingLeft: "2rem" }}>
              <li>1. Access, update, or delete your personal information.</li>
              <li>2. Opt out of certain communications from us.</li>
              <li>3. Request that we stop processing your personal data under certain circumstances.</li>
            </ul>
            <Typography variant="body1">
              To exercise these rights, please contact us at jay@constructions.co.uk.
            </Typography>

            <Typography variant="h2" component="h2">
              7. Cookies
            </Typography>
            <Typography variant="body1">
              We use cookies to enhance your experience on the Platform. Cookies help us analyze traffic, provide
              personalized content, and ensure the proper functionality of the Platform.
            </Typography>

            <Typography variant="h2" component="h2">
              8. Changes to This Policy
            </Typography>
            <Typography variant="body1">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated effective date. By continuing to use the Platform, you agree to the revised Privacy Policy.
            </Typography>
          </Paper>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}
