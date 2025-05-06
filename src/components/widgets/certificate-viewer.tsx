"use client"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, CircularProgress } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface CertificateViewerProps {
  open: boolean
  onClose: () => void
  certificateUrl: string | null
  title: string
}

export default function CertificateViewer({ open, onClose, certificateUrl, title }: CertificateViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleImageLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleImageError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!certificateUrl ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <Typography color="error">Certificate not available</Typography>
          </Box>
        ) : (
          <Box
            position="relative"
            width="100%"
            height="500px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {loading && (
              <Box
                position="absolute"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
              >
                <CircularProgress />
              </Box>
            )}

            {error ? (
              <Typography color="error">
                Failed to load certificate. The file may be unavailable or in an unsupported format.
              </Typography>
            ) : (
              <img
                src={certificateUrl || "/placeholder.svg"}
                alt={title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: loading ? "none" : "block",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
