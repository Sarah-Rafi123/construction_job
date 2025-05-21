"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface CertificateViewerProps {
  open: boolean
  onClose: () => void
  certificateUrl: string | null
  title: string
}

export default function CertificateViewer({ open, onClose, certificateUrl, title }: CertificateViewerProps) {
  const [isImage, setIsImage] = useState(false)
  const [isPdf, setIsPdf] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (certificateUrl && open) {
      setLoading(true)
      setError(false)

      // Determine file type based on extension
      const fileExtension = certificateUrl.split(".").pop()?.toLowerCase()
      setIsImage(["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || ""))
      setIsPdf(fileExtension === "pdf")

      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [certificateUrl, open])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg text-black font-medium">{title || "Certificate"}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 flex items-center justify-center overflow-auto" style={{ height: "calc(90vh - 70px)" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-[#D49F2E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading document...</p>
            </div>
          ) : error || !certificateUrl ? (
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load document</p>
              <p className="text-gray-600">The file may be unavailable or in an unsupported format.</p>
            </div>
          ) : isImage ? (
            <img
              src={certificateUrl || "/placeholder.svg"}
              alt={title}
              className="max-w-full max-h-full object-contain"
              onError={() => setError(true)}
            />
          ) : isPdf ? (
            <iframe
              src={`${certificateUrl}#view=FitH`}
              className="w-full h-full border-0"
              title={title}
              onError={() => setError(true)}
            />
          ) : (
            <div className="text-center">
              <p className="mb-4">This file type cannot be previewed</p>
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#D49F2E] text-white rounded-md hover:bg-[#C48E1D] transition-colors"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
