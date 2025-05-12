"use client"

import { Avatar } from "@mui/material"
import { useSelector } from "react-redux"
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
    <div
      className={`
    border-l border-gray-200 bg-white
    w-80 h-full overflow-y-auto
    fixed right-0 top-0 bottom-0 z-20
    transition-transform duration-300 ease-in-out
    hidden
    ${isOpen ? "lg:translate-x-0 lg:block" : "lg:hidden"}
    lg:static lg:transform-none
  `}
    >
      <div className="flex flex-col h-full">
        {/* User profile */}
        <div className="p-6 flex flex-col items-center border-b border-gray-200">
          <Avatar src={user?.profile_picture} sx={{ width: 80, height: 80 }} />

          <h2 className="mt-4 text-xl text-black font-medium text-center">{user?.full_name ?? user?.company_name}</h2>
          {/* <p className={`text-sm ${user?.isOnline ? "text-green-500" : "text-gray-500"}`}>{user?.isOnline ? "Online" : "Offline"}</p> */}

          {/* <div className="flex gap-4 mt-4">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Phone size={20} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Mail size={20} />
            </button>
          </div> */}
        </div>

        {/* User details */}
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

        {/* Tasks */}
        <div className="flex-1">
          <div className="p-4"></div>
        </div>
      </div>
    </div>
  )
}
