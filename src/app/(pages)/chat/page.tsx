"use client"

import { useState } from "react"
import ChatSidebar from "@/components/chat-components/chat-sidebar"
import ChatWindow from "@/components/chat-components/chat-window"
import UserDetails from "@/components/chat-components/user-details"
import { conversations, users } from "@/lib/data"
import type { Conversation, User } from "@/lib/types"

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[1])
  const [activeUser, setActiveUser] = useState<User | null>(
    users.find((user) => user.id === conversations[1]?.userId) || null,
  )
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true)

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setActiveUser(users.find((user) => user.id === conversation.userId) || null)
    setIsMobileDrawerOpen(false)
  }

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen)
  }

  const toggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleConversationSelect}
        isMobileDrawerOpen={isMobileDrawerOpen}
        toggleMobileDrawer={toggleMobileDrawer}
        users={users}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatWindow
          conversation={activeConversation}
          user={activeUser}
          toggleMobileDrawer={toggleMobileDrawer}
          toggleDetailsPanel={toggleDetailsPanel}
        />
      </div>

      {/* Right sidebar - User details */}
      <UserDetails
        user={activeUser}
        isOpen={isDetailsPanelOpen}
        togglePanel={toggleDetailsPanel}
        conversation={activeConversation}
      />
    </div>
  )
}
