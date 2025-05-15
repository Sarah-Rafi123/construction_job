"use client"

import { ArrowLeft } from "lucide-react"

interface ActionButtonsProps {
  handleGoBack: () => void
  setIsEditing: (value: boolean) => void
  setShowDeleteConfirm: (value: boolean) => void
}

export default function ActionButtons({ handleGoBack, setIsEditing, setShowDeleteConfirm }: ActionButtonsProps) {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={handleGoBack}
        className="flex items-center bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="flex space-x-3">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-[#D49F2E] hover:bg-[#C48E1D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Job
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
