"use client"

import type React from "react"
import { useState, useRef } from "react"

// Material UI imports
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import CloseIcon from "@mui/icons-material/Close"

interface FileUploaderProps {
  accept: string
  maxSize: number
  label: string
  multiple?: boolean
}

export function FileUploader({ accept, maxSize, label, multiple = false }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)

    // Check file size
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the ${maxSize}MB limit`)
      return
    }

    if (multiple) {
      setFiles((prev) => [...prev, ...selectedFiles])
    } else {
      setFiles(selectedFiles)
    }

    // Reset the input value so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setShowCamera(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError("Could not access camera")
      // console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })

            if (multiple) {
              setFiles((prev) => [...prev, file])
            } else {
              setFiles([file])
            }

            stopCamera()
          }
        }, "image/jpeg")
      }
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
      />

      {showCamera ? (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 4 }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Button variant="contained" onClick={capturePhoto} sx={{ textTransform: "none" }}>
              Capture
            </Button>
            <Button variant="outlined" onClick={stopCamera} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={triggerFileInput}
            startIcon={<UploadFileIcon />}
            sx={{ textTransform: "none" }}
          >
            Upload File
          </Button>

          {accept.includes("image") && (
            <Button
              variant="outlined"
              onClick={startCamera}
              startIcon={<CameraAltIcon />}
              sx={{ textTransform: "none" }}
            >
              Use Camera
            </Button>
          )}
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      {files.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {files.map((file, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}
            >
              <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {file.name}
              </Typography>
              <IconButton size="small" onClick={() => removeFile(index)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
