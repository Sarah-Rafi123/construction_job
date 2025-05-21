import { useState, useEffect, useRef } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, CircularProgress } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import * as pdfjsLib from "pdfjs-dist" // Import pdf.js library

interface CertificateViewerProps {
  open: boolean
  onClose: () => void
  certificateUrl: string | null
  title: string
}

export default function CertificateViewer({ open, onClose, certificateUrl, title }: CertificateViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (certificateUrl && open) {
      loadCertificate(certificateUrl)
    }
  }, [certificateUrl, open])

  // Load certificate (either image or PDF)
  const loadCertificate = async (url: string) => {
    try {
      setLoading(true)
      setError(false)

      const extension = url.split(".").pop()?.toLowerCase()

      if (extension === "pdf") {
        await loadPdf(url)
      } else {
        setPdfLoaded(false)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle PDF loading and rendering
  const loadPdf = async (url: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1 })
      const canvas = canvasRef.current
      if (canvas) {
        const context = canvas.getContext("2d")
        if (context) {
          canvas.height = viewport.height
          canvas.width = viewport.width
          await page.render({ canvasContext: context, viewport }).promise
        }
      }

      setPdfLoaded(true)
    } catch (err) {
      setError(true)
    }
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
            ) : pdfLoaded ? (
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: loading ? "none" : "block",
                }}
              />
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
                onError={handleImageError}
              />
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
