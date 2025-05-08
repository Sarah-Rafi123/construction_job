"use client"
import socket from "@/lib/socket/connectSocket"
import type React from "react"
import { useRouter, useParams } from "next/navigation"
import { useState, useRef } from "react"
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
import type { Message, Chat } from "@/types/chatTypes"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WorkIcon from "@mui/icons-material/Work"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { format } from "date-fns"
import Navbar from "@/components/layout/navbar"
import axios from "axios"
import { useGetJobByIdQuery } from "@/store/api/jobsApi"
import ProtectedRoute from "@/components/global/ProtectedRoute"
import Footer from "@/components/layout/footer"

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
  const id = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, error, isLoading } = useGetJobByIdQuery(id)
  const job = data?.job
  const [openDialog, setOpenDialog] = useState(false)
  const [enquiryTitle, setEnquiryTitle] = useState("")
  const [enquiryText, setEnquiryText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [errors, setErrors] = useState({
    title: "",
    enquiry: "",
  })

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

  async function uploadAttachments(attachments: { file: File }[]) {
    const formData = new FormData()

    attachments.forEach((attachment) => {
      formData.append("files", attachment.file)
    })

    try {
      const response = await axios.post("http://localhost:9000/api/v0/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      console.log("response is", response)
      return response.data.files // array of S3 URLs
    } catch (error) {
      console.error("File upload failed", error)
      throw error
    }
  }

  const handleSubmitEnquiry = async () => {
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

    if (isValid && job) {
      // Add null check for job
      try {
        // Upload attachments and get the array of file URLs
        const uploadedFiles = await uploadAttachments(attachments)
        console.log("Uploaded files:", uploadedFiles)

        // Here you would normally send the data to your API
        console.log("Submitting enquiry:", {
          title: enquiryTitle,
          enquiry: enquiryText,
          attachments: uploadedFiles, // This is already an array of URLs
          jobId: id,
        })

        // Check if created_by exists and has _id property
        const createdById = job.created_by 

        socket.emit(
          "sendMessage",
          {
            recipientId: createdById, // Use optional chaining and ensure created_by is an object
            enquiry: {
              title: enquiryTitle,
              description: enquiryText,
              attachments: uploadedFiles, // Use the array of URLs directly
              jobId: job._id,
            },
            type: "enquiry",
          },
          ({ data, error }: { data?: { message: Message; conversation: Chat }; error?: string }) => {
            if (!error && data) {
              console.log("message sent", data)
              router.push(`/chat/${data.conversation._id}`)
            } else {
              console.error("Message send failed:", error)
            }
          },
        )

        alert("Your enquiry has been submitted!")
        setOpenDialog(false)

        // Reset form
        setEnquiryTitle("")
        setEnquiryText("")
        setAttachments([])
      } catch (error) {
        console.error("Error submitting enquiry:", error)
        alert("Failed to submit your enquiry. Please try again.")
      }
    }
  }

  const handleGoBack = () => {
    router.push("/home")
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box sx={{ p: 4, bgcolor: "background.default", textAlign: "center", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading job details...
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  if (error || !job) {
    // Add check for job being undefined
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box sx={{ p: 4, bgcolor: "background.default", textAlign: "center", minHeight: "calc(100vh - 64px)" }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error loading job details
          </Typography>
          <Button variant="contained" onClick={handleGoBack}>
            Go Back
          </Button>
        </Box>
      </ThemeProvider>
    )
  }

  // Format the creation date
  const createdDate = new Date(job.createdAt)
  const formattedDate = format(createdDate, "MMMM dd, yyyy")

  // Get the first letter of each word in the job title for the avatar
  const avatarText = job.job_title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <Navbar messageCount={3} />
        </div>
        <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 64px)", mt: 6 }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Removed the back button from here */}

            <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#D49F2E", mr: 2 }}>{avatarText}</Avatar>
                  <Box>
                    <Typography variant="h5">{job.job_title}</Typography>
                    <Typography color="text.secondary">
                      {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: "#D49F2E" }} />
                  <Typography color="text.secondary">
                    {job.job_location
                      ? `${job.job_location.coordinates[0]}, ${job.job_location.coordinates[1]}`
                      : "Location not specified"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, color: "#D49F2E" }} />
                  <Typography color="text.secondary">{job.job_type}</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: "#D49F2E" }} />
                  <Typography color="text.secondary">
                    {job.budget ? `$${job.budget}` : "Budget not specified"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: "#D49F2E" }} />
                  <Typography color="text.secondary">Posted on {formattedDate}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Services Required:</strong>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {job.services.map((service) => (
                    <Chip
                      key={service._id}
                      label={`${service.service_name} ${service.resource_count > 0 ? `(${service.resource_count})` : ""}`}
                      size="small"
                    />
                  ))}
                </Box>

                {job.job_priority && (
                  <Chip
                    label="Priority"
                    size="small"
                    sx={{
                      mt: 2,
                      bgcolor: "rgba(255, 0, 0, 0.1)",
                      color: "#ff0000",
                      fontWeight: "bold",
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Job Description
                </Typography>
                <Typography variant="body1">
                  This is a detailed job description for the {job.job_title} role.
                  {job.job_type === "Full-Time"
                    ? " This is a full-time position requiring commitment to the entire project duration."
                    : " This is a part-time position with flexible hours."}
                  {job.services.length > 0 &&
                    ` We are looking for professionals with expertise in ${job.services.map((s) => s.service_name).join(", ")}.`}
                </Typography>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body1">Name: Project Manager</Typography>
                <Typography variant="body1">Email: contact@buildconnect.com</Typography>
                <Typography variant="body1">Phone: +1 (123) 456-7890</Typography>
              </CardContent>
            </Card>

            {/* Action Buttons - Repositioned as requested */}
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              {/* Back to Jobs button in the position of Apply Now */}
              <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
                Back
              </Button>

              {/* Apply Now button moved to the extreme right */}
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
                    {avatarText}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {job.job_title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {job.job_location
                          ? `${job.job_location.coordinates[0]}, ${job.job_location.coordinates[1]}`
                          : "Location not specified"}
                      </Typography>
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
      <Footer />
    </ProtectedRoute>
  )
}
