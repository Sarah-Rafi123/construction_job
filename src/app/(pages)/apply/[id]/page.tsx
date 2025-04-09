"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
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
} from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WorkIcon from "@mui/icons-material/Work"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"


import { sampleJobs } from "@/lib/sampleJobs"

export default function ApplyJobPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [job, setJob] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      const foundJob = sampleJobs.find((j) => j.id === Number(id))
      setJob(foundJob)
    }
  }, [id])

  if (!job) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading job details...</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>{job.logo}</Avatar>
            <Box>
              <Typography variant="h5">{job.title}</Typography>
              <Typography color="text.secondary">{job.company}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography color="text.secondary">{job.location}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WorkIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography color="text.secondary">{job.type}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AttachMoneyIcon sx={{ mr: 1, color: "text.secondary" }} />
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
            {job.tags.map((tag, index) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card sx={{ mb: 4 }}>
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
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1">Name: John Doe</Typography>
          <Typography variant="body1">
            Email: johndoe@{job.company.replace(/\s/g, "").toLowerCase()}.com
          </Typography>
          <Typography variant="body1">Phone: +1 (123) 456-7890</Typography>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button variant="outlined" onClick={() => alert("Job saved to your favorites")}>
          Save Job
        </Button>
        <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ bgcolor: "#1976d2" }}>
          Apply Now
        </Button>
      </Box>

      {/* Cover Letter Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Submit Your Cover Letter</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please describe your skills, area of expertise, and years of experience to apply for this job.
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter here..."
            error={Boolean(error)}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (coverLetter.trim().length < 20) {
                setError("Please provide a more detailed cover letter.")
              } else {
                setError("")
                setOpenDialog(false)
                alert("Your application has been submitted!")
                // You can send `coverLetter` to your API here
              }
            }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
