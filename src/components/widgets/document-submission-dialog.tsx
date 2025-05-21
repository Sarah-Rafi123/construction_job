"use client"

import type React from "react"

import { useState } from "react"
import { useSubmitContractorDocumentsMutation } from "@/store/api/documentSubmissionApi"
import { useGetUserProfileQuery } from "@/store/api/userProfileApi"

// MUI Components
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { styled } from "@mui/material/styles"
import ProtectedRoute from "../global/ProtectedRoute"

// Styled components for file upload
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

interface DocumentSubmissionDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  onSubmit?: (complianceCertificate: File | null, verificationCertificate: File | null) => Promise<void>
}

export default function DocumentSubmissionDialog({
  open,
  onClose,
  title = "Admin Approval Required",
}: DocumentSubmissionDialogProps) {
  // File state
  const [complianceCertificate, setComplianceCertificate] = useState<File | null>(null)
  const [verificationCertificate, setVerificationCertificate] = useState<File | null>(null)

  // Error state
  const [error, setError] = useState<string | null>(null)

  // Success state
  const [success, setSuccess] = useState(false)

  // API mutation hook
  const [submitDocuments, { isLoading }] = useSubmitContractorDocumentsMutation()

  const { refetch } = useGetUserProfileQuery()

  // Handle file selection for compliance certificate
  const handleComplianceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit")
        return
      }
      setComplianceCertificate(file)
      setError(null)
    }
  }

  // Handle file selection for verification certificate
  const handleVerificationFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit")
        return
      }
      setVerificationCertificate(file)
      setError(null)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate files
    if (!complianceCertificate || !verificationCertificate) {
      setError("Please upload both certificates")
      return
    }

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("compliance_certificate", complianceCertificate)
      formData.append("verification_certificate", verificationCertificate)

      // Submit documents
      const result = await submitDocuments(formData).unwrap()

      // Refetch user data to update admin_status
      await refetch()

      // Show success message
      setSuccess(true)

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setSuccess(false)
        setComplianceCertificate(null)
        setVerificationCertificate(null)
        onClose()
      }, 2000)
    } catch (err: any) {
      // console.error("Error submitting documents:", err)
      setError(err.data?.message || "Failed to submit documents. Please try again.")
    }
  }

  // Handle dialog close
  const handleClose = () => {
    if (!isLoading) {
      setComplianceCertificate(null)
      setVerificationCertificate(null)
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  return (
    <ProtectedRoute>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "500px" },
            maxHeight: { xs: "calc(100% - 16px)", sm: "90%" },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            fontWeight: "bold",
            color: "#D49F2E",
            pt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {title}
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}>
          {success ? (
            <Box sx={{ textAlign: "center", py: { xs: 2, sm: 4 } }}>
              <CheckCircleIcon color="success" sx={{ fontSize: { xs: 40, sm: 60 }, mb: { xs: 1, sm: 2 } }} />
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                Documents Submitted Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Your documents have been submitted for review. You will be notified once approved.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mt: 1 }}>
                Before you can post jobs, you need admin approval. Please upload your compliance and verification
                certificates.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "medium",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    mt: { xs: 2, sm: 1 },
                  }}
                >
                  Compliance Certificate
                </Typography>
                <Button
                  component="label"
                  variant={complianceCertificate ? "outlined" : "contained"}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mt: 1,
                    mb: 1,
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                  fullWidth
                  color={complianceCertificate ? "success" : "primary"}
                >
                  {complianceCertificate
                    ? complianceCertificate.name.length > 20
                      ? `${complianceCertificate.name.substring(0, 20)}...`
                      : complianceCertificate.name
                    : "Upload Compliance Certificate"}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleComplianceFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                  Accepted formats: PDF, JPG, PNG (Max size: 5MB)
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "medium",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    mt: { xs: 2, sm: 1 },
                  }}
                >
                  Verification Certificate
                </Typography>
                <Button
                  component="label"
                  variant={verificationCertificate ? "outlined" : "contained"}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mt: 1,
                    mb: 1,
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                  fullWidth
                  color={verificationCertificate ? "success" : "primary"}
                >
                  {verificationCertificate
                    ? verificationCertificate.name.length > 20
                      ? `${verificationCertificate.name.substring(0, 20)}...`
                      : verificationCertificate.name
                    : "Upload Verification Certificate"}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleVerificationFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                  Accepted formats: PDF, JPG, PNG (Max size: 5MB)
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            pt: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            "& > button": {
              mb: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
            },
          }}
        >
          <Button onClick={handleClose} disabled={isLoading} variant="outlined" sx={{ order: { xs: 2, sm: 1 } }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || success || !complianceCertificate || !verificationCertificate}
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ order: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}
          >
            {isLoading ? "Submitting..." : "Submit Documents"}
          </Button>
        </DialogActions>
      </Dialog>
    </ProtectedRoute>
  )
}
