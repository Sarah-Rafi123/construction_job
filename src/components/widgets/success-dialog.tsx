"use client"

import type React from "react"
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

interface SuccessDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
  redirecting?: boolean
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  onClose,
  title = "Success!",
  message = "Your job has been posted successfully.",
  redirecting = false,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2 },
          py: { xs: 2, sm: 3 },
          m: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 3, sm: 4 },
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: { xs: 60, sm: 80 },
              color: "success.main",
              mb: { xs: 2, sm: 3 },
            }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              maxWidth: "80%",
              mx: "auto",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {message}
          </Typography>

          {redirecting && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Redirecting to home page...
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3, justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {redirecting ? "Close" : "Go to Home"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessDialog
