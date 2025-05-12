"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Menu, X, ArrowLeft } from "lucide-react"
import { Avatar } from "@mui/material"
import { useGetInboxQuery } from "@/store/api/chatApi"
import type { Chat } from "../../types/chatTypes"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface ChatSidebarProps {
  isMobileDrawerOpen: boolean
  toggleMobileDrawer: () => void
}

export default function ChatSidebar({ isMobileDrawerOpen, toggleMobileDrawer }: ChatSidebarProps) {
  const { isLoading, isError } = useGetInboxQuery()
  const router = useRouter()
  const { inbox, activeConversation } = useSelector((state: RootState) => state.chat)
  const { currentUser } = useSelector((state: RootState) => state?.user)
  const [searchQuery, setSearchQuery] = useState("")

  const updateActiveConversation = (conversation: Chat) => {
    router.push(`/chat/${conversation._id}`)
  }

  const navigateToHome = () => {
    router.push("/home")
  }

  console.log("current user is", currentUser)
  console.log("inbox is", inbox)

  const filteredInbox = inbox?.filter((conversation) => {
    const otherParticipant = conversation.participants.find((participant) => participant._id !== currentUser?.id)
    if (!otherParticipant) return false
    const searchLower = searchQuery.toLowerCase()
    return (
      otherParticipant.full_name?.toLowerCase().includes(searchLower) ||
      otherParticipant.company_name?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <>
      {/* Mobile overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleMobileDrawer} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static w-80 h-screen border-b border-gray-300 bg-white z-30 
        transform transition-transform duration-300 ease-in-out
        ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col border-b border-gray-300 h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-300">
            <div className="flex items-center justify-between mb-4">
              {/* Back button with Conversations text */}
              <button
                onClick={navigateToHome}
                className="flex items-center text-gray-800 hover:text-[#D49F2E] transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <h1 className="text-2xl font-bold">Conversations</h1>
              </button>
              <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={toggleMobileDrawer}>
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Quick search"
                className="w-full pl-10 pr-4 py-2 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D49F2E]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredInbox?.map((conversation) => {
              const user = conversation.participants.find((u) => u._id !== currentUser?.id)
              if (!user) return null

              return (
                <div
                  key={conversation._id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    conversation._id === activeConversation?._id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => updateActiveConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={user.profile_picture} sx={{ width: 40, height: 40 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate">{user.full_name ?? user.company_name}</h3>
                        {/* {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )} */}
                      </div>
                      <p className="text-gray-600 text-sm truncate">{conversation.lastMessage.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-4 left-4 lg:hidden z-10 bg-[#D49F2E] text-white p-3 rounded-full shadow-lg"
        onClick={toggleMobileDrawer}
      >
        <Menu size={24} />
      </button>
    </>
  )
}
