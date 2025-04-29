"use client"

import type React from "react"

import { useRouter, useParams } from "next/navigation"
import {
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
  useEffect,
  useState,
  useRef,
} from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ThemeProvider,
  createTheme,
  IconButton,
  Paper,
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WorkIcon from "@mui/icons-material/Work"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import { sampleJobs } from "@/lib/sampleJobs"

// Create a custom theme with #D49F2E as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "#D49F2E", // Gold color
    },
    background: {
      default: "#ffffff", // White background
      paper: "#ffffff", // White card background
    },
    text: {
      primary: "#333333", // Dark text for better contrast with white background
      secondary: "#666666", // Medium gray for secondary text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#D49F2E",
          "&:hover": {
            backgroundColor: "#C08E20", // Slightly darker gold for hover state
          },
        },
        outlined: {
          borderColor: "#D49F2E",
          color: "#D49F2E",
          "&:hover": {
            borderColor: "#C08E20",
            backgroundColor: "rgba(212, 159, 46, 0.04)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(212, 159, 46, 0.1)",
          color: "#D49F2E",
        },
      },
    },
  },
})

interface Attachment {
  id: string
  name: string
  file: File
}

export default function ApplyJobPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [job, setJob] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [enquiryTitle, setEnquiryTitle] = useState("")
  const [enquiryText, setEnquiryText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [errors, setErrors] = useState({
    title: "",
    enquiry: "",
  })

  useEffect(() => {
    if (id) {
      const foundJob = sampleJobs.find((j) => j.id === Number(id))
      setJob(foundJob)
    }
  }, [id])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        file: file,
      }
      setAttachments([...attachments, newAttachment])
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  const handleSubmitEnquiry = () => {
    const newErrors = {
      title: "",
      enquiry: "",
    }

    let isValid = true

    if (!enquiryTitle.trim()) {
      newErrors.title = "Please enter a title for your enquiry"
      isValid = false
    }

    if (enquiryText.trim().length < 20) {
      newErrors.enquiry = "Please provide more details in your enquiry (minimum 20 characters)"
      isValid = false
    }

    setErrors(newErrors)

    if (isValid) {
      // Here you would normally send the data to your API
      console.log("Submitting enquiry:", {
        title: enquiryTitle,
        enquiry: enquiryText,
        attachments: attachments.map((a) => a.name),
        jobId: id,
      })

      alert("Your enquiry has been submitted!")
      setOpenDialog(false)

      // Reset form
      setEnquiryTitle("")
      setEnquiryText("")
      setAttachments([])
    }
  }

  if (!job) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 4, bgcolor: "background.default" }}>
          <Typography>Loading job details...</Typography>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#D49F2E", mr: 2 }}>{job.logo}</Avatar>
                <Box>
                  <Typography variant="h5">{job.title}</Typography>
                  <Typography color="text.secondary">{job.company}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: "#D49F2E" }} />
                <Typography color="text.secondary">{job.location}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WorkIcon sx={{ mr: 1, color: "#D49F2E" }} />
                <Typography color="text.secondary">{job.type}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: "#D49F2E" }} />
                <Typography color="text.secondary">{job.budget}</Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Duration:</strong> {job.duration}
              </Typography>

              <Typography variant="body2">
                <strong>Travel Radius:</strong> {job.radius} km
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Services Required:</strong> {job.services.join(", ")}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {job.tags.map(
                  (
                    tag:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<unknown, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined,
                    index: Key | null | undefined,
                  ) => (
                    <Chip key={index} label={tag} size="small" />
                  ),
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body1">
                This is a detailed job description for the {job.title} role at {job.company}. Please make sure to have
                relevant experience and availability to travel within {job.radius} km.
              </Typography>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body1">Name: John Doe</Typography>
              <Typography variant="body1">Email: johndoe@{job.company.replace(/\s/g, "").toLowerCase()}.com</Typography>
              <Typography variant="body1">Phone: +1 (123) 456-7890</Typography>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Button variant="outlined">Save Job</Button>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Apply Now
            </Button>
          </Box>

          {/* Enquiry Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: "8px",
                maxHeight: "90vh",
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              <ArrowBackIcon sx={{ mr: 1, cursor: "pointer" }} onClick={() => setOpenDialog(false)} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Send an enquiry
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              {/* Job Summary Card */}
              <Paper
                elevation={0}
                sx={{
                  m: 2,
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#D49F2E",
                    width: 56,
                    height: 56,
                    mr: 2,
                  }}
                >
                  {job.logo}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {job.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{job.radius} km away</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Enquiry Form */}
              <Box sx={{ px: 2, pb: 2 }}>
                {/* Title Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Title
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Interest in providing services"
                    value={enquiryTitle}
                    onChange={(e) => setEnquiryTitle(e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>

                {/* Enquiry Text Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Enquiry
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Describe your skills, expertise, and experience relevant to this job..."
                    value={enquiryText}
                    onChange={(e) => setEnquiryText(e.target.value)}
                    error={!!errors.enquiry}
                    helperText={errors.enquiry}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>

                {/* Attachments Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Attachments
                  </Typography>

                  {/* Attachment List */}
                  {attachments.map((attachment) => (
                    <Box
                      key={attachment.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        mb: 1,
                        bgcolor: "#f5f5f5",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
                        {attachment.name}
                      </Typography>
                      <IconButton size="small" onClick={() => removeAttachment(attachment.id)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  {/* Add Attachment Button */}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      textTransform: "none",
                      borderColor: "#ddd",
                      color: "#D49F2E",
                      "&:hover": {
                        borderColor: "#D49F2E",
                        bgcolor: "rgba(212, 159, 46, 0.04)",
                      },
                    }}
                  >
                    Add another attachment
                  </Button>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} />
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitEnquiry}
                sx={{
                  py: 1.5,
                  bgcolor: "#D49F2E", 
                  "&:hover": {
                    bgcolor: "#D49F2E",
                  },
                }}
              >
                Send enquiry
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
