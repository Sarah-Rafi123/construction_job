"use client"

import { useState } from "react"
import { Search,Menu, X } from "lucide-react"
import { Avatar } from "@mui/material"
import type { Conversation, User } from "@/lib/types"
import { formatPreviewText } from "@/lib/utils"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | undefined
  onSelectConversation: (conversation: Conversation) => void
  isMobileDrawerOpen: boolean
  toggleMobileDrawer: () => void
  users: User[]
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  isMobileDrawerOpen,
  toggleMobileDrawer,
  users,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) => {
    const user = users.find((u) => u.id === conversation.userId)
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const activeConversations = filteredConversations.filter((c) => !c.expired)
  const expiredConversations = filteredConversations.filter((c) => c.expired)

  return (
    <>
      {/* Mobile overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleMobileDrawer} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static w-80 h-full bg-white z-30 border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Conversations</h1>
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
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {activeConversations.map((conversation) => {
              const user = users.find((u) => u.id === conversation.userId)
              if (!user) return null

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    conversation.id === activeConversationId ? "bg-gray-100" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.preview.startsWith("You:") ? (
                          <span>
                            <span className="font-medium">You:</span>
                            {formatPreviewText(conversation.preview.substring(4))}
                          </span>
                        ) : (
                          formatPreviewText(conversation.preview)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {expiredConversations.length > 0 && (
              <div className="py-2 px-4 bg-gray-100">
                <p className="text-sm text-gray-500 font-medium">Expired chats</p>
              </div>
            )}

            {expiredConversations.map((conversation) => {
              const user = users.find((u) => u.id === conversation.userId)
              if (!user) return null

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    conversation.id === activeConversationId ? "bg-gray-100" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40 }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{formatPreviewText(conversation.preview)}</p>
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
