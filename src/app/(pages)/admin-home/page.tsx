"use client"

import type React from "react"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  type SelectChangeEvent,
  CircularProgress,
  Alert,
  Snackbar,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SortIcon from "@mui/icons-material/Sort"
import { useGetUserProfileQuery } from "@/store/api/userProfileApi"
import { useRouter } from "next/navigation"
import { useGetPendingContractorsQuery, useVerifyContractorDocumentsMutation } from "@/store/api/pendingContractorApi"
import CertificateViewer from "@/components/widgets/certificate-viewer"

const theme = createTheme({
  palette: {
    primary: {
      main: "#D49F2E",
    },
    secondary: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#666",
        },
      },
    },
  },
})

export default function AdminHome() {
  const router = useRouter()
  const { data: userData, isLoading: isUserLoading } = useGetUserProfileQuery()
  const {
    data: contractorsData,
    isLoading: isContractorsLoading,
    error: contractorsError,
  } = useGetPendingContractorsQuery()
  const [verifyContractor, { isLoading: isVerifying }] = useVerifyContractorDocumentsMutation()

  const [darkMode, setDarkMode] = useState(false)
  const [filter, setFilter] = useState("All Contractors")
  const [searchQuery, setSearchQuery] = useState("")

  // Certificate viewer state
  const [certificateViewerOpen, setCertificateViewerOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null)
  const [certificateTitle, setCertificateTitle] = useState("")

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname)

    const handlePopState = () => {

      window.history.pushState(null, "", window.location.pathname)

      setNotification({
        open: true,
        message: "Back navigation is disabled for security reasons",
        severity: "info",
      })
    }

    // Add event listener for back button
    window.addEventListener("popstate", handlePopState)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  // Handle viewing certificate
  const handleViewCertificate = (url: string | null, title: string) => {
    setSelectedCertificate(url)
    setCertificateTitle(title)
    setCertificateViewerOpen(true)
  }

  const handleAccept = async (id: string) => {
    try {
      await verifyContractor({
        id,
        admin_status: "verified",
      }).unwrap()

      setNotification({
        open: true,
        message: "Contractor verified successfully",
        severity: "success",
      })
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to verify contractor",
        severity: "error",
      })
    }
  }

  // Handle decline contractor
  const handleDecline = async (id: string) => {
    try {
      await verifyContractor({
        id,
        admin_status: "rejected",
      }).unwrap()

      setNotification({
        open: true,
        message: "Contractor declined successfully",
        severity: "success",
      })
    } catch (error) {
      // console.error("Error declining contractor:", error)
      setNotification({
        open: true,
        message: "Failed to decline contractor",
        severity: "error",
      })
    }
  }

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    })
  }

  // Filter contractors based on search query
  const filteredContractors =
    contractorsData?.data.pending_contractors.filter(
      (contractor) =>
        contractor.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contractor.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  // Loading state
  if (isContractorsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Loading contractors...</Typography>
      </Box>
    )
  }

  // Render mobile card view
  const renderMobileView = () => {
    if (filteredContractors.length === 0) {
      return (
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography variant="body1">No pending contractors found</Typography>
        </Box>
      )
    }
    useEffect(() => {
  if (contractorsError) {
    router.push("/login");
  }
}, [contractorsError, router]);


    return (
      <Stack spacing={2}>
        {filteredContractors.map((contractor) => (
          <Card key={contractor._id} sx={{ borderRadius: 2, overflow: "visible" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#D49F2E",
                    width: 36,
                    height: 36,
                    mr: 2,
                  }}
                >
                  {contractor.company_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {contractor.company_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contractor.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Compliance Certificate
                </Typography>
                {contractor.compliance_certificate ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        handleViewCertificate(
                          contractor.compliance_certificate,
                          `${contractor.company_name} - Compliance Certificate`,
                        )
                      }
                    >
                      View
                    </Button>
                  </Box>
                ) : (
                  <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Verification Certificate
                </Typography>
                {contractor.verification_certificate ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1, fontSize: 18 }} />
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        handleViewCertificate(
                          contractor.verification_certificate,
                          `${contractor.company_name} - Verification Certificate`,
                        )
                      }
                    >
                      View
                    </Button>
                  </Box>
                ) : (
                  <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                )}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon />}
                  onClick={() => handleDecline(contractor._id)}
                  sx={{ borderRadius: 2, flex: 1 }}
                  disabled={isVerifying}
                  size="small"
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleAccept(contractor._id)}
                  sx={{ borderRadius: 2, color: "white", flex: 1 }}
                  disabled={isVerifying}
                  size="small"
                >
                  Accept
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    )
  }

  // Render desktop table view
  const renderDesktopView = () => {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Company Name <SortIcon sx={{ ml: 0.5, fontSize: 18, color: "#999" }} />
                </Box>
              </TableCell>
              <TableCell align="center">Compliance Certificate</TableCell>
              <TableCell align="center">Verification Certificate</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No pending contractors found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredContractors.map((contractor) => (
                <TableRow key={contractor._id}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "#D49F2E",
                          width: 36,
                          height: 36,
                          mr: 2,
                        }}
                      >
                        {contractor.company_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {contractor.company_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contractor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {contractor.compliance_certificate ? (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            handleViewCertificate(
                              contractor.compliance_certificate,
                              `${contractor.company_name} - Compliance Certificate`,
                            )
                          }
                        >
                          View
                        </Button>
                      </Box>
                    ) : (
                      <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {contractor.verification_certificate ? (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircleIcon sx={{ color: "#4CAF50", mr: 1 }} />
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            handleViewCertificate(
                              contractor.verification_certificate,
                              `${contractor.company_name} - Verification Certificate`,
                            )
                          }
                        >
                          View
                        </Button>
                      </Box>
                    ) : (
                      <Chip label="Missing" size="small" sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={() => handleDecline(contractor._id)}
                        sx={{ borderRadius: 2 }}
                        disabled={isVerifying}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAccept(contractor._id)}
                        sx={{ borderRadius: 2, color: "white" }}
                        disabled={isVerifying}
                      >
                        Accept
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ThemeProvider theme={theme}>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Header />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                mt: { xs: 5, sm: 10 },
                px: { xs: 1, sm: 0 },
              }}
            >
              <Typography className="text-black" variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold">
                Hi Admin!
              </Typography>
            </Box>

            {/* Responsive content - switch between table and cards */}
            {isMobile ? renderMobileView() : renderDesktopView()}
          </Container>
          <CertificateViewer
            open={certificateViewerOpen}
            onClose={() => setCertificateViewerOpen(false)}
            certificateUrl={selectedCertificate}
            title={certificateTitle}
          />
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </ProtectedRoute>
  )
}
