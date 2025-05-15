"use client"

import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationDialogProps {
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (value: boolean) => void
  handleDelete: () => void
  isDeleting: boolean
}

export default function DeleteConfirmationDialog({
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  isDeleting,
}: DeleteConfirmationDialogProps) {
  if (!showDeleteConfirm) return null

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
        </div>
        <p className="mb-6 text-black">Are you sure you want to delete this job? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Job"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
