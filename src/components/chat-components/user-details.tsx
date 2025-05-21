"use client"

import { Avatar } from "@mui/material"
import { useSelector } from "react-redux"
import { X } from "lucide-react"
import type { RootState } from "@/store"

interface UserDetailsProps {
  isOpen: boolean
  togglePanel: () => void
}

export default function UserDetails({ isOpen, togglePanel }: UserDetailsProps) {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { activeConversation } = useSelector((state: RootState) => state.chat)
  const user = activeConversation?.participants.find((u) => u._id !== currentUser?.id)

  if (!activeConversation) return null

  return (
    <>
      {/* Backdrop for mobile - only shows when panel is open on mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={togglePanel} />} 

      <div
        className={`
          fixed top-0 right-0 bottom-0 z-40
          w-80 h-screen overflow-y-auto bg-white border-l border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:static lg:transform-none lg:z-20
          ${isOpen ? "lg:block" : "lg:hidden"}
          pt-16 lg:pt-0
        `}
      >
        <div className="flex flex-col h-full">
          <button onClick={togglePanel} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 lg:hidden">
            <X size={20} className="text-gray-500" />
          </button>
          <div className="p-6 flex flex-col items-center border-b border-gray-200">
            <Avatar src={user?.profile_picture} sx={{ width: 80, height: 80 }} />

            <h2 className="mt-4 text-xl text-black font-medium text-center">{user?.full_name ?? user?.company_name}</h2>
          </div>
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Email</div>
                <div className="text-sm text-gray-900">{user?.email}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Company Name</div>
                <div className="text-sm text-gray-900">{user?.company_name}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Role</div>
                <div className="text-sm text-gray-900">
                  {user?.role === "main_contractor"
                    ? "Main Contractor"
                    : user?.role === "subcontractor"
                      ? "Sub Contractor"
                      : user?.role === "job_seeker"
                        ? "Job Seeker"
                        : user?.role}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">Description</div>
                <div className="text-sm text-gray-900">{user?.description}</div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="p-4"></div>
          </div>
        </div>
      </div>
    </>
  )
}
