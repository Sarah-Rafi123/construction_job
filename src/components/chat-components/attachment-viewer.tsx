"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface AttachmentViewerProps {
  url: string
  onClose: () => void
}

export default function AttachmentViewer({ url, onClose }: AttachmentViewerProps) {
  const [isImage, setIsImage] = useState(false)
  const [isPdf, setIsPdf] = useState(false)

  useEffect(() => {
    // Determine file type based on extension
    const fileExtension = url.split(".").pop()?.toLowerCase()
    setIsImage(["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || ""))
    setIsPdf(fileExtension === "pdf")
  }, [url])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm  bg-opacity-50">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg text-black font-medium">Attachment </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 flex items-center justify-center overflow-auto" style={{ height: "calc(90vh - 70px)" }}>
          {isImage ? (
            <img src={url || "/placeholder.svg"} alt="Attachment" className="max-w-full max-h-full object-contain" />
          ) : isPdf ? (
            <iframe src={`${url}#view=FitH`} className="w-full h-full border-0" title="PDF Viewer" />
          ) : (
            <div className="text-center">
              <p className="mb-4">This file type cannot be previewed</p>
              <a
                href={url}
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
